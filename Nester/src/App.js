import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';

//components
import Navbar from './components/headerComponent/navbar';
import Homepage from './components/pages/homePage';
import About from './components/pages/about';

import "../node_modules/video-react/dist/video-react.css"; // import css

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
            <Route exact path='/about' component={About}/>



        </div>
      </Router>
    );
  }
}

export default App;
