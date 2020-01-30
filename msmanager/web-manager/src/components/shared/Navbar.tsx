/*
 * MIT License
 *
 * Copyright (c) 2020 micro-manager
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
import {routes} from "../../containers/Root.dev";
const logo = require("../../resources/images/favicon.png");

const navIcons = [
    { icon: <GoMarkGithub/>, href: "https://github.com/usmanager/us-manager", tooltip: { tip: "GitHub", position: "bottom" } },
    { icon: <FaDocker/>, href: "https://hub.docker.com/orgs/usmanager", tooltip: { tip: "DockerHub", position: "left" } },
];

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
        user = !width  || !user;
        this.props.showSidenavByUser(user);
    };

    render = () =>
        <header role="navigation">
            <div className="navbar-fixed">
                <nav className="no-shadows">
                    <div className="nav-wrapper row">
                        <div className="left-nav-icons">
                            <a className="sidenav-trigger transparent btn-floating btn-flat btn-small waves-effect waves-light"
                               data-target="slide-out"
                               style={this.props.sidenav.user && this.props.sidenav.width ? undefined : {display: 'inherit'}}
                               onClick={this.handleSidenav}
                            >
                                <i className="material-icons">menu</i>
                            </a>
                        </div>
                        <Link className="col s6 m2 l2 offset-s3 offset-m1 brand-logo" to={"/"}>
                            <img src={logo} alt=""/>
                            Web Manager
                        </Link>
                        {routes[this.props.location.pathname] && routes[this.props.location.pathname].search && <SearchBar/>}
                        <div className="right-nav-icons"
                             style={this.props.sidenav.user && this.props.sidenav.width ? undefined : {paddingRight: '0px'}}>
                            {navIcons.map((navIcon, index) =>
                                <a key={index}
                                   className="transparent btn-floating btn-flat btn-small waves-effect waves-light tooltipped"
                                   data-position={navIcon.tooltip.position} data-tooltip={navIcon.tooltip.tip}
                                   href={navIcon.href}>
                                    <i className="material-icons">{navIcon.icon}</i>
                                </a>
                            )}
                        </div>
                    </div>
                </nav>
            </div>
        </header>
}

const mapStateToProps = (state: ReduxState): StateToProps => (
    {
        sidenav: state.ui.sidenav,
    }
);

const mapDispatchToProps = (dispatch: any): DispatchToProps =>
    bindActionCreators({ showSidenavByUser }, dispatch);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Navbar));