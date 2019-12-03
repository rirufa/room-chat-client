import React from 'react';
import { withRouter,Link } from "react-router-dom";
import AppConfig from '../AppConfig';
import { ApiClient } from '../ApiClient';

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

     let client = new ApiClient();
     client.QueryAsync(`
          query ($userid:String!, $password:String!){
            userGetToken(filter:{ userid:$userid,password:$password }){
              sucess
              token
            }
          }
     `,{userid:this.state.userid, password:this.state.password})
     .then(result =>{
        let json = result.data.userGetToken;
        console.log(result);
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
