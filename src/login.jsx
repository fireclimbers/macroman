import React from "react";
import { signInWithEmailAndPassword } from "firebase/auth";

export default class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: '',
      pass: '',
      error: '',
      loading: false
    };

  }
  componentDidMount() {

  }
  componentWillUnmount() {
  }
  checkPassword() {
    this.setState({
      loading: true
    })
    signInWithEmailAndPassword(this.props.auth, this.state.user, this.state.pass)
      .then((userCredential) => {
        //console.log(userCredential);
        //const user = userCredential.user;
        // Refresh?
        //window.location.reload();
      })
      .catch((error) => {
        // Set error message
        //console.log(error);
        //console.log(error.code);
        //console.log(error.message);
        //const errorCode = error.code;
        //const errorMessage = error.message;
        this.setState({
          error:'Password is incorrect.',
          loading: false
        })
      });
  }
  handleKeyPress(e) {
    if(e.key === 'Enter'){
      this.checkPassword();
    }
  }
  render() {
    return(
      <div className="container">
        <div className="columns is-multiline">
          <div className="column is-3"/>
          <div className="column is-6">
            <div className="field">
              <label className="label is-smed">Email</label>
              <p className="control has-icons-left has-icons-right">
                <input onChange={(e) => this.setState({[e.target.name]: e.target.value})} name="user" value={this.state.user} className="input is-smed" type="email" placeholder="Email"/>
                <span className="icon is-smed is-left">
                  <i className="fas fa-envelope"></i>
                </span>
              </p>
            </div>
            <div className="field">
              <label className="label is-smed">Password</label>
              <p className="control has-icons-left">
                <input onChange={(e) => this.setState({[e.target.name]: e.target.value})} name="pass" value={this.state.pass} className="input is-smed" type="password" onKeyPress={this.handleKeyPress.bind(this)} placeholder="Password"/>
                <span className="icon is-smed is-left">
                  <i className="fas fa-lock"></i>
                </span>
              </p>
              <p style={{color:'red'}}>{this.state.error}</p>
            </div>
            <div className="field">
              <p className="control">
                <button className="button is-info is-smed" onClick={this.checkPassword.bind(this)}>{this.state.loading ? <i className="fa-solid fa-circle-notch fa-spin"></i> : 'Log in'}</button>
              </p>
            </div>
          </div>
          <div className="column is-3"/>
          
        </div>
        

      </div>
    );
  }
}
