import React from 'react';
import io from 'socket.io-client';

var API_SERVER = "http://localhost:8080";

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

  componentDidUpdate() {
    let token = this.props.token;
    if(token === '')
      return;
    if(this.socket != null)
      return;
    this.socket = io(API_SERVER + "/api/v1/chat-stream?token=" + token);
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
    fetch(API_SERVER + "/api/v1/login",option)
    .then(res =>{
      return res.json()
     }).then(json =>{
      if(json.sucess)
      {
        this.props.onTokenChange(json.token);
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
      </form>
    );
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {token: ''};
    this.handleTokenChange = this.handleTokenChange.bind(this);
  }
  handleTokenChange(token) {
    this.setState({token});
  }
  render() {
    return (
      <div>
         <LoginForm onTokenChange={this.handleTokenChange}/>
         <MessageList token={this.state.token}/>
      </div>
    );
  }
}

export default App;
