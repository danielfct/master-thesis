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
import {connect} from "react-redux";
import {showSidenavByUser, showSidenavByWidth} from "../../actions";
import {ReduxState} from "../../reducers";

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

interface StateToProps {
    sidenav: {user: boolean, width: boolean}
}

interface DispatchToProps {
    showSidenavByUser: (value: boolean) => void;
    showSidenavByWidth: (value: boolean) => void;
}

type Props = StateToProps & DispatchToProps;

class Sidenav extends React.Component<Props, {}> {

    private sidenav = createRef<HTMLUListElement>();

    private shouldShowSidenav = () => window.innerWidth > 992;

    componentDidMount = () => {
        M.Sidenav.init(this.sidenav.current as Element);
        window.addEventListener('resize', this.handleResize);
    };

    componentWillUnmount = () =>
        window.removeEventListener('resize', this.handleResize);

    handleResize = (_: any) => {
        const sidenav = M.Sidenav.getInstance(this.sidenav.current as Element);
        const {user, width} = this.props.sidenav;
        let show = this.shouldShowSidenav();
        if (show && sidenav.isOpen) {
            sidenav.close();
        }
        if (show != width) {
            this.props.showSidenavByWidth(show);
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
        this.props.showSidenavByUser(!isOpen);
    };

    render = () =>
        <ul id="slide-out" className="sidenav sidenav-fixed no-shadows"
            style={this.props.sidenav.user ? undefined : {display: 'none'}} ref={this.sidenav}>
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

const mapStateToProps = (state: ReduxState): StateToProps => (
    {
        sidenav: state.ui.sidenav,
    }
);

const mapDispatchToProps = (dispatch: any): DispatchToProps =>
    bindActionCreators({ showSidenavByUser, showSidenavByWidth }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Sidenav);