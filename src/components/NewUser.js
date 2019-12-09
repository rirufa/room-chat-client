import React from 'react';
import { withRouter } from "react-router-dom";
import AppConfig from '../AppConfig';
import { ApiClient } from '../ApiClient';

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {userid: '', password: '', name: '', description: ''};

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleUseridChange = this.handleUseridChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
  }

  handleUseridChange(event) {
    this.setState({userid: event.target.value});
  }

  handlePasswordChange(event) {
    this.setState({password: event.target.value});
  }

  handleNameChange(event) {
    this.setState({name: event.target.value});
  }

  handleDescriptionChange(event) {
    this.setState({description: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();

    let client = new ApiClient();
    client.MutateAsync(`
        mutation($userid:String!,$password:String!,$name:String,$description:String){
          userCreate(record:{userid:$userid,password:$password,name:$name,description:$description}){
            userid
          }
        }`, {
        userid:this.state.userid,
        password:this.state.password,
        name:this.state.name,
        description:this.state.description
    })
    .then(res =>{
      alert("user add sucess");
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
        <label>
          UserName:
          <input type="text" value={this.state.name} onChange={this.handleNameChange} />
        </label>
        <label>
          Description:
          <input type="text" value={this.state.description} onChange={this.handleDescriptionChange} />
        </label>
        <input type="submit" value="Login" />
      </form>
    );
  }
}

export default withRouter(LoginForm);
