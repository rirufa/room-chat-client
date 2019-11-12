import React from 'react';
import { withRouter,Link } from "react-router-dom";
import AppConfig from '../AppConfig';

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {userid: '', password: ''};

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleUseridChange = this.handleUseridChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
  }

  handleUseridChange(event) {
    this.setState({userid: event.target.value});
  }

  handlePasswordChange(event) {
    this.setState({password: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();

    let myheaders = new Headers();
    myheaders.append("Accept", "application/json")
    myheaders.append("Content-Type", "application/json")
    let option = {
      mode: "cors",
      method: "POST",
      body: JSON.stringify({userid:this.state.userid, password:this.state.password}),
      headers: myheaders
    };
    fetch(AppConfig.API_SERVER + "/api/v1/login",option)
    .then(res =>{
      return res.json()
     }).then(json =>{
      if(json.sucess)
      {
        localStorage.token = json.token;
        this.props.history.push({pathname: "/room"});
      }
    });
  }
  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          UserID:
          <input type="text" value={this.state.userid} onChange={this.handleUseridChange} />
        </label>
        <label>
          Password:
          <input type="text" value={this.state.password} onChange={this.handlePasswordChange} />
        </label>
        <input type="submit" value="Login" />
        <Link to="/newuser">Registor new account</Link>
      </form>
    );
  }
}

export default withRouter(LoginForm);
