import React from 'react';
//import logo from './logo.svg';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';



class ItemForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      name: props.name || '',
      cals: props.cals || '',
      protein: props.protein || '0',
      fat: props.fat || '0',
      carbs: props.carbs || '0',
      servings: props.servings || "1",
      totalservings: props.totalservings || "1",
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  componentDidUpdate(prevProps) {
    console.log('huh', prevProps.editing, this.props.editing);
    if (prevProps.editing != this.props.editing) {
      this.setState({
        name: this.props.item.name,
        cals: this.props.item.cals,
        protein: this.props.item.protein,
        fat: this.props.item.fat,
        carbs: this.props.item.carbs,
        servings: this.props.item.servings,
        totalservings: this.props.item.totalservings
      })
    }
  }
  render() {
    return (
        <form onSubmit={this.handleSubmit}>
          <div className="columns">
            <div className="column">
              <div className="field is-horizontal">
                <div className="field-body">
                  <div className="field">
                    <p className="control">
                      <input 
                        id="name"
                        className="input is-small" 
                        type="text" 
                        placeholder="Name"
                        ref={(input) => { this.nameInput = input; }}
                        onChange={this.handleChange}
                        value={this.state.name} />
                    </p>
                  </div>
                  <div className="field">
                    <p className="control">
                      <input 
                        id="cals"
                        className="input is-small" 
                        type="text" 
                        placeholder="Cals"
                        onChange={this.handleChange}
                        value={this.state.cals} />
                    </p>
                  </div>
                </div>
              </div>
              <div className="field is-horizontal">
                <div className="field-body">
                  <div className="field">
                    <p className="control">
                      <input 
                        id="protein"
                        className="input is-small" 
                        type="text" 
                        placeholder="Protein"
                        onChange={this.handleChange}
                        value={this.state.protein} />
                    </p>
                  </div>
                  <div className="field">
                    <p className="control">
                      <input 
                        id="fat"
                        className="input is-small" 
                        type="text" 
                        placeholder="Fat"
                        onChange={this.handleChange}
                        value={this.state.fat} />
                    </p>
                  </div>
                  <div className="field">
                    <p className="control">
                      <input 
                        id="carbs"
                        className="input is-small" 
                        type="text" 
                        placeholder="Carbs"
                        onChange={this.handleChange}
                        value={this.state.carbs} />
                    </p>
                  </div>
                </div>
              </div>
              <div className="field is-horizontal">
                <div className="field-body">
                  <div className="field">
                    <p className="control">
                      <input 
                        id="servings"
                        className="input is-small" 
                        type="text" 
                        placeholder="Servings"
                        onChange={this.handleChange}
                        value={this.state.servings} />
                    </p>
                  </div>
                  <div className="field">
                    <p className="control">
                      <input 
                        id="totalservings"
                        className="input is-small" 
                        type="text" 
                        placeholder="Total servings"
                        onChange={this.handleChange}
                        value={this.state.totalservings} />
                    </p>
                  </div>
                  <div className="field">
                    <div className="control">
                      <button className="button is-primary">
                        Add item
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
    );
  }

  handleChange(e) {
    var args = {};
    args[e.target.id] = e.target.value;
    this.setState(args);
  }

  handleSubmit(e) {
    e.preventDefault();
    /*if (!this.state.text.length) {
      return;
    }*/
    const newItem = {
      name: this.state.name,
      cals: this.state.cals,
      protein: this.state.protein,
      fat: this.state.fat,
      carbs: this.state.carbs,
      servings: this.state.servings,
      totalservings: this.state.totalservings,
      visible: true
    };
    this.props.handleSubmit(newItem);
    this.setState(state => ({
      name: '',
      cals: '',
      protein: '0',
      fat: '0',
      carbs: '0',
      servings: '1',
      totalservings: '1'
    }));
    this.nameInput.focus();
  }
}

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


class TodoApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      items: [],
      editing: -1
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleEditSubmit = this.handleEditSubmit.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
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
  exportJson(e) {
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.state.items));
    //var dlAnchorElem = document.getElementById('downloadAnchorElem');
    var dlAnchorElem = document.createElement("a");
    dlAnchorElem.setAttribute("href",     dataStr     );
    dlAnchorElem.setAttribute("download", this.state.exporttitle+".json");
    document.body.appendChild(dlAnchorElem); // Required for FF
    dlAnchorElem.click();
  }
  onReaderLoad(e) {
    console.log(e.target.result);
    var obj = JSON.parse(e.target.result);
    console.log(obj);
    this.setState({
      items: obj
    })
    //alert_data(obj.name, obj.family);
  }
  importJson(e) {
    var reader = new FileReader();
    reader.onload = this.onReaderLoad.bind(this);
    reader.readAsText(e.target.files[0]);
  }
  render() {
    var totalG = this.state.items.reduce(function (sum, item) {
      if (item.visible)
        return sum + (item.protein*item.servings/item.totalservings) + (item.fat*item.servings/item.totalservings) + (item.carbs*item.servings/item.totalservings);
      return sum;
    }, 0);

    var totalProtein = this.state.items.reduce(function (sum, item) {
      if (item.visible)  
        return sum + (item.protein*item.servings/item.totalservings);
      return sum;
    }, 0);

    var totalFat = this.state.items.reduce(function (sum, item) {
      if (item.visible)  
        return sum + (item.fat*item.servings/item.totalservings);
      return sum;
    }, 0);

    var totalCarbs = this.state.items.reduce(function (sum, item) {
      if (item.visible)  
        return sum + (item.carbs*item.servings/item.totalservings);
      return sum;
    }, 0);

    var totalCals = this.state.items.reduce(function (sum, item) {
      if (item.visible)
        return sum + (item.cals*item.servings/item.totalservings);
      return sum;
    }, 0);

    var that = this;

    return (
      <div className="container">
        <DragDropContext onDragEnd={this.onDragEnd}>
          <table className="table is-fullwidth is-hoverable">
            <thead>
              <tr>
                <th>Name</th>
                <th>Cals</th>
                <th>Protein</th>
                <th>Fat</th>
                <th>Carbs</th>
                <th>Servings</th>
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
                    <Draggable key={'drag'+index} draggableId={'drag'+index} index={index}>
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
                          <td>{item.name}</td>
                          <td>{(item.cals*item.servings/item.totalservings).toFixed(2)}</td>
                          <td>{(item.protein*item.servings/item.totalservings).toFixed(2)}</td>
                          <td>{(item.fat*item.servings/item.totalservings).toFixed(2)}</td>
                          <td>{(item.carbs*item.servings/item.totalservings).toFixed(2)}</td>
                          <td>{item.servings+'/'+item.totalservings}</td>
                          <td>
                            <p className="buttons">
                              <button className="button is-small" onClick={that.startEdit.bind(that, index)}>
                                <span className="icon is-small has-text-primary">
                                  <i className="fas fa-pen"></i>
                                </span>
                              </button>
                            </p>
                          </td>
                          <td>
                            <p className="buttons">
                              <button className="button is-small" onClick={that.toggleVisible.bind(that, index)}>
                                <span className={"icon is-small "+(item.visible ? '' : 'has-text-grey-lighter')}>
                                  <i className="fas fa-eye"></i>
                                </span>
                              </button>
                            </p>
                          </td>
                          <td>
                            <p className="buttons">
                              <button className="button is-small" onClick={that.deleteItem.bind(that, index)}>
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
              <td>{totalCals.toFixed(2)}</td>
              <td>{totalProtein.toFixed(2)+" ("+Math.round(totalProtein*100/totalG)+"%)"}</td>
              <td>{totalFat.toFixed(2)+" ("+Math.round(totalFat*100/totalG)+"%)"}</td>
              <td>{totalCarbs.toFixed(2)+" ("+Math.round(totalCarbs*100/totalG)+"%)"}</td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          </tfoot>
          </table>
        </DragDropContext>

        <div className="columns">
          <div className="column"></div>
          <div className="column">
            <ItemForm handleSubmit={this.handleSubmit} />
          </div>
          <div className="column"></div>
        </div>
        
        <div className="field has-addons">
          <div className="control">
            <input 
              id="exporttitle"
              className="input" 
              type="text" 
              placeholder="Title"
              onChange={this.handleChange}
              value={this.state.exporttitle} />
          </div>
          <div className="control">
            <a className="button is-info" onClick={this.exportJson.bind(this)}>
              Export
            </a>
          </div>
        </div>
        <div className="file">
          <label className="file-label">
            <input className="file-input" type="file" name="list" onChange={this.importJson.bind(this)} />
            <span className="file-cta">
              <span className="file-icon">
                <i className="fas fa-upload"></i>
              </span>
              <span className="file-label">
                Import
              </span>
            </span>
          </label>
        </div>
        <div className={"modal "+(this.state.editing != -1 ? 'is-active' : '')}>
          <div className="modal-background"></div>
          <div className="modal-card" style={{width:480}}>
            <header className="modal-card-head">
              <p className="modal-card-title">Edit item</p>
              <button className="delete" aria-label="close" onClick={() => {this.setState({editing: -1})}}></button>
            </header>
            <section className="modal-card-body">
              <ItemForm handleSubmit={this.handleEditSubmit} editing={this.state.editing} item={this.state.editing != -1 ? this.state.items[this.state.editing] : {}} />
            </section>
            {/*<footer className="modal-card-foot">
              <button className="button is-success">Save changes</button>
              <button className="button">Cancel</button>
            </footer>*/}
          </div>
        </div>
      </div>
    );
  }

  handleChange(e) {
    var args = {};
    args[e.target.id] = e.target.value;
    this.setState(args);
  }

  handleSubmit(newItem) {
    this.setState(state => ({
      items: state.items.concat(newItem),
    }));
  }
  handleEditSubmit(editedItem) {
    this.state.items[this.state.editing] = editedItem;
    this.setState(state => ({
      items: this.state.items,
      editing: -1
    }));
  }
  toggleVisible(index, e) {
    this.state.items[index].visible = !this.state.items[index].visible;
    this.setState(state => ({
      items: this.state.items,
    }));
  }
  deleteItem(index, e) {
    this.state.items.splice(index, 1);
    this.setState(state => ({
      items: this.state.items,
    }));
  }
}

export default TodoApp;
