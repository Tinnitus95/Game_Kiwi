import React, { Component } from 'react';
import {
  Link
} from 'react-router-dom';



const message = "Buildo uses cookies to guarantee users the employment of its site features, offering a better purchasing experience. By continuing to browse the site you're agreeing to our use of cookies."


class Homepage extends Component {
  render() {
    return (
      <header className="masthead">
        <div className="intro-body">
          <div className="container">
            <div className="row">
              <div className="col-lg-8 mx-auto">
                <h1 className="brand-heading">NEST:R</h1>
                <p className="intro-text">A game for the explorer.</p>
                <Link className="btn btn-circle js-scroll-trigger" to='/about'>
                <i className="fa fa-angle-double-down animated"></i>
              </Link>

            </div>
          </div>
        </div>
      </div>

    </header>


    );
  }
}

export default Homepage;
