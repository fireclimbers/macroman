import React from 'react';
import { Link } from "react-router-dom";
import { ItemForm } from './components';

import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore";


export default class FoodList extends React.Component {
  constructor(props) {
    super(props);

    this.state = { 
      items: [],
      editing: -1,
      editId: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleEditSubmit = this.handleEditSubmit.bind(this);
  }
  componentDidMount() {
    this.queryItems();
  }
  async queryItems() {
    const querySnapshot = await getDocs(collection(this.props.db, "fooditems"));
    let items = [];
    querySnapshot.forEach((doc_) => {
      const data = doc_.data();
      data.id = doc_.id;
      items.push(data);
    });

    this.setState({
      items
    })
  }

  startEdit(i, e) {
    this.setState({
      editing: i,
      editId: this.state.items[i].id
    })
  }

  handleChange(e) {
    var args = {};
    args[e.target.id] = e.target.value;
    this.setState(args);
  }

  async handleSubmit(newItem) {
    try {
      const docRef = await addDoc(collection(this.props.db, "fooditems"), newItem);
      //console.log("Document written with ID: ", docRef.id);
      newItem.id = docRef.id;
    } catch (e) {
      console.error("Error adding document: ", e);
    }

    this.setState(state => ({
      items: state.items.concat(newItem),
    }));
  }
  async handleEditSubmit(editedItem) {
    const iRef = doc(this.props.db, "fooditems", this.state.editId);
    await updateDoc(iRef, editedItem);
    
    editedItem.id = this.state.editId;

    this.state.items[this.state.editing] = editedItem;
    this.setState(state => ({
      items: this.state.items,
      editing: -1
    }));
  }
  async deleteItem(index, e) {
    await deleteDoc(doc(this.props.db, "fooditems", this.state.items[index].id));
    this.state.items.splice(index, 1);
    this.setState(state => ({
      items: this.state.items,
    }));
  }

  render() {

    return (
      <div className="container">
        <Link to="/macroman/">Back</Link>
        <table className="table is-fullwidth is-hoverable">
          <thead>
            <tr>
              <th>Name</th>
              <th>Amount</th>
              <th>Volume</th>
              <th>Cals</th>
              <th>Protein</th>
              <th>Fat</th>
              <th>Carbs</th>
              <th>Servings</th>
              <th></th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {this.state.items.map((item, index) => (
              <tr key={'row'+index}>
                <td>{item.name}</td>
                <td>{item.amount+' '+item.unit}</td>
                <td>{(item.volume || '')+' '+(item.vol_unit || '')}</td>
                <td>{(item.cals*item.servings/item.totalservings).toFixed(2)}</td>
                <td>{(item.protein*item.servings/item.totalservings).toFixed(2)}</td>
                <td>{(item.fat*item.servings/item.totalservings).toFixed(2)}</td>
                <td>{(item.carbs*item.servings/item.totalservings).toFixed(2)}</td>
                <td>{item.servings+'/'+item.totalservings}</td>
                <td>
                  <p className="buttons">
                    <button className="button is-small" onClick={this.startEdit.bind(this, index)}>
                      <span className="icon is-small has-text-primary">
                        <i className="fas fa-pen"></i>
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
            
            ))}
          </tbody>
            
        </table>


        <div className="columns">
          <div className="column"></div>
          <div className="column is-8">
            <ItemForm handleSubmit={this.handleSubmit} />
          </div>
          <div className="column"></div>
        </div>
        
        <div className={"modal "+(this.state.editing !== -1 ? 'is-active' : '')}>
          <div className="modal-background"></div>
          <div className="modal-card" style={{width:'60%'}}>
            <header className="modal-card-head">
              <p className="modal-card-title">Edit item</p>
              <button className="delete" aria-label="close" onClick={() => {this.setState({editing: -1})}}></button>
            </header>
            <section className="modal-card-body">
              <ItemForm handleSubmit={this.handleEditSubmit} editing={this.state.editing} item={this.state.editing !== -1 ? this.state.items[this.state.editing] : {}} />
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

  
}

