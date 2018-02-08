import React, { Component } from 'react';



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
                <a href="#about" className="btn btn-circle js-scroll-trigger">
                  <i className="fa fa-angle-double-down animated"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
    </header>
  );
}
}

export default Homepage;
