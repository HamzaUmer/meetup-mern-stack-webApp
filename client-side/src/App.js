import React, {useEffect, createContext, useReducer, useContext} from 'react';
import Navbar from './components/Navbar';
import './App.css';
import {BrowserRouter, Route,Switch, useHistory} from 'react-router-dom';
import Home from './components/Display/Home';
import Signup from './components/Display/Signup';
import Login from './components/Display/Login';
import Profile from './components/Display/Profile';
import CreatePost from './components/CreatePost';
import UserProfile from './components/Display/UserProfile';
import FollowUser from './components/Display/FollowUser';
import Reset from './components/Display/Reset';
import Newpassword from './components/Display/Newpassword';
import {reducer, initialState} from './reducer/userReducer';

export const UserContext = createContext();

const Routing = () => {
  const history = useHistory();
  const {state, dispatch} = useContext(UserContext);
  useEffect(() => {
      const user = JSON.parse(localStorage.getItem("user"));
      if(user) {
        dispatch({type:"USER", payload:user})
      } 
      else {
        if(!history.location.pathname.startsWith('/reset'))
            history.push('/login');
      } 
  }, [])
  return (
    <Switch>
    <Route exact path="/">
       <Home />
    </Route>
    <Route path= "/signup">
      <Signup />
    </Route>
    <Route path= "/login">
      <Login />
    </Route>
    <Route exact path= "/profile">
      <Profile />
    </Route>
    <Route path= "/create">
      <CreatePost />
    </Route>
    <Route path= "/profile/:userid">
      <UserProfile />
    </Route>
    <Route path= "/myfollowingpost">
      <FollowUser />
    </Route>
    <Route exact path= "/reset">
      <Reset />
    </Route>
    <Route path= "/reset/:token">
      <Newpassword />
    </Route>
    </Switch>
  );
}

function App() {
  const [state, dispatch] = useReducer(reducer,initialState);
  return (
    <UserContext.Provider value = {{state, dispatch}}>
    <BrowserRouter>
    <Navbar />
    <Routing />
    </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;