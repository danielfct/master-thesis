var $ = require('jquery');
const React = require('react');
const Component = React.Component;
const Redirect = require('react-router-dom').Redirect;
const Link = require('react-router-dom').Link;
import Utils from './utils';
import {MainLayout, CardItem} from './globalComponents';

class ContainerPort extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div>
                <h6>Public port : Private port</h6>
                <div>{this.props.port.publicPort + ' : ' + this.props.port.privatePort}</div>
                <h6>IP / Type</h6>
                <div>{this.props.port.ip + ' / ' + this.props.port.type}</div>
            </div>
        );
    }
}
class ContainerCard extends Component {
    constructor(props) {
        super(props);
        this.state = { nodes: [], isReplicate: false, isMigrate: false, hostnameSelected: '', seconds: 0, loading: false };
        this.renderNames = this.renderNames.bind(this);
        this.renderPorts = this.renderPorts.bind(this);
        this.renderLabels = this.renderLabels.bind(this);
        this.onClickStop = this.onClickStop.bind(this);
        this.onClickReplicate = this.onClickReplicate.bind(this);
        this.loadAvailableNodes = this.loadAvailableNodes.bind(this);
        this.renderReplicate = this.renderReplicate.bind(this);
        this.renderHostnamesSelect = this.renderHostnamesSelect.bind(this);
        this.handleChangeHostname = this.handleChangeHostname.bind(this);
        this.onClickCancelReplicate = this.onClickCancelReplicate.bind(this);
        this.onSubmitReplicate = this.onSubmitReplicate.bind(this);
        this.onClickMigrate = this.onClickMigrate.bind(this);
        this.renderSelectTotal = this.renderSelectTotal.bind(this);
        this.onSubmitMigrate = this.onSubmitMigrate.bind(this);
    }
    renderNames(){
        var names = this.props.container.names.map(function (name, index) {
            var counter = index + 1;
            return (
                <CardItem key={name + index} label={'Name ' + counter} value={name}/>
            );
        });
        return names;
    }
    renderLabels() {
        var propsLabels = this.props.container.labels;
        var labels = Object.keys(propsLabels).map(function(key, index) {
            return (                
                <div key={key}>
                    {key + ': ' + propsLabels[key]}
                </div>
            )
        });
        return labels;
    }
    renderPorts(){
        var ports = this.props.container.ports.map(function (port, index) {
            return (
                <ContainerPort key={'port' + index} port={port}/>
            );
        });
        return ports;
    }
    onClickStop(){
        var action = '/api/containers/'+ this.props.container.id;
        var dataObject = {
            hostname : this.props.container.hostname,
            containerId : this.props.container.id
        };     
        var dataToSend =JSON.stringify(dataObject);
        var self = this;
        Utils.formSubmit(action, 'DELETE', dataToSend, function (data) {
            M.toast({html: "<div>Container stopped successfully!</div>"});
            self.props.containerStopped(self.props.container.id);
        });
    }
    loadAvailableNodes(){
        this.setState({ loading: true });
        var self = this;
        Utils.ajaxGet('/api/nodes', function(data){              
            self.setState({nodes: data, loading: false});
        });
    }
    onClickReplicate(){
        this.loadAvailableNodes();
        this.setState({ isReplicate: true });
    }
    onClickMigrate(){
        this.loadAvailableNodes();
        this.setState({ isMigrate: true });
    }
    onClickCancelReplicate(){
        var instance = M.FormSelect.getInstance(this.hostname);
        instance.destroy();
        this.setState({ isReplicate: false, isMigrate: false });        
    }
    handleChangeHostname(event) {
        this.setState({hostnameSelected: event.target.value});
    }
    onSubmitReplicate(){
        var self = this;
        var url = '/api/containers/replicate';
        var dataToSend = JSON.stringify({fromHostname: this.props.container.hostname,
             containerId: this.props.container.id, toHostname: this.state.hostnameSelected});
        Utils.formSubmit(url, 'POST', dataToSend, function(data){
            self.onClickCancelReplicate();
            self.props.onReplicate();
            M.toast({html: "<div>Container replicated successfully!</div>"});            
        });
    }
    onSubmitMigrate(){
        var self = this;
        var url = '/api/containers/migrate';
        var dataToSend = JSON.stringify({fromHostname: this.props.container.hostname,
             containerId: this.props.container.id, toHostname: this.state.hostnameSelected,
             secondsBeforeStop: this.state.seconds});
        Utils.formSubmit(url, 'POST', dataToSend, function(data){
            self.onClickCancelReplicate();
            self.props.onReplicate();
            M.toast({html: "<div>Container migrated successfully!</div>"});            
        });
    }
    renderHostnamesSelect(){
        var hostnameNodes;
        if (this.state.nodes) {
            hostnameNodes = this.state.nodes.map(function (node) {
                return (
                    <option key={node.id} value={node.hostname}>{node.hostname}</option>
                );
            });
            return hostnameNodes;
        }
    }
    renderSelectTotal(){
        return (
            <div className="input-field col s6">
                <select ref={ hostname => this.hostname = hostname} defaultValue="" name="hostname" id="hostname" onChange={this.handleChangeHostname} >
                    <option value="" disabled="disabled">Choose hostname</option>
                    {this.renderHostnamesSelect()}
                </select>
                <label htmlFor="hostname">Hostname</label>
            </div>
        )
    }
    renderReplicate(){        
        var style = { marginLeft: "10px" };
        var cancelButton = 
            <a title="Cancel" style={style} className="btn-floating waves-effect waves-light red darken-4" onClick={this.onClickCancelReplicate}>
                <i className="material-icons">clear</i>
            </a>;

        if(this.state.isReplicate){
            return (
                <div className="row">
                    {this.renderSelectTotal()}
                    <div className="input-field col s6">
                        <a title="Replicate" style={style} className="btn-floating waves-effect waves-light" onClick={this.onSubmitReplicate}>
                            <i className="material-icons">send</i>
                        </a>
                        {cancelButton}
                    </div>
                </div>
            );
            
        }
        else if(this.state.isMigrate){
            return (
                <div className="row">
                    {this.renderSelectTotal()}
                    <div className="input-field col s6">
                        <a title="Migrate" style={style} className="btn-floating waves-effect waves-light" onClick={this.onSubmitMigrate}>
                            <i className="material-icons">send</i>
                        </a>
                        {cancelButton}
                    </div>
                </div>
            );
        }
        else if(!this.state.isReplicate && !this.state.isMigrate) 
            return (
                <div className="row">
                    <div className="col s12">
                        <a style={style} className="waves-effect waves-light btn-small" onClick={this.onClickMigrate}>Migrate</a>
                        <a style={style} className="waves-effect waves-light btn-small" onClick={this.onClickReplicate}>Replicate</a>
                    </div>
                </div>
            );
    }
    componentDidUpdate(){
        if(this.state.isReplicate || this.state.isMigrate){
            var elems = this.hostname;
            M.FormSelect.init(elems);
        }        
    }
    componentDidMount() {
        M.Collapsible.init(document.querySelectorAll('.collapsible'));
    }
    render() {
        var style = { marginLeft: "5px" };
        var labelStyle = { paddingTop: "0px", paddingBottom: "0px"};
        return (
            <div className='row'>
                <div className='col s12'>
                    <div className='card'>
                        <div className='card-content'>
                            <div className="right-align">
                                {this.renderReplicate()}
                                <div className="row">
                                    <div className="col s12">
                                        <a style={style} className="waves-effect waves-light btn-small red darken-4" onClick={this.onClickStop}>Stop</a>
                                    </div>
                                </div>
                            </div>
                            <CardItem label='Id' value={this.props.container.id}/>                            
                            {this.renderNames()}
                            <CardItem label='Image' value={this.props.container.image}/>
                            <CardItem label='Command' value={this.props.container.command}/>
                            <CardItem label='State' value={this.props.container.state}/>
                            <CardItem label='Status' value={this.props.container.status}/>
                            <CardItem label='Hostname' value={this.props.container.hostname}/>
                            <h5>Ports</h5>                                                                  
                            {this.renderPorts()}                            
                            <div className="row">
                                <ul className="collapsible">
                                    <li>
                                        <div style={labelStyle} className="collapsible-header">
                                            <h5>Labels</h5>
                                        </div>
                                        <div className="collapsible-body">
                                            {this.renderLabels()}
                                        </div>                                    
                                    </li>
                                </ul>
                            </div>
                        </div>                            
                    </div>
                </div>
            </div>
        );
    }
}

