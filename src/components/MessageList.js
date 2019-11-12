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

  sendmsg(eventname, arg) {
    if(this.socket == null)
      throw "socket is null";
    return new Promise((resolve,reject)=>{
      this.socket.emit(eventname, arg, (r)=>{
        return resolve(r);
      });
    });
  }

  handleTextChange(event) {
    this.setState({text: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    let roomid = this.props.location.state.id
    this.sendmsg('send', {roomid: roomid, content: this.state.text});
  }

  componentDidMount() {
    let token = localStorage.token;
    if(token === '' || token === null)
      return;
    if(this.socket != null)
      return;
    this.socket = io(AppConfig.API_SERVER + "/api/v1/chat-stream?token=" + token);
    this.socket.on('receive', (msgs) => {
      for(let msg of msgs)
        this.state.messageList.push(msg.content);
      this.setState({text:'', messageList: this.state.messageList});
    });
    let roomid = this.props.location.state.id;
    this.state.messageList.push('join to' +  roomid);
    this.setState({text:'', messageList: this.state.messageList});
    this.sendmsg('join', {roomid: roomid})
    .then((r)=>{
      this.sendmsg('fetchall', {roomid: roomid});
    });
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
