import React from 'react';
import { withRouter,Link } from "react-router-dom";
import AppConfig from '../AppConfig';

class RoomList extends React.Component{
  constructor(props) {
    super(props);
    this.state = {roomList:[]};
  }

  componentWillMount() {
    let token = this.props.location.state.token;
    if(token === '')
      return;
    let myheaders = new Headers();
    myheaders.append("Accept", "application/json")
    myheaders.append("Content-Type", "application/json")
    let option = {
      mode: "cors",
      method: "GET",
      headers: myheaders
    };
    fetch(AppConfig.API_SERVER + "/api/v1/room",option)
    .then(res =>{
      return res.json()
     }).then(json =>{
      if(json.sucess)
      {
        for(const item of json.content)
        {
          this.state.roomList.push(item);
        }
      }
      this.setState({roomList: this.state.roomList});
    });
  }

  render(){
    return (
      <div>
        <ul>{
          this.state.roomList.map((m,i)=>{
            return <li key={i}><Link to={{pathname:'/chat', state:{id:m.id,token:this.props.location.state.token} }}>{m.name}</Link></li>
          })
        }</ul>
        <Link to="/newroom">Add room</Link>
      </div>
    )
  }
}

export default withRouter(RoomList);
