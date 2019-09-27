import React from 'react';
import io from 'socket.io-client';
import { withRouter } from "react-router-dom";
import AppConfig from '../AppConfig';

class MessageList extends React.Component{
  constructor(props) {
    super(props);
    this.state = {text:'',messageList:[]};
    this.socket = null;
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
  }

  handleTextChange(event) {
    this.setState({text: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    if(this.socket != null)
      this.socket.emit('sendall', {value:this.state.text});
  }

  componentWillMount() {
    let token = this.props.location.state.token;
    if(token === '')
      return;
    if(this.socket != null)
      return;
    this.socket = io(AppConfig.API_SERVER + "/api/v1/chat-stream?token=" + token);
    this.socket.on('receive', (msg) => {
      this.state.messageList.push(msg.value);
      this.setState({text:'', messageList: this.state.messageList});
    });
    this.state.messageList.push('login success');
    this.setState({text:'', messageList: this.state.messageList});
  }

  componentWillUnmount() {
    this.socket = null;
  }

  render(){
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <input type="text" value={this.state.text} onChange={this.handleTextChange}/>
          <input type="submit" value="Say" />
        </form>
        <ul>{
          this.state.messageList.map((m,i)=>{
            return <li key={i}>{m}</li>
          })
        }</ul>
      </div>
    )
  }
}

export default withRouter(MessageList);