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

let $ = require('jquery');
let React = require('react');
let NavLink = require('react-router-dom').NavLink;
let Link = require('react-router-dom').Link;
let Component = React.Component;

class AppLinks extends Component {

    constructor(props) {
        super(props);
        let navLinks = this.props.links;
        this.state = { links: navLinks };
    }

    renderNavLinks () {
        let links;
        links = this.state.links.map(function (link, index) {
            return (
                <NavLink key={index} exact to={link.link} className='collection-item' activeClassName='active'>
                    {link.name}
                </NavLink>
            );
        });
        return links;  
    };

    render() {
        return (            
            <div className='col s12 m4 hide-on-small-only'>
                <div className='collection'>
                    {this.renderNavLinks()}
                </div>
            </div>
        );
    }
}

class AppLinksDropdown extends Component {

    constructor(props) {
        super(props);
        let navLinks = this.props.links;
        this.state = {links: navLinks};
    }

    componentDidMount() {
        let elems = document.querySelectorAll('.dropdown-trigger');
        M.Dropdown.init(elems, {coverTrigger: false});
    }

    renderNavLinks () {
        let links;
        links = this.state.links.map(function (link, index) {
            return (
                <li key={index}>
                    <Link to={link.link}>
                        {link.name}
                    </Link>
                </li>
            );
        });
        return links;  
    };

    render() {
        return (            
            <div className='col s12 hide-on-med-and-up'>
                <button className='dropdown-trigger btn btn-small waves-effect waves-teal btn-flat col s12' href='#' data-target='linksDropdown'>
                    <i className="material-icons right">menu</i>
                    Menu                    
                </button>
                <ul id='linksDropdown' className='dropdown-content'>
                    {this.renderNavLinks()}
                </ul>
            </div>
        );
    }
}

class PageTitle extends Component {

    constructor(props) {
        super(props);
        let initialBreadcrumbs = [];
        if(this.props.breadcrumbs)
            initialBreadcrumbs = this.props.breadcrumbs;
            
        initialBreadcrumbs.push({link: '', title: this.props.title});
        this.state = { breadcrumbs: initialBreadcrumbs };
    }

    renderBreadcrumbs () {
        let breadcrumbs;
        let style = {marginBottom: '10px'};
        if (this.state.breadcrumbs) {
            breadcrumbs = this.state.breadcrumbs.map(function (breadcrumb, index) {
                if (breadcrumb.link === '') {
                    return (
                        <span key={index} className="breadcrumb">
                            {breadcrumb.title}
                        </span>
                    )
                }
                return (                    
                    <Link key={index} className="breadcrumb" to={breadcrumb.link}>
                        {breadcrumb.title}
                    </Link>
                );
            });
        }
        return (
            <div style={style} className="row">
                <div className="col s12">
                    {breadcrumbs}
                </div>
            </div>
        );
    };

    render() {        
        return this.renderBreadcrumbs();   
    }

}

export class MainLayout extends Component {

    constructor(props) {
        super(props);
        let navLinks = [
            {link: '/ui/services', name: 'Services configs'},
            {link: '/ui/apps', name: 'Apps packages'},
            {link: '/ui/edgeHosts', name: 'Edge Hosts'},
            {link: '/ui/regions', name: 'Regions'},
            {link: '/ui/containers', name: 'Containers'},
            {link: '/ui/nodes', name: 'Nodes'},
            {link: '/ui/eureka', name: 'Eureka servers'},
            {link: '/ui/loadBalancer', name: 'Load balancers'},
            {link: '/ui/rules/management', name: 'Rules Management'},
            {link: '/ui/simulatedMetrics/management', name: 'Simulated metrics Management'}
        ];
        this.state = { links: navLinks };
    }

    render() {
        return (
            <div className='row'>
                <AppLinksDropdown links={this.state.links} />
                <PageTitle title={this.props.title} breadcrumbs={this.props.breadcrumbs} />            
                <div className='col s12 m8'>
                    {this.props.children}
                </div>
                <AppLinks links={this.state.links} />
            </div>
        );
    }
}

export class CardItem extends Component {

    constructor(props) {
        super(props);
        let propLabel = this.props.label;
        let propValue = this.props.value;
        this.state = {label: propLabel, value: propValue};
    }

    renderNormal () {
        return (
            <div>
                <h5>{this.state.label}</h5>
                <div>{this.state.value}</div>
            </div>
        );
    };

    render() {        
        return this.renderNormal();
    }
}

