var $ = require('jquery');
const React = require('react');
const ReactDOM = require('react-dom');
const Link = require('react-router-dom').Link;
const Redirect = require('react-router-dom').Redirect;
const Component = React.Component;
import Utils from './utils';
import {MainLayout, CardItem} from './globalComponents';


export class ServiceConfigCard extends Component {
    constructor(props) {
        super(props);
        var serviceConfig = this.props.serviceConfig;
        this.state = { data: serviceConfig, loading: false };       
    }
    renderLink(){
        return(
            <div className="right-align">                                
                <div className="row">
                    <div className="col s12">
                        <Link className="waves-effect waves-light btn-small" to={'/ui/services/detail/'+ this.state.data.id}>
                            View details
                        </Link>
                    </div>
                </div>
            </div>
        )
    }
    renderSimple(){
        var linkDetails = this.props.viewDetails ? this.renderLink() : null;
        return (
            <div>
                {linkDetails}
                <CardItem label='Service name' value={this.state.data.serviceName}/>
                <CardItem label='Docker Repository' value={this.state.data.dockerRepo}/>
                <CardItem label='Default external port' value={this.state.data.defaultExternalPort}/>
                <CardItem label='Default internal port' value={this.state.data.defaultInternalPort}/>
                <CardItem label='Default database' value={this.state.data.defaultDb}/>
                <CardItem label='Launch command' value={this.state.data.launchCommand}/>
                <CardItem label='Minimum Replics' value={this.state.data.minReplics}/>
                <CardItem label='Maximum Replics' value={this.state.data.maxReplics}/>
                <CardItem label='Output label' value={this.state.data.outputLabel}/>
                <CardItem label='Service type' value={this.state.data.serviceType}/>
                <CardItem label='Average Memory (bytes)' value={this.state.data.avgMem}/>
            </div>
        )
    } 
    renderCard(){
        return (
            <div className='row'>
                <div className='col s12'>
                    <div className='card'>
                        <div className='card-content'>
                             {this.renderSimple()}
                        </div>                            
                    </div>
                </div>
            </div>
        )
    }
    render() {
        var finalRender = this.props.renderSimple ? this.renderSimple() : this.renderCard();
        return (
            finalRender
        )
    }
}

export class ServiceConfigs extends Component {
    constructor(props) {
        super(props);
        this.state = { data: [], filtServices: [], filter: '', loading: false };
        this.onChangeFilter = this.onChangeFilter.bind(this);
        this.applyFilter = this.applyFilter.bind(this);
        this.clearFilter = this.clearFilter.bind(this);
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
        var filteredServices = [];
        
        for (let index = 0; index < data.length; index++) {
            const service = data[index];
            if(service.serviceName.includes(filterVal)) {
                filteredServices.push(service);
            }
        }
        this.setState({filtServices: filteredServices});
    }
    clearFilter() {
        var self = this;
        this.setState({filter: ''}, function(){
            self.applyFilter();
            $('#filter').val('');
        });
    }
    loadServices(){
        this.setState({ loading: true });  
        var self = this;
        Utils.ajaxGet('/api/services',           
            function (data) {
                var serviceConfigs = data;                
                self.setState({data: serviceConfigs, filtServices: serviceConfigs, loading: false});
            });
    }
    componentDidMount() {
        this.loadServices();
        var instances = M.Tooltip.init(document.querySelectorAll('.tooltipped'));
        this.setState({tooltipInstances: instances});
    }
    componentWillUnmount() {
        this.state.tooltipInstances[0].destroy();
    }
    render() {
        var serviceConfigsNodes;
        if (this.state.data) {
            serviceConfigsNodes = this.state.filtServices.map(function (serviceConfig) {
                return (
                    <ServiceConfigCard viewDetails={true} key={serviceConfig.id} serviceConfig={serviceConfig} />
                );
            });
        }
        return (
            <MainLayout title='Services configs'>
                <div className="input-field col s10">
                    <input onChange={this.onChangeFilter} value={this.state.filter} type="text" name="filter" id="filter" autoComplete="off"></input>
                    <label htmlFor="filter">Filter by name</label>
                </div>
                <div className="input-field col s2 right-align">
                    <a onClick={this.clearFilter} title="Clear filter" className="btn-floating waves-effect waves-light red darken-4">
                        <i className="material-icons">clear</i>
                    </a>
                </div>                
                {serviceConfigsNodes}
                <div className="fixed-action-btn tooltipped" data-position="left" data-tooltip="Add service">
                    <Link className="waves-effect waves-light btn-floating btn-large grey darken-4" to='/ui/services/detail'>
                        <i className="large material-icons">add</i>
                    </Link>
                </div>
            </MainLayout>            
        );
    }
}

