import React from 'react';
import { BrowserRouter, Route} from 'react-router-dom';
import MessageList from './components/MessageList';
import LoginForm from './components/LoginForm';
import NewUser from './components/NewUser';
import NewRoom from './components/NewRoom';
import RoomList from './components/RoomList';

class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          <Route exact path='/' component={LoginForm} />
          <Route exact path='/newuser' component={NewUser} />
          <Route exact path='/newroom' component={NewRoom} />
          <Route exact path='/room' component={RoomList} />
          <Route path='/chat' component={MessageList} />
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
