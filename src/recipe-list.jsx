import React from 'react';
import { Link } from "react-router-dom";

import { collection, addDoc, getDocs } from "firebase/firestore";



export default class RecipeList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      items: []
    };
    this.handleChange = this.handleChange.bind(this);
  }
  componentDidMount() {
    this.fetchRecipes();
  }
  async fetchRecipes() {
    const querySnapshot = await getDocs(collection(this.props.db, "recipes"));
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
  async newRecipe() {
    try {
      // name, servings, text, [{fooditem_id, ratio, visible}]
      let newItem = {name: this.state.name, servings: 4, text: '', items: []};
      const docRef = await addDoc(collection(this.props.db, "recipes"), newItem);
      //console.log("Document written with ID: ", docRef.id);
      // TODO go to /recipe/<docRef.id>
      window.location.href = window.location.protocol + "//" + window.location.host + '/macroman/recipes/' + docRef.id;
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }
  render() {

    // TODO
    // have two pages: one for new/choose recipe, one for displaying/editing recipe
    // create new recipe
    // search for food in db -> query by filter -> see results to click -> add item to recipe
    // recipe schema is: name, servings, text, [{fooditem_id, ratio, visible}]

    

    return (
      <div className="container">
        <br/><br/>

        <table className="table is-narrow is-fullwidth">
          <thead>
            <tr>
              <th>Name</th>
              <th>Cals</th>
              <th>Servings</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {this.state.items.map((item,index) => {
              return <tr>
                <td><Link key={'link_'+index} to={"/macroman/recipes/"+item.id}>{item.name}</Link></td>
                <td>{parseInt(parseFloat(item.totalCals)/parseInt(item.servings))}</td>
                <td>{item.servings}</td>
                <td>Remove</td>
              </tr>
            })}
          </tbody>
        </table>

        <nav className="level">
          <div className="level-left">
            <div className="level-item">
              <div className="field">
                <p className="control">
                  <input value={this.state.name} id="name" onChange={this.handleChange} className="input" type="text" placeholder="Name"/>
                </p>
              </div>
            </div>
            <div className="level-item">
              <button onClick={this.newRecipe.bind(this)} className="button">Add</button>
            </div>
          </div>
        </nav>
        
        <Link className="button" to="/macroman/foods" style={{marginRight:12}}>Food index</Link>
        <button onClick={this.props.logout} className="button">Logout</button>

      </div>
    );
  }

  handleChange(e) {
    var args = {};
    args[e.target.id] = e.target.value;
    this.setState(args);
  }
}
