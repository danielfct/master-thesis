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
import {updateSearchFilter} from "../../redux/reducers/searchFilter";
import {hideSidenav} from "../../redux/reducers/sidenav";
const logo = require("../../resources/images/favicon.png");

interface NavbarProps extends RouteComponentProps {
    sidenavHidden: boolean,
    actions: { hideSidenav: (hidden: boolean) => any },
}

/*TODO update hrefs*/
const navIcons = [
    { icon: <GoMarkGithub/>, href: "https://github.com/usmanager/us-manager", tooltip: { tip: "GitHub", position: "bottom" } },
    { icon: <FaDocker/>, href: "https://hub.docker.com/orgs/usmanager", tooltip: { tip: "DockerHub", position: "left" } },
];

class Navbar extends React.Component<NavbarProps,any> {

    private handleSidenav = () =>
        this.props.actions.hideSidenav(!this.props.sidenavHidden);

    render = () =>
        <header role="navigation">
            <nav className="fixed-nav no-shadows">
                <div className="nav-wrapper row">
                    <div className="left-nav-icons">
                        <a className="sidenav-trigger transparent btn-floating btn-flat btn-small waves-effect waves-light"
                           data-target="slide-out"
                           style={this.props.sidenavHidden ? {display: 'inherit'} : undefined}
                           onClick={this.handleSidenav}
                        >
                            <i className="material-icons">menu</i>
                        </a>
                    </div>
                    <Link className="col s6 m2 l2 offset-s3 offset-m1 brand-logo" to={"/"}>
                        <img src={logo} alt=""/>
                        Web Manager
                    </Link>
                    {this.props.location.pathname !== '/' && <SearchBar/>}
                    <div className="right-nav-icons">
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
        </header>
}

const mapStateToProps = (state: any) => (
    {
        sidenavHidden: state.sidenav.hidden,
    }
);

const mapDispatchToProps = (dispatch: any) => (
    {
        actions: bindActionCreators({ hideSidenav }, dispatch),
    }
);

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Navbar));