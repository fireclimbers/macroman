import React from 'react';
import { useParams, useNavigate, Link } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import produce from 'immer';

import { collection, getDoc, getDocs, doc, query, where, limit, updateDoc } from "firebase/firestore";


const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};


//const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  //userSelect: "none",
  //padding: grid * 2,
  //margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  background: isDragging ? "lightgreen" : "",

  // styles we need to apply on draggables
  ...draggableStyle
});

const getListStyle = isDraggingOver => ({
  //background: isDraggingOver ? "lightblue" : "lightgrey",
  //padding: grid,
  //width: 250
});


class RecipeClass extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      id: props.params.recipeId,
      name: '',
      servings: '',
      text: '',
      items: [],

      search: '',
      searchResults: [],
      editing: -1,
    };
    this.handleChange = this.handleChange.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
  }
  componentDidMount() {
    this.fetchRecipe();


    // name | amount | cals | visible | delete
  }
  async fetchRecipe() {
    const docRef = doc(this.props.db, "recipes", this.state.id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      //console.log("Document data:", docSnap.data());
      let data = docSnap.data();
      for (let i=0;i<data.items.length;i++) {
        let item = data.items[i];
        const iRef = doc(this.props.db, "fooditems", item.id);
        const iSnap = await getDoc(iRef);
        data.items[i].item = iSnap.data();
      }
      this.setState({
        name: data.name,
        servings: data.servings,
        text:data.text,
        items: data.items //[{id, name, amount, visible, item}]
      })
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }
  }
  handleKeyPress(e) {
    if(e.key === 'Enter'){
      this.querySearch();
    }
  }
  async querySearch(e) {
    if (this.state.search === '') {
      this.setState({
        searchResults: []
      })
      return;
    }
    const ref = collection(this.props.db, "fooditems");
    const q = query(ref, where('name','>=',this.state.search), where('name','<=',this.state.search+'\uf8ff'), limit(5))
    const querySnapshot = await getDocs(q);

    let searchResults = [];
    querySnapshot.forEach((doc_) => {
      const data = doc_.data();
      data.id = doc_.id;
      searchResults.push(data);
    });

    this.setState({
      searchResults
    })
  }
  async addItem(idx, e) {
    let data = {...this.state.searchResults[idx]};
    let newItem = {
      id: data.id,
      name: data.name,
      amount: data.amount,
      volume: data.volume,
      visible: true,
      item: data
    }

    this.setState(state => ({
      items: state.items.concat(newItem),
      searchResults: [],
      search: ''
    }));
  }
  async save(e) {
    let items = [];
    let totalCals = 0;
    for (let i=0;i<this.state.items.length;i++) {
      let item = this.state.items[i];
      if (item.visible) {
        totalCals += (parseInt(item.item.cals)*(parseInt(item.item.servings)/parseInt(item.item.totalservings))*(parseFloat(item.amount)/parseFloat(item.item.amount)));
      }

      items.push({
        id:item.id,
        amount:item.amount,
        volume:item.volume,
        name:item.name,
        visible:item.visible
      })
    }
    let editedItem = {
      name: this.state.name,
      servings: this.state.servings,
      text:this.state.text,
      totalCals: totalCals,
      items: items
    }
    const iRef = doc(this.props.db, "recipes", this.state.id);
    await updateDoc(iRef, editedItem);

  }
  onDragEnd(result) {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const items = reorder(
      this.state.items,
      result.source.index,
      result.destination.index
    );

    this.setState({
      items
    });
  }
  startEdit(i, e) {
    this.setState({
      editing: i
    })
  }
  handleChange(e) {
    var args = {};
    args[e.target.id] = e.target.value;
    this.setState(args);
  }
  handleItemChange(field, idx, e) {
    const value = e.target.value;
    this.setState(produce((draft) => {
      draft.items[idx][field] = value;
    }))
    //this.state.items[idx][field] = e.target.value;
    //this.setState({items:this.state.items});
  }
  handleItemChangeConvert(field, idx, e) {
    const value = e.target.value;
    this.setState(produce((draft) => {
      const item = draft.items[idx];

      if (!item.item.volume || item.item.volume === '') {
        item[field] = value;
        return;
      }

      if (field === 'amount') {
        item[field] = value;
        let scale = value/item.item.amount;
        item.volume = item.item.volume*scale;
      } else if (field === 'volume') {
        item[field] = value;
        let scale = value/item.item.volume;
        item.amount = item.item.amount*scale;
      }
    }))
  }
  toggleVisible(index, e) {
    this.setState(produce((draft) => {
      draft.items[index].visible = !draft.items[index].visible;
    }))
  }
  deleteItem(index, e) {
    this.state.items.splice(index, 1);
    this.setState(state => ({
      items: this.state.items,
    }));
  }
  render() {

    // TODO
    // have two pages: one for new/choose recipe, one for displaying/editing recipe
    // create new recipe
    // search for food in db -> query by filter -> see results to click -> add item to recipe
    // recipe schema is: name, servings, text, [{fooditem_id, ratio, visible}]




    // search food -> select food -> Add item -> fetch food -> add to list
    // edit ratio/visible
    // edit order
    // delete item
    // save



    /*var totalG = this.state.items.reduce(function (sum, item_) {
      let item = item_.item;
      if (item.visible)
        return sum + (item.protein*item.servings/item.totalservings) + (item.fat*item.servings/item.totalservings) + (item.carbs*item.servings/item.totalservings);
      return sum;
    }, 0);

    var totalProtein = this.state.items.reduce(function (sum, item_) {
      let item = item_.item;
      if (item.visible)  
        return sum + (item.protein*item.servings/item.totalservings);
      return sum;
    }, 0);

    var totalFat = this.state.items.reduce(function (sum, item_) {
      let item = item_.item;
      if (item.visible)  
        return sum + (item.fat*item.servings/item.totalservings);
      return sum;
    }, 0);

    var totalCarbs = this.state.items.reduce(function (sum, item_) {
      let item = item_.item;
      if (item.visible)  
        return sum + (item.carbs*item.servings/item.totalservings);
      return sum;
    }, 0);*/

    var totalCals = this.state.items.reduce(function (sum, item_) {
      let item = item_.item;
      if (item_.visible)
        return sum + (parseInt(item.cals)*(parseInt(item.servings)/parseInt(item.totalservings))*(parseFloat(item_.amount)/parseFloat(item.amount)));
      return sum;
    }, 0);

    return (
      <div className="container">
        <br/>
        <Link className="button" to="/macroman/" style={{marginRight:12}}>Back</Link>
        <button className="button" style={{marginRight:36}} onClick={this.save.bind(this)}>Save</button>
        <span className="title" style={{marginRight:24}}>{this.state.name}</span>
        <span className="subtitle is-5">{(totalCals/(this.state.servings || 1)).toFixed(2)} cals</span>
        <br/><br/>

        <div className="field has-addons">
          <div className="control">
            <button onClick={(e) => this.setState({servings: this.state.servings-1})} className="button" disabled={this.state.servings < 2}>
              <span className="icon is-small">
                <i className="fa fa-chevron-left"></i>
              </span>
            </button>
          </div>
          <div className="control">
            <button className="button is-static">
              {this.state.servings} {'serving'+(this.state.servings === 1 ? '': 's')}
            </button>
          </div>
          <div className="control">
            <button onClick={(e) => this.setState({servings: this.state.servings+1})} className="button">
              <span className="icon is-small">
                <i className="fa fa-chevron-right"></i>
              </span>
            </button>
          </div>
        </div>

        



        <div className={"dropdown is-fullwidth"+(this.state.searchResults.length > 0 ? ' is-active':'')}>
          <div className="dropdown-trigger">
            <div className="field has-addons">
              <p className="control is-expanded">
                <input onKeyPress={this.handleKeyPress.bind(this)} id="search" className="input is-fullwidth" autoComplete="off" type="text" placeholder={"Enter text"} value={this.state.search} onChange={this.handleChange}/>
              </p>
              <p className="control">
                <button onClick={this.querySearch.bind(this)} className="button">Search</button>
              </p>
            </div>
          </div>
          <div className="dropdown-menu" id="dropdown-menu" role="menu">
            <div className="dropdown-content">
              {this.state.searchResults.map((item,index) => {
                return <a key={'search'+index} className="dropdown-item" onClick={this.addItem.bind(this,index)}>{item.name+' '+item.amount+' '+item.unit}</a>
              })}
            </div>
          </div>
        </div>

        

        

        <DragDropContext onDragEnd={this.onDragEnd}>
          <table className="table is-fullwidth is-hoverable is-narrow">
            <thead>
              <tr>
                <th>Name</th>
                <th>Amount</th>
                <th>Volume</th>
                <th>Cals</th>
                <th></th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <Droppable droppableId="droppable">
              {(provided, snapshot) => (
                <tbody
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={getListStyle(snapshot.isDraggingOver)}>
                  {this.state.items.map((item, index) => (
                    <Draggable key={'drag'+index} draggableId={'drag'+index} index={index} isDragDisabled={this.state.editing !== -1}>
                      {(provided, snapshot) => (
                        <tr
                          className={item.visible ? '' : 'has-text-grey-lighter'}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={getItemStyle(
                            snapshot.isDragging,
                            provided.draggableProps.style
                          )}
                        >
                          <td style={this.state.editing === index ? {padding:0} : {}}>
                            {this.state.editing === index ?
                              <input value={item.name} onChange={this.handleItemChange.bind(this,'name',index)} className="input" type="text" placeholder="Name"/>
                              :
                              item.name
                            }
                          </td>
                          <td style={this.state.editing === index ? {padding:0} : {}}>
                            {this.state.editing === index ?
                              <div className="field has-addons">
                                <p className="control">
                                  <input value={item.amount} onChange={this.handleItemChangeConvert.bind(this,'amount',index)} className="input" type="text" placeholder="Amount"/>
                                </p>
                                <p className="control">
                                  <button className="button is-static">
                                    {item.item.unit}
                                  </button>
                                </p>
                              </div>
                              
                              :
                              item.amount+' '+item.item.unit
                            }
                          </td>
                          <td style={this.state.editing === index ? {padding:0} : {}}>
                            {this.state.editing === index && (item.item.volume && item.item.volume !== '') ?
                              <div className="field has-addons">
                                <p className="control">
                                  <input value={item.volume} onChange={this.handleItemChangeConvert.bind(this,'volume',index)} className="input" type="text" placeholder="Volume"/>
                                </p>
                                <p className="control">
                                  <button className="button is-static">
                                    {item.item.vol_unit || ''}
                                  </button>
                                </p>
                              </div>
                              
                              :
                              (item.volume || '')+' '+(item.item.vol_unit || '')
                            }
                          </td>
                          <td>{(parseInt(item.item.cals)*(parseInt(item.item.servings)/parseInt(item.item.totalservings))*(parseFloat(item.amount)/parseFloat(item.item.amount))).toFixed(2)}</td>
                          
                          <td>
                            <p className="buttons" key={'edit'+index+'_'+this.state.editing}>
                              {this.state.editing !== index ? <button className="button is-small" onClick={(e) => this.setState({editing:index})}>
                                <span className="icon is-small has-text-danger">
                                  <i className="fas fa-pen"></i>
                                </span>
                              </button> : <button className="button is-small" onClick={(e) => this.setState({editing:-1})}>
                                <span className="icon is-small has-text-danger">
                                  <i className="fas fa-check"></i>
                                </span>
                              </button>}
                            </p>
                          </td>
                          <td>
                            <p className="buttons">
                              <button className="button is-small" onClick={this.toggleVisible.bind(this, index)}>
                                <span className={"icon is-small "+(item.visible ? '' : 'has-text-grey-lighter')}>
                                  <i className="fas fa-eye"></i>
                                </span>
                              </button>
                            </p>
                          </td>
                          <td>
                            <p className="buttons">
                              <button className="button is-small" onClick={this.deleteItem.bind(this, index)}>
                                <span className="icon is-small has-text-danger">
                                  <i className="fas fa-times"></i>
                                </span>
                              </button>
                            </p>
                          </td>
                        </tr>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </tbody>
              )}
            </Droppable>
            <tfoot>
            <tr>
              <td>Total</td>
              <td></td>
              <td></td>
              <td>{totalCals.toFixed(2)}</td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          </tfoot>
          </table>
        </DragDropContext>



      </div>
    );
  }
}





export default function Recipe(props) {
    let params = useParams();
    let navigate = useNavigate();
    return <RecipeClass {...props} params={params} navigate={navigate} />
}
