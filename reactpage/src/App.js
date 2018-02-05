import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';

//components
import Navbar from './components/headerComponent/navbar';
import Footer from './components/footerComponent/footer';
import Homepage from './components/pages/homePage';
import Login from './components/pages/login.js';
import './Assets/js/alertme';
import './Assets/include/bootstrap';
import './Assets/css/grayscale.css';
import './Assets/css/style.css';
import './Assets/css/default.min.css';





class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Navbar/>

            <Route exact path='/' component={Homepage} />
            <Route exact path='/Login' component={Login} />

          
        </div>
      </Router>
    );
  }
}

export default App;
