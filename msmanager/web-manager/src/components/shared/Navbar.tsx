
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
import PerfectScrollbar from 'react-perfect-scrollbar'
import {FaDocker, GoMarkGithub} from "react-icons/all";
import LoadingBar from "react-redux-loading-bar";
/*import LoadingBar from 'react-redux-loading-bar'*/
const logo = require("../../resources/images/favicon.png");

interface NavbarProps extends RouteComponentProps {
    sidenavHidden: boolean,
    hideSidenav: (b:boolean) => void
}

/*TODO update hrefs*/
const navIcons = [
    { icon: <GoMarkGithub/>, href: "https://github.com/danielfct/master-thesis/tree/master/micro-manager", tooltip: "GitHub" },
    { icon: <FaDocker/>, href: "https://hub.docker.com/u/danielfct", tooltip: "DockerHub" },
];

class Navbar extends React.Component<NavbarProps,any> {

    handleSidenav = () => {
        this.props.hideSidenav(!this.props.sidenavHidden);
    };

    render () {
        {/*<LoadingBar />*/}
        return (
            <header role="navigation">
                <nav className="fixed-nav no-shadows">
                    <div className="nav-wrapper row">
                        <div className="left-nav-icons">
                            <a className="sidenav-trigger transparent btn-floating btn-flat btn-small waves-effect waves-light"
                               data-target="slide-out"
                               style={this.props.sidenavHidden ? {display: 'inherit'} : undefined}
                               onClick={this.handleSidenav}>
                                <i className="material-icons">menu</i>
                            </a>
                        </div>
                        <Link className="col s6 m2 l2 offset-s3 offset-m1 brand-logo" to={"/"}>
                            <img src={logo} alt=""/>
                            Web Manager
                        </Link>
                        {this.props.location.pathname !== '/' &&
                        <form className="col s4 offset-s3 hide-on-small-and-down" noValidate autoComplete="off">
                          <div className="input-field search-bar">
                            <input id="search" type="search" placeholder="Filter"/>
                            <label className="label-icon" htmlFor="search">
                              <i className="material-icons">search</i>
                            </label>
                          </div>
                        </form>}
                        <div className="right-nav-icons">
                            {navIcons.map((navIcon, index) =>
                                <a key={index}
                                   className="transparent btn-floating btn-flat btn-small waves-effect waves-light tooltipped"
                                   data-position="bottom" data-tooltip={navIcon.tooltip}
                                   href={navIcon.href}>
                                    <i className="material-icons">{navIcon.icon}</i>
                                </a>
                            )}
                        </div>
                    </div>
                </nav>
            </header>
        );
    }
}

export default withRouter(Navbar);