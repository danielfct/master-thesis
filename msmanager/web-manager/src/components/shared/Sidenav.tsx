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

import PerfectScrollbar from "react-perfect-scrollbar";
import {Link} from "react-router-dom";
import React, {createRef} from "react";
import M from "materialize-css";
import {bindActionCreators} from "redux";
import {hideSidenav} from "../../redux/reducers/sidenav";
import {connect} from "react-redux";

const sidenavLinks = [
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

interface SidenavProps {
    sidenavHidden: boolean,
    actions: {hideSidenav: (state: boolean) => void},
}

class Sidenav extends React.Component<SidenavProps, any> {

    private sidenav = createRef<HTMLUListElement>();

    private shouldHideSidenav = () => window.innerWidth <= 992;

    componentDidMount = () => {
        M.Sidenav.init(this.sidenav.current as Element);
        window.addEventListener('resize', this.handleResize);
        this.props.actions.hideSidenav(this.shouldHideSidenav());
    };

    componentWillUnmount = () =>
        window.removeEventListener('resize', this.handleResize);

    handleResize = (_: any) => {
        const hide = this.shouldHideSidenav();
        if (hide !== this.props.sidenavHidden) {
            this.props.actions.hideSidenav(hide);
        }
        const sidenav = M.Sidenav.getInstance(this.sidenav.current as Element);
        if (hide || (!hide && !this.props.sidenavHidden)) {
            sidenav.close();
        }
        if (!hide) {
            sidenav.open();
        }
    };

    handleSidenav = () => {
        let sidenav = M.Sidenav.getInstance(this.sidenav.current as Element);
        let {isOpen} = sidenav;
        if (isOpen) {
            sidenav.close();
        } else {
            sidenav.open();
        }
        this.props.actions.hideSidenav(isOpen);
    };

    render = () =>
        <ul id="slide-out" className="sidenav sidenav-fixed no-shadows"
            style={this.props.sidenavHidden ? {display: 'none'} : undefined} ref={this.sidenav}>
            <div className="sidenav-menu">
                <a className="sidenav-icon sidenav-trigger transparent btn-floating btn-flat btn-small waves-effect waves-light"
                   data-target="slide-out"
                   onClick={this.handleSidenav}
                >
                    <i className="material-icons">menu</i>
                </a>
            </div>
            <PerfectScrollbar>
                {sidenavLinks.map((link, index) =>
                    <div key={index}>
                        <li>
                            <Link className="white-text" to={link.link}>
                                {link.name}
                            </Link>
                        </li>
                        {index < sidenavLinks.length - 1 && <li>
                          <div className="divider grey darken-3"/>
                        </li>}
                    </div>
                )}
            </PerfectScrollbar>
        </ul>
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

export default connect(mapStateToProps, mapDispatchToProps)(Sidenav);