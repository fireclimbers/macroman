import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './login';
import Recipe from './recipe';
import RecipeList from './recipe-list';
import RecipeTest from './recipe-test';
import FoodList from './food-list';

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";




export default class App extends React.Component {
  constructor(props) {
    super(props);

    const firebaseConfig = {
      apiKey: "AIzaSyCugfMvDTmT8PSVd0B_4X6b7zOswwgU61s",
      authDomain: "macroman-4a7e3.firebaseapp.com",
      projectId: "macroman-4a7e3",
      storageBucket: "macroman-4a7e3.appspot.com",
      messagingSenderId: "357353968136",
      appId: "1:357353968136:web:38cb575af02041f5d8b7bd",
      measurementId: "G-BZG3MZ2HNQ"
    };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const auth = getAuth();


    this.state = { 
      app: app,
      db: db,
      auth: auth,
      user: null,
      loading: true
    };
    this.handleChange = this.handleChange.bind(this);
  }
  componentDidMount() {
    // Check if user is logged in
    onAuthStateChanged(this.state.auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        //const uid = user.uid;

        this.setState({
          user: user,
          loading:false
        })

        //const cityRef = doc(this.state.db, 'Users', uid);
        //setDoc(cityRef, { role: 'admin' });
      } else {

        this.setState({
          user: null,
          loading: false
        })
      }
    });
  }
  logout(e) {
    signOut(this.state.auth).then(() => {
      // Sign-out successful.
      //console.log('signed out');
      //window.location.reload();
      //console.log(window.location.host);
      window.location.href = window.location.protocol + "//" + window.location.host+'/macroman/';
    }).catch((error) => {
      // An error happened.
      console.log(error);
    });
  }
  handleChange(e) {
    var args = {};
    args[e.target.id] = e.target.value;
    this.setState(args);
  }
  render() {
    if (this.state.loading) return <div></div>;
    if (!this.state.user) return <Login auth={this.state.auth} />;



    // TODO
    // create new recipe
    // search for food in db -> query by filter -> see results to click -> add item to recipe
    // recipe schema is: name, servings, [{fooditem_id, ratio, visible}]




    return (
      <BrowserRouter>
        <Routes>
          <Route path="/macroman/" element={<RecipeList db={this.state.db} logout={this.logout.bind(this)} />} />
          <Route path="/macroman/foods" element={<FoodList db={this.state.db}/>} />
          <Route path="/macroman/test" element={<RecipeTest db={this.state.db}/>} />
          <Route path="/macroman/recipes/:recipeId" element={<Recipe db={this.state.db} />} />
          
          <Route
            path="*"
            element={
              <main style={{ padding: "12rem" }}>
                <p>Error: page does not exist</p>
              </main>
            }
          />
        </Routes>
      </BrowserRouter>
    );
  }
}
