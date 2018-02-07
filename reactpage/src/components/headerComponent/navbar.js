import React, { Component } from 'react';
import {
  Link
} from 'react-router-dom';





class Navbar extends Component {

  render() {
    return (
      <nav className="navbar navbar-expand-lg navbar-light fixed-top" id="mainNav">
        <div className="container">
          <Link className="navbar-brand js-scroll-trigger" to="/">NEST:R</Link>

          <button className="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
            Menu
            <i className="fa fa-bars"></i>
          </button>
          <div className="collapse navbar-collapse" id="navbarResponsive">
            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <a className="nav-link js-scroll-trigger" href="#about">About</a>
              </li>
              <li className="nav-item">
                <a className="nav-link js-scroll-trigger" href="#leaderboard">Leaderboard</a>
              </li>
              <li className="nav-item">
                <a className="nav-link js-scroll-trigger" href="#">Game</a>
              </li>
              <li className="nav-item">
                <Link className="nav-link js-scroll-trigger" to="/Login">Login</Link>
              </li>

            </ul>
          </div>
        </div>
      </nav>

    );
  }
}

export default Navbar;
