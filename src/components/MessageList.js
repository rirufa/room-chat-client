import React from 'react';
import { withRouter } from "react-router-dom";
import { ApiClient } from '../ApiClient';

class MessageList extends React.Component{
  constructor(props) {
    super(props);
    this.state = {text:'',messageList:[]};
    this.subscriber = null;
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
  }

  sendmsg(msg) {
    let roomid = this.props.location.state.id;
    let client = new ApiClient();
    return client.MutateAsync(`
      mutation($roomid:String!,$content:String,$senderid:String){
      	messageCreate(record:{roomid:$roomid,content:$content,senderid:$senderid}){
          content
        }
      }
    `,{roomid: roomid, content:msg, senderid: localStorage.user})
  }

  handleTextChange(event) {
    this.setState({text: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    this.sendmsg(this.state.text);
  }

  componentDidMount() {
    let token = localStorage.token;
    if(token === '' || token === null || this.subscriber != null)
      return;
    let roomid = this.props.location.state.id;
    let _this = this;

    let client = new ApiClient();
    this.subscriber = client.SubscribeAsync(`
      subscription($roomid:String){
        messageAdded(filter:{roomid:$roomid})
        {
          content
          senderid{
            name
          }
        }
      }`,{roomid: roomid})
    .subscribe({
       next(result){
         console.log(this);
         let json = result.data.messageAdded;
         if(json == null)
           return;
         //‚¤‚Ü‚­‚¢‚©‚È‚¢‚Ì‚ÅŽ–‘O‚ÉS‘©‚µ‚Ä‚¨‚¢‚½this‚ðŽg‚¤
         _this.state.messageList.push(json);
         _this.setState({text:'', messageList: _this.state.messageList});
      }
    });

    client.QueryAsync(`
      query($roomid:String){
        messageById(filter:{roomid:$roomid})
        {
          content
          senderid{
            name
          }
        }
      }
    `,{roomid: roomid})
     .then(result =>{
        let json = result.data.messageById;
        for(const item of json)
        {
          this.state.messageList.push(item);
        }
        this.setState({text:'', messageList: this.state.messageList});
     });
  }

  componentWillUnmount() {
    this.subscriber = null;
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
            return <li key={i}>{m.senderid.name}&nbsp;{m.content}</li>
          })
        }</ul>
      </div>
    )
  }
}

export default withRouter(MessageList);