export class Containers extends Component {
    constructor(props) {
        super(props);
        this.state = { data: [], filtContainers: [], filter: '', loading: false };
        this.containerStopped = this.containerStopped.bind(this);
        this.onReplicate = this.onReplicate.bind(this);
        this.onChangeFilter = this.onChangeFilter.bind(this);
        this.applyFilter = this.applyFilter.bind(this);
        this.clearFilter = this.clearFilter.bind(this);
    }
    onReplicate(){
        this.loadContainers();
    }
    onChangeFilter(event) {
        var filterVal = event.target.value;
        var self = this;
        this.setState({filter: filterVal}, function(){
            self.applyFilter();
        });
    }
    applyFilter() {
        var filterVal = this.state.filter;
        var data = this.state.data;
        var filteredContainers = [];
        
        for (let index = 0; index < data.length; index++) {
            const container = data[index];
            if(container.names[0].includes(filterVal)) {
                filteredContainers.push(container);
            }
        }
        this.setState({filtContainers: filteredContainers});
    }
    clearFilter() {
        var self = this;
        this.setState({filter: ''}, function(){
            self.applyFilter();
            $('#filter').val('');
        });
    }
    loadContainers(){
        this.setState({ loading: true });  
        var self = this;
        Utils.ajaxGet('/api/containers',           
            function (data) {
                var containers = data;                
                self.setState({data: containers, filtContainers: containers, loading: false});
            });
    }    
    componentDidMount() {
        this.loadContainers();
        var instances = M.Tooltip.init(document.querySelectorAll('.tooltipped'));
        this.setState({tooltipInstances: instances});
    }
    componentWillUnmount() {
        this.state.tooltipInstances[0].destroy();
    }
    containerStopped(containerId){
        var newData = this.state.data;
        var self = this;
        for (let index = 0; index < newData.length; index++) {           
            if(newData[index].id == containerId){
                newData.splice(index, 1);
                break;
            }
        }
        this.setState({data: newData}, function(){
            self.applyFilter();
        });
    }    
    render() {
        var containersNodes;
        var self = this;
        if (this.state.data) {
            containersNodes = this.state.filtContainers.map(function (container) {
                return (
                    <ContainerCard onReplicate={self.onReplicate} key={container.id} container={container} containerStopped={self.containerStopped}/>
                );
            });
        }
        return (
            <MainLayout title='Containers'>                
                <div className="input-field col s10">
                    <input onChange={this.onChangeFilter} value={this.state.filter} type="text" name="filter" id="filter" autoComplete="off"></input>
                    <label htmlFor="filter">Filter by name</label>
                </div>
                <div className="input-field col s2 right-align">
                    <a onClick={this.clearFilter} title="Clear filter" className="btn-floating waves-effect waves-light red darken-4">
                        <i className="material-icons">clear</i>
                    </a>
                </div>
                {containersNodes}
                <div className="fixed-action-btn tooltipped" data-position="left" data-tooltip="Launch container">
                    <Link className="waves-effect waves-light btn-floating btn-large grey darken-4" to='/ui/containers/launch'>
                        <i className="large material-icons">add</i>
                    </Link>
                </div>
            </MainLayout>
        );
    }
}

