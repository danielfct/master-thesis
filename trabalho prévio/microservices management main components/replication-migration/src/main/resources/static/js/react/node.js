const React = require('react');
const Component = React.Component;
const Link = require('react-router-dom').Link;
const Redirect = require('react-router-dom').Redirect
import Utils from './utils';
import {MainLayout, CardItem} from './globalComponents';

class NodeCard extends Component {
    constructor(props) {
        super(props);
        this.onClickStop = this.onClickStop.bind(this);
    }
    onClickStop(){
        var action = '/api/nodes';
        var dataObject = {
            hostname : this.props.node.hostname
        };     
        var dataToSend = JSON.stringify(dataObject);
        var self = this;
        Utils.formSubmit(action, 'DELETE', dataToSend, function (data) {
            M.toast({html: "<div>Node removed successfully!</div>"});
            self.props.reloadNodes();
        });
    }
    render() {   
        return (
            <div className='row'>
                <div className='col s12'>
                    <div className='card'>
                        <div className='card-content'>
                            <div className="right-align">                                
                                <div className="row">
                                    <div className="col s12">
                                        <button disabled={this.props.node.role == 'manager'} className="waves-effect waves-light btn-small red darken-4" onClick={this.onClickStop}>Remove node</button>
                                    </div>
                                </div>
                            </div>
                            <CardItem label='Id' value={this.props.node.id}/>
                            <CardItem label='Hostname' value={this.props.node.hostname}/>
                            <CardItem label='Role' value={this.props.node.role}/>
                            <CardItem label='Status' value={this.props.node.status}/>
                        </div>                            
                    </div>
                </div>
            </div>
        );
    }
}

export class Nodes extends Component {
    constructor(props) {
        super(props);
        this.state = { data: [], loading: false };
        this.loadNodes = this.loadNodes.bind(this);
    }
    loadNodes(){
        this.setState({ loading: true });  
        var self = this;
        Utils.ajaxGet('/api/nodes',           
            function (data) {
                var nodes = data;                
                self.setState({data: nodes, loading: false});
            });
    }
    componentDidMount() {
        this.loadNodes();
        var instances = M.Tooltip.init(document.querySelectorAll('.tooltipped'));
        this.setState({tooltipInstances: instances});
    }
    componentWillUnmount() {
        this.state.tooltipInstances[0].destroy();
    }
    render() {
        var nodes;
        var self = this;
        if (this.state.data) {
            nodes = this.state.data.map(function (node) {
                return (
                    <NodeCard key={node.id} node={node} reloadNodes={self.loadNodes}/>
                );
            });
        }
        return (
            <MainLayout title='Nodes'>
               <div className="fixed-action-btn tooltipped" data-position="left" data-tooltip="Add node">
                    <Link className="waves-effect waves-light btn-floating btn-large grey darken-4" to='/ui/nodes/add'>
                        <i className="large material-icons">add</i>
                    </Link>
                </div>
                {nodes}
            </MainLayout>
        );
    }
}

export class AddNode extends Component {
    constructor(props) {
        super(props);
        var defaultValues = {
            region: '', country: '', city: '', quantity: 1
        }
        var thisBreadcrumbs = [ {link: '/ui/nodes', title: 'Nodes'} ];
        this.state = { breadcrumbs: thisBreadcrumbs, loading: false, values: defaultValues, availableRegions : [], formSubmit: false};
        this.onSubmitForm = this.onSubmitForm.bind(this);
        this.renderRegionsSelect = this.renderRegionsSelect.bind(this);
        this.loadRegions = this.loadRegions.bind(this);
    }
    loadRegions() {
        this.setState({ loading: true });  
        var self = this;
        Utils.ajaxGet('/api/regions',           
            function (data) {              
                self.setState({availableRegions: data, loading: false});
            });
    }
    componentDidMount() {
        this.loadRegions();
    }
    componentDidUpdate(){
        M.FormSelect.init(document.querySelectorAll('select'));
    }
    renderRegionsSelect() {
        var regions;
        if (this.state.availableRegions) {
            regions = this.state.availableRegions.map(function (region) {
                return (
                    <option key={region.regionName} value={region.regionName}>{region.regionName + ' (' + region.regionDescription + ')'}</option>
                );
            });
            return regions;
        }
    }
    onSubmitForm(event){
        event.preventDefault();
        var formAction = '/api/nodes';
        var formMethod = 'POST';
        var formData = Utils.convertFormToJson('form-node');     
        var self = this;
        Utils.formSubmit(formAction, formMethod, formData, function (data) {
            self.setState({formSubmit: true});
            var nodes = data.toString();
            M.toast({html: "<div>New nodes added successfully!</br>Nodes: " + nodes + "</div>"});
        });
    }
    renderForm(){
        var regionSelect = this.renderRegionsSelect();
        return(
            <form id="form-node" onSubmit={this.onSubmitForm}>               
               <div className="input-field col s12">
                    <select defaultValue={this.state.values.region} name="region" id="region" >
                        <option value="" disabled="disabled">Choose region</option>
                        {regionSelect}
                    </select>
                    <label htmlFor="region">Region</label>
                </div>
                <div className="input-field col s12">
                    <input defaultValue={this.state.values.country} type="text" name="country" id="country" autoComplete="off"></input>
                    <label htmlFor="country">Country</label>
                </div>
                <div className="input-field col s12">
                    <input defaultValue={this.state.values.city} type="text" name="city" id="city" autoComplete="off"></input>
                    <label htmlFor="city">City</label>
                </div>
                <div className="input-field col s12">
                    <input defaultValue={this.state.values.quantity} type="number" name="quantity" id="quantity" autoComplete="off"></input>
                    <label htmlFor="quantity">Quantity</label>
                </div>
                <button className="btn waves-effect waves-light" type="submit" name="action">
                    Add
                    <i className="material-icons right">send</i>
                </button>
            </form>
        );
    }
    render() {
        if(this.state.formSubmit){
            return <Redirect to='/ui/nodes' />;
        }
        
        return (
            <MainLayout title='Add node' breadcrumbs={this.state.breadcrumbs}>
                <div className='row'>
                    <div className='col s12'>
                        <div className='card'>
                            <div className='card-content'>
                                {this.renderForm()}
                            </div>                            
                        </div>
                    </div>
                </div>                
            </MainLayout>
        );
    }
}
