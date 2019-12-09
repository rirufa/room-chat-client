import React from 'react';
import { withRouter } from "react-router-dom";
import AppConfig from '../AppConfig';
import { ApiClient } from '../ApiClient';

class NewRoom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {name: '', description: ''};

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
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
      mutation($name:String!,$description:String){
        roomCreateOne(record:{name:$name,description:$description}){
          id
        }
      }`,{name:this.state.name, description:this.state.description})
    .then(res =>{
      alert("room add sucess");
    });
  }
  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Room Name:
          <input type="text" value={this.state.name} onChange={this.handleNameChange} />
        </label>
        <label>
          Description:
          <input type="text" value={this.state.description} onChange={this.handleDescriptionChange} />
        </label>
        <input type="submit" value="Create" />
      </form>
    );
  }
}

export default withRouter(NewRoom);
