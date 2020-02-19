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

import React from "react";
import {Link, RouteComponentProps, withRouter} from "react-router-dom";
import {FaDocker, GoMarkGithub} from "react-icons/all";
import SearchBar from "./SearchBar";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {showSidenavByUser} from "../../actions";
import './Navbar.css';
import {ReduxState} from "../../reducers";
import {authenticatedRoutes} from "../../containers/Root.dev";
import {getLoggedInUser, logout} from "../../utils/auth";
import {capitalize} from "../../utils/text";
const logo = require("../../resources/images/logo.png");

interface StateToProps {
    sidenav: {user: boolean, width: boolean}
}

interface DispatchToProps {
    showSidenavByUser: (value: boolean) => void;
}

type Props = StateToProps & DispatchToProps & RouteComponentProps;

class Navbar extends React.Component<Props, {}> {

    private handleSidenav = () => {
        let {user, width} = this.props.sidenav;
        user = !width || !user;
        this.props.showSidenavByUser(user);
    };

    private handleLogout = () => {
        logout();
        this.props.history.push("/");
    };

    render() {
        const {pathname} = this.props.location;
        const route = authenticatedRoutes[pathname];
        const {user: sidenavUser, width: sidenavWidth} = this.props.sidenav;
        const loggingIn = pathname === '/' || pathname === '/login';
        const showSidenav = sidenavUser && sidenavWidth;
        const showSearchbar = route  && authenticatedRoutes[pathname].search;
        let loggedInUser = getLoggedInUser();
        loggedInUser = loggedInUser && capitalize(loggedInUser);
        return (
            <header role="navigation">
                <div className="navbar-fixed">
                    <nav className="no-shadows">
                        <div className="nav-wrapper row">
                            {!loggingIn &&
                            <a className="sidenav-trigger transparent btn-floating btn-flat btn-small waves-effect waves-light"
                               data-target="slide-out"
                               style={showSidenav ? undefined : { display: 'inherit' }}
                               onClick={this.handleSidenav}>
                              <i className="material-icons">menu</i>
                            </a>}
                            <ul className="left">
                                <li style={showSidenav && !loggingIn ? { paddingLeft: '200px', marginRight: "24px" } : { margin: "0 24px" } }>
                                    <a className="transparent brand-logo" href="/home">
                                        <img src={logo} alt=""/>
                                        Web Manager
                                    </a>
                                </li>
                            </ul>
                            {showSearchbar && <SearchBar/>}
                            <ul className="right hide-on-small-and-down">
                                <li className="username">
                                    {loggedInUser}
                                </li>
                                <li>
                                    <a className="tooltipped" data-tooltip="GitHub" data-position="bottom"
                                       href="https://github.com/usmanager/us-manager">
                                        <i className="material-icons"><GoMarkGithub/></i>
                                    </a>
                                </li>
                                <li>
                                    <a className="tooltipped" data-tooltip="DockerHub" data-position="bottom"
                                       href="https://hub.docker.com/orgs/usmanager">
                                        <i className="material-icons"><FaDocker/></i>
                                    </a>
                                </li>
                                {!loggingIn && <li>
                                  <a className="red-text text-darken-4" onClick={this.handleLogout}>
                                    <i className="material-icons right">logout</i> Logout
                                  </a>
                                </li>}
                            </ul>
                        </div>
                    </nav>
                </div>
            </header>
        )
    }
}

const mapStateToProps = (state: ReduxState): StateToProps => (
    {
        sidenav: state.ui.sidenav,
    }
);

const mapDispatchToProps = (dispatch: any): DispatchToProps =>
    bindActionCreators({ showSidenavByUser }, dispatch);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Navbar));