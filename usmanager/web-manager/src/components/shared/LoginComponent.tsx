/*
 * MIT License
 *
 * Copyright (c) 2020 usmanager
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import React, { Component } from 'react'
import {basicAuthenticate, isAuthenticated, registerSuccessfulLogin} from "../../utils/auth";


class LoginComponent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      hasLoginFailed: false,
      showSuccessMessage: false
    }
  }

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value })
  };

  handleLogin = () => {
    basicAuthenticate(this.state.username, this.state.password)
      .then(() => {
        registerSuccessfulLogin(this.state.username, this.state.password);
        this.props.history.push(`/home`);
      }).catch(() => {
      this.setState({ showSuccessMessage: false });
      this.setState({ hasLoginFailed: true })
    })
  };

  render() {
    if (isAuthenticated) {
      //TODO confirm
      this.props.history.push(`/home`);
    }
    return (
      <div>
        <h1>Login</h1>
        <div className="container">
          {/*<ShowInvalidCredentials hasLoginFailed={this.state.hasLoginFailed}/>*/}
          {this.state.hasLoginFailed && <div className="alert alert-warning">Invalid Credentials</div>}
          {this.state.showSuccessMessage && <div>Login Sucessful</div>}
          {/*<ShowLoginSuccessMessage showSuccessMessage={this.state.showSuccessMessage}/>*/}
          User Name: <input type="text" name="username" value={this.state.username} onChange={this.handleChange} />
          Password: <input type="password" name="password" value={this.state.password} onChange={this.handleChange} />
          <button className="btn btn-success" onClick={this.handleLogin}>Login</button>
        </div>
      </div>
    )
  }
}

export default LoginComponent