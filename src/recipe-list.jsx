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
              <button onClick={this.newRecipe.bind(this)} className="button">New</button>
            </div>
          </div>
        </nav>

        <Link to="/macroman/foods">Food index</Link>
        <br/><br/><br/>

        {this.state.items.map((item,index) => {
          return <Link key={'link_'+index} to={"/macroman/recipes/"+item.id}>{item.name}</Link>
        })}

      </div>
    );
  }

  handleChange(e) {
    var args = {};
    args[e.target.id] = e.target.value;
    this.setState(args);
  }
}