export class LaunchContainer extends Component {
    constructor(props) {
        super(props);
        var serviceDefaultValues = [];
        if(props.match.params.containerId){
            
        }
        var defaultValues = {
            internalPort: '', externalPort: ''
        } 
        var thisBreadcrumbs = [{link: '/ui/containers', title: 'Containers'}];
        this.state = { breadcrumbs: thisBreadcrumbs, services: [], nodes: [], loading: false,  values: defaultValues, formSubmit: false};
        this.loadAvailableNodes = this.loadAvailableNodes.bind(this);
        this.loadServiceConfigs = this.loadServiceConfigs.bind(this);
        this.onSubmitForm = this.onSubmitForm.bind(this);
        this.onChangeServicesSelect = this.onChangeServicesSelect.bind(this);
        this.renderServicesSelect = this.renderServicesSelect.bind(this);
        this.renderHostnamesSelect = this.renderHostnamesSelect.bind(this);
        this.onInputChange = this.onInputChange.bind(this);
    }
    loadAvailableNodes(){
        this.setState({ loading: true });
        var self = this;
        Utils.ajaxGet('/api/nodes', function(data){              
            self.setState({nodes: data, loading: false});
        });
    }
    loadServiceConfigs(){
        this.setState({ loading: true });  
        var self = this;
        var url = '/api/services';
        Utils.ajaxGet(url, function(data){
            self.setState({services: data, loading: false});
        });            
    }
    renderServicesSelect(){
        var servicesNodes;
        if (this.state.services) {
            servicesNodes = this.state.services.map(function (service) {
                return (
                    <option key={service.id} value={service.serviceName}>{service.serviceName}</option>
                );
            });
            return servicesNodes;
        }
    }
    renderHostnamesSelect(){
        var hostnameNodes;
        if (this.state.nodes) {
            hostnameNodes = this.state.nodes.map(function (node) {
                return (
                    <option key={node.id} value={node.hostname}>{node.hostname}</option>
                );
            });
            return hostnameNodes;
        }
    }
    componentDidMount() {
        this.loadServiceConfigs();
        this.loadAvailableNodes();
    }
    componentDidUpdate(){
        var elems = document.querySelectorAll('select');
        M.FormSelect.init(elems);
    }
    onSubmitForm(event){
        event.preventDefault();
        var formId = "form-service";
        var formAction = '/api/containers';
        var formMethod = 'POST';
        var formData = Utils.convertFormToJson(formId);     
        var self = this;
        Utils.formSubmit(formAction, formMethod, formData, function (data) {
            self.setState({isEdit: false, formSubmit: true});
            console.log(data);
            M.toast({html: "<div>Container launched successfully!</div>"});
        });
    }
    onInputChange(event){        
        var name = event.target.name ;
        var newValues = this.state.values;
        newValues[name] = event.target.value;
        this.setState({values: newValues});
    }
    onChangeServicesSelect(event){
        var services = this.state.services;
        for (let index = 0; index < services.length; index++) {
            if(services[index].serviceName == event.target.value){
                var newValues = this.state.values;
                newValues.internalPort = services[index].internalPort;
                newValues.externalPort = services[index].externalPort;
                
                this.setState({values: newValues});
            }            
        }
    }
    renderForm(){
        var servicesSelect = this.renderServicesSelect();
        var hostnamesSelect = this.renderHostnamesSelect();
        return(
            <form id="form-service" onSubmit={this.onSubmitForm}>
                <div className="input-field col s12">
                    <select defaultValue="" name="hostname" id="hostname" >
                        <option value="" disabled="disabled">Choose hostname</option>
                        {hostnamesSelect}
                    </select>
                    <label htmlFor="hostname">Hostname</label>
                </div>

                <div className="input-field col s12">
                    <select defaultValue="" name="service" id="service" onChange={this.onChangeServicesSelect}>
                        <option value="" disabled="disabled">Choose service</option>
                        {servicesSelect}
                    </select>
                    <label htmlFor="service">Service</label>
                </div>
                <div className="input-field col s12">
                    <input defaultValue={this.state.values.internalPort} type="text" name="internalPort" id="internalPort" autoComplete="off"></input>
                    <label htmlFor="internalPort">Internal Port</label>
                </div>
                <div className="input-field col s12">
                    <input defaultValue={this.state.values.externalPort} type="text" name="externalPort" id="externalPort" autoComplete="off"></input>
                    <label htmlFor="externalPort">External Port</label>
                </div>
                <button className="btn waves-effect waves-light" type="submit" name="action">
                    Launch
                    <i className="material-icons right">send</i>
                </button>
            </form>
        );
    }
    render() {
        if(this.state.formSubmit){
            return <Redirect to='/ui/containers' />;
        }
        return (
            <MainLayout title='Launch container' breadcrumbs={this.state.breadcrumbs}>
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
