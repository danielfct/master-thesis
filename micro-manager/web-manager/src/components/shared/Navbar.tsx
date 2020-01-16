
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
import M from "materialize-css";
import PerfectScrollbar from 'react-perfect-scrollbar'
import {FaDocker, GoMarkGithub} from "react-icons/all";
/*import LoadingBar from 'react-redux-loading-bar'*/

const navLinks = [
    { link: '/containers', name: 'Containers' },
    { link: '/nodes', name: 'Nodes' },
    { link: '/hosts/edge', name: 'Edge Hosts' }, //TODO rename to /hosts and display edge + cloud nodes
    { link: '/apps', name: 'Apps' },
    { link: '/services', name: 'Services' },
    { link: '/rules', name: 'Rules' },
    { link: '/metrics/simulated', name: 'Simulated metrics' },
    { link: '/eureka', name: 'Eureka servers' },
    { link: '/loadBalancer', name: 'Load balancers' },
    { link: '/regions', name: 'Regions' },
];

/*TODO update hrefs*/
const navIcons = [
    { icon: <GoMarkGithub/>, href: "https://github.com/danielfct/master-thesis/tree/master/micro-manager" },
    { icon: <FaDocker/>, href: "https://hub.docker.com/u/danielfct" },
];

class Navbar extends React.Component<RouteComponentProps,any> {
    componentDidMount () {
        let elems = document.querySelectorAll('.sidenav');
        M.Sidenav.init(elems);
    }
    render () {
        {/*<LoadingBar />*/}
        return (
            <header role="navigation">
                <nav className="navbar-fixed">
                    <div className="nav-wrapper row">
                        <div className="col s2">
                            <a href="#" data-target="slide-out" className="sidenav-trigger">
                                <i className="material-icons">menu</i>
                            </a>
                            <a href="/" className="brand-logo">
                                <img src={require("../../resources/images/favicon.png")} alt=""/>
                                Web Manager
                            </a>
                        </div>
                        {this.props.location.pathname !== '/' &&
                        <form className="col s5 offset-s1" noValidate autoComplete="off">
                            <div className="input-field search-bar">
                                <input id="search" type="search" placeholder="Filter"/>
                                <label className="label-icon" htmlFor="search">
                                    <i className="material-icons">search</i>
                                </label>
                            </div>
                        </form>}
                        <div className="nav-icons">
                            {navIcons.map((navIcon, index) =>
                                <a key={index}
                                   className="transparent btn-floating btn-flat btn-small waves-effect waves-light"
                                   href={navIcon.href}>
                                    <i className="material-icons">{navIcon.icon}</i>
                                </a>
                            )}
                        </div>
                    </div>
                </nav>
                <ul id="slide-out" className="sidenav sidenav-fixed no-shadows">
                    <a className="dropdown-trigger transparent btn-floating btn-flat btn-small waves-effect waves-light"
                       data-target="slide-out">
                        <i className="material-icons">menu</i>
                    </a>
                    <PerfectScrollbar>
                        {navLinks.map((link, index: number) =>
                            <div key={index}>
                                <li>
                                    <Link className="white-text" to={link.link}>
                                        {link.name}
                                    </Link>
                                </li>
                                {index < navLinks.length - 1 &&
                                <li>
                                  <div className="divider grey darken-3"/>
                                </li>}
                            </div>
                        )}
                    </PerfectScrollbar>
                </ul>
            </header>
        );
    }
}

/*<nav className={"nav"} role="navigation">
                <div className="nav-wrapper">
                    <LoadingBar />
                    <div className='col s2 hide-on-med-and-up'>
                        <a className="dropdown-trigger transparent btn-floating btn-flat btn-small waves-effect waves-light"
                           data-target='linksDropdown'>
                            <i className="material-icons">menu</i>
                        </a>
                        <ul id='linksDropdown' className='dropdown-content'>
                            {navLinks.map((link: { [key: string]: string; }, index: number) =>
                                <li key={index}>
                                    <Link to={link.link}>
                                        {link.name}
                                    </Link>
                                </li>
                            )}
                        </ul>
                    </div>
                    <a href="/" className="brand-logo">
                        <img src={require("../../resources/images/favicon.png")} alt=""/>
                        Web Manager
                    </a>
                </div>
            </nav>*/



{/*
<ul id="slide-out" className="sidenav sidenav-fixed no-shadows">
    <li>
        <div className="user-view">
            <a href="/" className="brand-logo">
                <img src={require("../../resources/images/favicon.png")} alt=""/>
                Web Manager
            </a>
        </div>
        <div className="divider"/>
    </li>
    <li><a href="#!"><i className="material-icons">cloud</i>First Link With Icon</a></li>
    <li><a href="#!">Second Link</a></li>
    <li>
        <div className="divider"/>
    </li>
    <li><a className="subheader">Subheader</a></li>
    <li><a className="waves-effect" href="#!">Third Link With Waves</a></li>
</ul>*/}

export default withRouter(Navbar);