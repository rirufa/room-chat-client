import React from 'react';
import { withRouter,Link } from "react-router-dom";
import AppConfig from '../AppConfig';
import { ApiClient } from '../ApiClient';

class RoomList extends React.Component{
  constructor(props) {
    super(props);
    this.state = {roomList:[]};
  }

  componentWillMount() {
    let token = localStorage.token;
    if(token === '' || token == null)
      return;
     let client = new ApiClient();
     client.QueryAsync(`
       {
         roomMany{
           id
           name
           description
         }
       }`)
     .then(result =>{
        let json = result.data.roomMany;
        for(const item of json)
        {
          this.state.roomList.push(item);
        }
        this.setState({roomList: this.state.roomList});
     });
  }

  render(){
    return (
      <div>
        <ul>{
          this.state.roomList.map((m,i)=>{
            return <li key={i}><Link to={{pathname:'/chat', state:{id:m.id} }}>{m.name}</Link></li>
          })
        }</ul>
        <Link to="/newroom">Add room</Link>
      </div>
    )
  }
}

export default withRouter(RoomList);
