import React from 'react';
import './App.css';
import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom';
import LandingPage from './components/views/LandingPage/LandingPage';
import RegisterPage from './components/views/RegisterPage/RegisterPage';
import LoginPage from './components/views/LoginPage/LoginPage';
import NotFound from './components/views/NotFound/NotFound';
import NavBar from './components/views/NavBar/NavBar';

function App() {
  return (
    <>
    <NavBar />
    <Router>
      <Switch>
      <Route exact path="/" component={LandingPage} />
      <Route exact path="/login" component={LoginPage} />
      <Route exact path="/register" component={RegisterPage} />
      <Route component={NotFound} />
      </Switch>
    </Router>
    </>
  );
}

export default App;