export class ServiceConfigPage extends Component {
    constructor(props) {
        super(props);
        var paramId = 0;
        if(this.props.match.params.id)
            paramId = this.props.match.params.id;

        var isEdit = paramId == 0;
        var serviceInitialValues = {
            id: paramId, serviceName: '', dockerRepo: '', defaultExternalPort: '',
            defaultInternalPort: '', defaultDb: '', launchCommand: '', minReplics: 0, 
            maxReplics: 0, outputLabel: '', serviceType: '', avgMem: 0
        }
        var thisBreadcrumbs = [{title: 'Services configs', link: '/ui/services'}];   
        this.state = { breadcrumbs: thisBreadcrumbs, service: serviceInitialValues, dependencies: [], loadedDependencies: false, loading: false, isEdit: isEdit, isDeleted: false };
        this.loadDependencies = this.loadDependencies.bind(this);
        this.loadServiceConfig = this.loadServiceConfig.bind(this);
        this.onClickEdit = this.onClickEdit.bind(this);
        this.onClickRemove = this.onClickRemove.bind(this);
        this.onSubmitForm = this.onSubmitForm.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.renderButton = this.renderButton.bind(this);
    }
    componentDidMount() {
        if(this.state.service.id != 0) {
            this.loadDependencies();
            this.loadServiceConfig();
        }
        M.updateTextFields();
        M.FormSelect.init(document.querySelectorAll('select'));       
    }
    componentDidUpdate(){
        M.updateTextFields();
        M.Collapsible.init(document.querySelectorAll('.collapsible'));
        M.FormSelect.init(document.querySelectorAll('select'));
    }
    loadServiceConfig(){
        this.setState({ loading: true });  
        var self = this;
        Utils.ajaxGet('/api/services/' + this.state.service.id,           
            function (data) {              
                self.setState({service: data, loading: false});
            });
    }
    loadDependencies(){
        this.setState({ loading: true });  
        var self = this;
        Utils.ajaxGet('/api/services/' + this.state.service.id + '/dependencies',           
            function (data) {              
                self.setState({dependencies: data, loadedDependencies: true, loading: false});
            });
    }    
    renderDependencies(){
        if(this.state.loadedDependencies){
            var dependencies;
            if(this.state.dependencies.length > 0){
                dependencies = this.state.dependencies.map(function (dependency) {
                    return (
                        <li key={'dependency-' + dependency.id} >
                            <div className="collapsible-header">{dependency.serviceName}</div>
                            <div className="collapsible-body">
                                <ServiceConfigCard renderSimple={true} serviceConfig={dependency}/>
                            </div>
                      </li>
                    );
                });
            }
            else{
                var style = {padding: '15px'};
                dependencies = <div style={style}>No dependencies</div>
            }
            return (
                <div>
                    <h5>Dependencies</h5>
                    <ul className="collapsible">
                        {dependencies}
                    </ul>
                </div>
            );
        }
    }
    onClickEdit(){
        var edit = !this.state.isEdit;
        this.setState({isEdit: edit});
    }
    onClickRemove() {
        var formAction = '/api/services/' + this.state.service.id;
        var formMethod = 'DELETE';    
        var self = this;
        Utils.formSubmit(formAction, formMethod, {}, function (data) {
            self.setState({isDeleted: true});
            M.toast({html: "<div>Service config removed successfully!</div>"});
        });
    }
    handleChange(event) {
        var name = event.target.name;
        var newData = this.state.service;
        newData[name] = event.target.value;
        this.setState({service: newData});
    }
    onSubmitForm(event){
        event.preventDefault();
        var formAction = '/api/services/' + this.state.service.id;
        var formMethod = 'POST';
        var formData = Utils.convertFormToJson('form-service');     
        var self = this;
        Utils.formSubmit(formAction, formMethod, formData, function (data) {
            var newService = self.state.service;
            if(newService.id == 0) {
                var title = document.title;
                history.replaceState({}, title, '/ui/services/detail/' + data);
            }
            newService.id = data;
            self.setState({service: newService});
            M.toast({html: "<div>Service config saved successfully!</div>"});
        });
    }
    renderButton() {
        if(this.state.isEdit) {
            return (
                <button className="btn waves-effect waves-light" type="submit" name="action">
                    Save
                    <i className="material-icons right">send</i>
                </button>
            )
        }
        return null;
    }
    renderServiceConfigForm(){
        var editLabel = this.state.isEdit ? "Cancel" : "Edit";
        var style = {marginLeft: '5px'};
            return (
                <div className='row'>
                    <div className="right-align">                                
                        <div className="row">
                            <div className="col s12">
                                <a className="waves-effect waves-light btn-small" onClick={this.onClickEdit}>{editLabel}</a>
                                <button disabled={this.state.service.id == 0} style={style} className="waves-effect waves-light btn-small red darken-4" onClick={this.onClickRemove}>Remove</button>
                            </div>
                        </div>
                    </div>
                    <form id="form-service" onSubmit={this.onSubmitForm}>
                        <div className="input-field col s12">
                            <input disabled={!this.state.isEdit} value={this.state.service.serviceName} onChange={this.handleChange} name="serviceName" id="serviceName" type="text" autoComplete="off"/>
                            <label htmlFor="serviceName">Service name</label>
                        </div>
                        <div className="input-field col s12">
                            <input disabled={!this.state.isEdit} value={this.state.service.dockerRepo} onChange={this.handleChange} name="dockerRepo" id="dockerRepo" type="text" autoComplete="off"/>
                            <label htmlFor="dockerRepo">Docker Repository</label>
                        </div>
                        <div className="input-field col s12">
                            <input disabled={!this.state.isEdit} value={this.state.service.defaultExternalPort} onChange={this.handleChange} name="defaultExternalPort" id="defaultExternalPort" type="text" autoComplete="off"/>
                            <label htmlFor="defaultExternalPort">Default external port</label>
                        </div>
                        <div className="input-field col s12">
                            <input disabled={!this.state.isEdit} value={this.state.service.defaultInternalPort} onChange={this.handleChange} name="defaultInternalPort" id="defaultInternalPort" type="text" autoComplete="off"/>
                            <label htmlFor="defaultInternalPort">Default internal port</label>
                        </div>
                        <div className="input-field col s12">
                            <input disabled={!this.state.isEdit} value={this.state.service.defaultDb} onChange={this.handleChange} name="defaultDb" id="defaultDb" type="text" autoComplete="off"/>
                            <label htmlFor="defaultDb">Default database</label>
                        </div>
                        <div className="input-field col s12">
                            <input disabled={!this.state.isEdit} value={this.state.service.launchCommand} onChange={this.handleChange} name="launchCommand" id="launchCommand" type="text" autoComplete="off"/>
                            <label htmlFor="launchCommand">Launch command</label>
                        </div>
                        <div className="input-field col s12">
                            <input disabled={!this.state.isEdit} value={this.state.service.minReplics} onChange={this.handleChange} name="minReplics" id="minReplics" type="number" autoComplete="off"/>
                            <label htmlFor="minReplics">Minimum Replics</label>
                        </div>
                        <div className="input-field col s12">
                            <input disabled={!this.state.isEdit} value={this.state.service.maxReplics} onChange={this.handleChange} name="maxReplics" id="maxReplics" type="number" autoComplete="off"/>
                            <label htmlFor="maxReplics">Maximum Replics</label>
                        </div>
                        <div className="input-field col s12">
                            <input disabled={!this.state.isEdit} value={this.state.service.outputLabel} onChange={this.handleChange} name="outputLabel" id="outputLabel" type="text" autoComplete="off"/>
                            <label htmlFor="outputLabel">Output label</label>
                        </div>
                        
                        <div className="input-field col s12">
                            <select disabled={!this.state.isEdit} value={this.state.service.serviceType} onChange={this.handleChange} name="serviceType" id="serviceType">
                                <option value="" disabled="disabled">Choose service type</option>
                                <option value='frontend'>frontend</option>
                                <option value='backend'>backend</option>
                                <option value='database'>database</option>
                                <option value='system'>system</option>
                            </select>
                            <label htmlFor="serviceType">Service type</label>
                        </div>
                        <div className="input-field col s12">
                            <input disabled={!this.state.isEdit} value={this.state.service.avgMem} onChange={this.handleChange} name="avgMem" id="avgMem" type="number" autoComplete="off"/>
                            <label htmlFor="avgMem">Average Memory (bytes)</label>
                        </div>
                        {this.renderButton()}
                    </form>                    
                </div>
            )
        
        return null
    }
    render() {
        if(this.state.isDeleted){
            return <Redirect to='/ui/services' />;
        }        
        return (
            <MainLayout title='Service config detail' breadcrumbs={this.state.breadcrumbs}>
                {this.renderServiceConfigForm()}
                {this.renderDependencies()}
            </MainLayout>            
        );
    }
}