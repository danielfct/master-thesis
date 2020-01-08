var $ = require('jquery');
const React = require('react');
const NavLink = require('react-router-dom').NavLink;
const Link = require('react-router-dom').Link;
const Component = React.Component;

class AppLinks extends Component {
    constructor(props) {
        super(props);
        var navLinks = this.props.links;
        this.state = { links: navLinks };
        this.renderNavLinks = this.renderNavLinks.bind(this);
    }
    renderNavLinks() {
        var links;
        links = this.state.links.map(function (link, index) {
            return (
                <NavLink key={index} exact to={link.link} className='collection-item' activeClassName='active'>
                    {link.name}
                </NavLink>
            );
        });
        return links;  
    }
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
        var navLinks = this.props.links;
        this.state = { links: navLinks };
        this.renderNavLinks = this.renderNavLinks.bind(this);
    }
    renderNavLinks() {
        var links;
        links = this.state.links.map(function (link, index) {
            return (
                <li key={index}>
                    <Link to={link.link} >
                        {link.name}
                    </Link>
                </li>
            );
        });
        return links;  
    }
    componentDidMount() {
        var elems = document.querySelectorAll('.dropdown-trigger');
        M.Dropdown.init(elems, {coverTrigger: false});
    }
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
        var initialBreadcrumbs = [];
        if(this.props.breadcrumbs)
            initialBreadcrumbs = this.props.breadcrumbs;
            
        initialBreadcrumbs.push({link: '', title: this.props.title});
        this.state = { breadcrumbs: initialBreadcrumbs };
        this.renderBreadcrumbs = this.renderBreadcrumbs.bind(this);
    }
    renderBreadcrumbs() {
        var breadcrumbs;
        var style = {marginBottom: '10px'};
        if (this.state.breadcrumbs) {
            breadcrumbs = this.state.breadcrumbs.map(function (breadcrumb, index) {
                if(breadcrumb.link == '') {
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
    }
    render() {        
        return this.renderBreadcrumbs();   
    }
}

export class MainLayout extends Component {
    constructor(props) {
        super(props);
        var navLinks = [
            {link: '/ui/services', name: 'Services configs'},
            {link: '/ui/apps', name: 'Apps packages'},
            {link: '/ui/edgehosts', name: 'Edge Hosts'},
            {link: '/ui/regions', name: 'Regions'},
            {link: '/ui/containers', name: 'Containers'},
            {link: '/ui/nodes', name: 'Nodes'},
            {link: '/ui/eureka', name: 'Eureka servers'},
            {link: '/ui/loadbalancer', name: 'Load balancers'},
            {link: '/ui/rules/management', name: 'Rules Management'},
            {link: '/ui/simulatedmetrics/management', name: 'Simulated metrics Management'}           
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
        var propLabel = this.props.label;
        var propValue = this.props.value;
        this.state = { label: propLabel, value: propValue };
        this.renderNormal = this.renderNormal.bind(this);
    }
    renderNormal(){
        return (
            <div>
                <h5>{this.state.label}</h5>
                <div>{this.state.value}</div>
            </div>
        );
    }
    render() {        
        return this.renderNormal();
    }
}

