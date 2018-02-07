import React, { Component } from 'react';
import { loginscript } from '../../Assets/js/loginscript';
import { registerscript } from '../../Assets/js/registerScript';






class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {value: ''};

    // this.handleSelectChange = this.handleSelectChange.bind(this);

    

  }
    handleSelectChange = (event) => {
    this.setState({value: event.target.value});

  }

    handleSubmit = (event) => {
       let username = this.refs.userName.value;
       let password = this.refs.passWord.value;
       console.log("User: " + username);
       console.log("Password: " + password);
       console.log("Team: " + this.state.value);

    event.preventDefault();

  }





  render() {
    return (
      <div className="top-content">

        <div className="inner-bg">
          <div className="container">



            <div className="row">
              <div className="col-sm-5">

                <div className="form-box">
                  <div className="form-top">
                    <div className="form-top-left">
                      <h3>Login to our site</h3>
                      <p>Enter username and password to log on:</p>
                    </div>
                    <div className="form-top-right">
                      <i className="fa fa-lock"></i>
                    </div>
                  </div>
                  <div className="form-bottom">
                    <form role="form" action=""  className="login-form">
                      <div className="form-group">
                        <label className="sr-only" htmlFor="form-username">Username</label>
                        <input type="text" name="form-username" placeholder="Username..." className="form-username form-control" id="form-username" ref="form-username"/>
                      </div>
                      <div className="form-group">
                        <label className="sr-only" htmlFor="form-password">Password</label>
                        <input type="password" name="form-password" placeholder="Password..." className="form-password form-control" id="form-password" ref="form-password"/>
                      </div>
                      <button type="button" onClick={loginscript} className="btn">Sign in!</button>
                    </form>
                  </div>
                </div>

                <div className="social-login">
                  <h3>...or login with:</h3>
                  <div className="social-login-buttons">
                    <a className="btn btn-link-2" href="#">
                      <i className="fa fa-facebook"></i> Facebook
                    </a>
                    <a className="btn btn-link-2" href="#">
                      <i className="fa fa-twitter"></i> Twitter
                    </a>
                    <a className="btn btn-link-2" href="#">
                      <i className="fa fa-google-plus"></i> Google Plus
                    </a>
                  </div>
                </div>

              </div>

              <div className="col-sm-1 middle-border"></div>
              <div className="col-sm-1"></div>

              <div className="col-sm-5">

                <div className="form-box">
                  <div className="form-top">
                    <div className="form-top-left">
                      <h3>Sign up now</h3>
                      <p>Fill in the form below to get instant access:</p>
                    </div>
                    <div className="form-top-right">
                      <i className="fa fa-pencil"></i>
                    </div>
                  </div>
                  <div className="form-bottom">
                    <form role="form" action=""  className="registration-form" onSubmit={this.handleSubmit}>
                      <div className="form-group">
                        <label className="sr-only" htmlFor="form-user-name">Username</label>
                        <input type="text" name="userName" placeholder="Username..."  className="form-user-name form-control" id="form-user-name" ref="userName"/>
                      </div>
                      <div className="form-group">
                        <label className="sr-only" htmlFor="form-pass-word">Password</label>
                        <input type="text" name="passWord" placeholder="Last name..."  className="form-pass-word form-control" id="form-pass-word" ref="passWord"/>
                      </div>
                      <div className="form-group">

                        <select name="team-select" value={this.state.value} onChange={this.handleSelectChange} ref="team-select">
                          <option value="1">team 1</option>
                          <option value="2">team 2</option>
                        </select>

                    </div>
                    <button type="submit" className="btn">Sign me up!</button>
                  </form>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

    </div>

  );
}

}


export default Login;
