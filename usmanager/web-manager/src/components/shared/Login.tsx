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

import React, {Component, createRef} from 'react'
import {basicAuthenticate, isAuthenticated, registerSuccessfulLogin} from "../../utils/auth";
import {RouteComponentProps, withRouter} from "react-router";
import './Login.css'
import M from "materialize-css";
import {bindActionCreators} from "redux";
import {showSidenavByUser} from "../../actions";
import {connect} from "react-redux";

interface State {
    username: string;
    password: string;
    showPassword: boolean;
}

interface DispatchToProps {
    showSidenavByUser: (value: boolean) => void;
}

interface LoginProps {
}

type Props = LoginProps & DispatchToProps & RouteComponentProps;

class Login extends Component<Props, State> {

    private tabs = createRef<HTMLUListElement>();

    state = {
        username: '',
        password: '',
        showPassword: false,
    };

    componentDidMount(): void {
        M.Tabs.init(this.tabs.current as Element);
        M.updateTextFields();
    }

    private handleChange = ({ target: { name, value } }: React.ChangeEvent<HTMLInputElement>) =>
        this.setState({ [name]: value } as Pick<State, any>);

    private handleShowPassword = () =>
        this.setState({showPassword: !this.state.showPassword});

    private handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        const {username, password} = this.state;
        //TODO delete next 3 line and remove comment
        registerSuccessfulLogin(username, password);
        this.props.showSidenavByUser(true);
        this.props.history.push(`/home`);
        /*basicAuthenticate(username, password)
            .then(() => {
                registerSuccessfulLogin(username, password);
                this.props.showSidenavByUser(true);
                M.toast({ html: `<div>Welcome ${username}</div>` });
                this.props.history.push(`/home`);
            }).catch(() => {
            M.toast({ html: `<div>Invalid username and/or password</div>` });
        })*/
    };

    public render() {
        if (isAuthenticated()) {
            this.props.history.push(`/home`);
        }
        const {username, password, showPassword} = this.state;
        return (
            <div className="row container login-container ">
                <ul className="tabs col s9 m6 l6 offset-s1 offset-m3 offset-l3" ref={this.tabs}>
                    <li className="tab login-tab col s12"><a>Login</a></li>
                </ul>
                <div className="tab-content login-tab-content col s9 m6 l6 offset-s1 offset-m3 offset-l3"
                     id="login">
                    <form onSubmit={this.handleLogin}>
                        <div className="input-field col s12">
                            <i className="material-icons prefix">account_circle</i>
                            <label className="active" htmlFor="username">Username</label>
                            <input id="username" name="username" value={username}
                                   type="text" required onChange={this.handleChange}/>
                        </div>
                        <div className="input-field col s12">
                            <i className="material-icons prefix">vpn_key</i>
                            <label className="active" htmlFor="password">Password</label>
                            <input id="password" name="password" value={password}
                                   autoComplete="off"
                                   type={showPassword ? "text" : "password"} required
                                   onChange={this.handleChange}/>
                            <i className="material-icons suffix" onClick={this.handleShowPassword}>
                                {showPassword ? "visibility_off" : "visibility"}
                            </i>
                        </div>
                        <button className="btn btn-flat waves-effect waves-light white-text right slide"
                                type="submit" tabIndex={0} onClick={this.handleLogin}>
                            Login
                        </button>
                    </form>
                </div>
            </div>)
    }

}

const mapDispatchToProps = (dispatch: any): DispatchToProps =>
    bindActionCreators({ showSidenavByUser }, dispatch);

export default connect(null, mapDispatchToProps)(Login);
