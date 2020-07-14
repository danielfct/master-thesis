var $ = require('jquery');
const React = require('react');
const ReactDOM = require('react-dom');
const Component = React.Component;
const Redirect = require('react-router-dom').Redirect;
const Link = require('react-router-dom').Link;
import Utils from './utils';
import {MainLayout, CardItem} from './globalComponents';

export class SimulatedMetricsLandingPage extends Component {
    constructor(props) {
        super(props);
        var simulatedMetricsLinks = [
            {name: 'Service simulated metrics', link: '/ui/simulatedmetrics/services'}, 
            {name: 'Container simulated metrics', link: '/ui/simulatedmetrics/containers'},           
            {name: 'Default host simulated metrics', link: '/ui/simulatedmetrics/defaulthosts'},
            {name: 'Specific host simulated metrics', link: '/ui/simulatedmetrics/specifichosts'}
        ];
        this.state = { links: simulatedMetricsLinks, loading: false };
        this.renderLinks = this.renderLinks.bind(this);
    }
    renderLinks() {
        var links;
        links = this.state.links.map(function (link) {
            return (
                <li key={link.name} className="collection-item">
                    <div>{link.name}
                        <Link className="secondary-content" to={link.link}>
                            <i className="material-icons">keyboard_arrow_right</i>
                        </Link>
                    </div>
                </li>
            );
        });
        return links;        
    }
    render() {
        return (
            <MainLayout title='Simulated metrics Management'>
                <div className="row">
                    <div className="col s12">
                        <ul className="collection">
                            {this.renderLinks()}
                        </ul>
                    </div>
                </div>
            </MainLayout>            
        );
    }
}

class ServiceSimulatedMetricsCard extends Component {
    constructor(props) {
        super(props);
        this.onClickRemove = this.onClickRemove.bind(this);
    }
    onClickRemove() {
        var action = '/api/simulatedmetrics/services/' + this.props.simulatedMetric.id;       
        var self = this;
        Utils.formSubmit(action, 'DELETE', {}, function (data) {
            M.toast({html: "<div>Service simulated metric removed successfully!</div>"});
            self.props.reloadSimulatedMetrics();
        });
    }
    render() {
        var style = {marginLeft: '10px'};
        var override = '' + this.props.simulatedMetric.override;
        return (
            <div className='row'>
                <div className='col s12'>
                    <div className='card'>
                        <div className='card-content'>
                            <div className="right-align">                                
                                <div className="row">
                                    <div className="col s12">
                                        <Link className="waves-effect waves-light btn-small" to={'/ui/simulatedmetrics/services/detail/' + this.props.simulatedMetric.id}>Edit</Link>
                                        <button style={style} className="waves-effect waves-light btn-small red darken-4" onClick={this.onClickRemove}>Remove</button>
                                    </div>
                                </div>
                            </div>
                            <CardItem label='Service' value={this.props.simulatedMetric.serviceName}/>
                            <CardItem label='Field' value={this.props.simulatedMetric.field}/>
                            <CardItem label='Minimum value' value={this.props.simulatedMetric.minValue}/>
                            <CardItem label='Maximum value' value={this.props.simulatedMetric.maxValue}/>
                            <CardItem label='Override' value={override}/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export class ServiceSimulatedMetrics extends Component {
    constructor(props) {
        super(props);
        this.state = { data: [], loading: false, showAdd: true };
        this.loadSimulatedMetrics = this.loadSimulatedMetrics.bind(this);
        this.renderSimulatedMetrics = this.renderSimulatedMetrics.bind(this);
    }
    loadSimulatedMetrics() {
        this.setState({ loading: true });
        var self = this;
        Utils.ajaxGet('/api/simulatedmetrics/services',           
            function (data) {
                var simulatedmetrics = data;                
                self.setState({data: simulatedmetrics, loading: false});
            });
    }
    componentDidMount() {
        this.loadSimulatedMetrics();
        var instances = M.Tooltip.init(document.querySelectorAll('.tooltipped'));
        this.setState({tooltipInstances: instances});
    }
    componentWillUnmount() {
        this.state.tooltipInstances[0].destroy();
    }
    renderSimulatedMetrics() {
        var simulatedMetricsNodes;
        var self = this;
        if (this.state.data) {
            simulatedMetricsNodes = this.state.data.map(function (simulatedMetric, index) {
                return (
                    <ServiceSimulatedMetricsCard key={simulatedMetric.id} simulatedMetric={simulatedMetric} reloadSimulatedMetrics={self.loadSimulatedMetrics}/>
                );
            });
        }
        return simulatedMetricsNodes;
    }
    render() {
        return (
            <MainLayout title='Service simulated metrics'>
                {this.renderSimulatedMetrics()}
                <div className="fixed-action-btn tooltipped" data-position="left" data-tooltip="Add service simulated metric">
                    <Link className="waves-effect waves-light btn-floating btn-large grey darken-4" to='/ui/simulatedmetrics/services/detail'>
                        <i className="large material-icons">add</i>
                    </Link>
                </div>
            </MainLayout>
        );
    }
}

export class ServiceSimulatedMetricsDetail extends Component {
    constructor(props) {
        super(props);
        var defaultId = 0;
        if(props.match.params.id){
            defaultId = props.match.params.id;
        }
        var defaultValues = {
            serviceName: '', field: '', minValue: '', maxValue: '', override: ''
        }
        var thisBreadcrumbs = [  ];    
        this.state = { id: defaultId, values: defaultValues, services: [], fields:[], loading: false, formSubmit: false, breadcrumbs: thisBreadcrumbs};
        this.loadServiceConfigs = this.loadServiceConfigs.bind(this);
        this.loadFields = this.loadFields.bind(this);
        this.loadServiceSimulatedMetrics = this.loadServiceSimulatedMetrics.bind(this);
        this.onSubmitForm = this.onSubmitForm.bind(this);
        this.renderServicesSelect = this.renderServicesSelect.bind(this);
        this.renderFieldsSelect = this.renderFieldsSelect.bind(this);
        this.onInputChange = this.onInputChange.bind(this);
        this.renderForm = this.renderForm.bind(this);
    }
    loadServiceConfigs(){
        this.setState({ loading: true });  
        var self = this;
        var url = '/api/services';
        Utils.ajaxGet(url, function(data){
            self.setState({services: data, loading: false});
        });
    }
    loadFields(){
        this.setState({ loading: true });  
        var self = this;
        var url = '/api/fields';
        Utils.ajaxGet(url, function(data){
            self.setState({fields: data, loading: false});
        });
    }
    loadServiceSimulatedMetrics() {
        if(this.state.id != 0) {
            this.setState({ loading: true });  
            var self = this;
            var url = '/api/simulatedmetrics/services/' + this.state.id;
            Utils.ajaxGet(url, function(data){               
                self.setState({values: data, loading: false});
            });
        }
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
    renderFieldsSelect(){
        var fieldsNodes;
        if (this.state.fields) {
            fieldsNodes = this.state.fields.map(function (field) {
                return (
                    <option key={field.id} value={field.fieldName}>{field.fieldName}</option>
                );
            });
            return fieldsNodes;
        }
    }   
    componentDidMount() {
        this.loadServiceConfigs();
        this.loadFields();
        this.loadServiceSimulatedMetrics();
    }
    componentDidUpdate(){
        M.updateTextFields();
        var elems = document.querySelectorAll('select');
        M.FormSelect.init(elems);
    }
    onSubmitForm(event){
        event.preventDefault();
        var formId = "form-service";
        var formAction = '/api/simulatedmetrics/services/' + this.state.id;
        var formMethod = 'POST';
        var formData = Utils.convertFormToJson(formId);     
        var self = this;
        Utils.formSubmit(formAction, formMethod, formData, function (data) {
            self.setState({isEdit: false, formSubmit: true});
            M.toast({html: "<div>Service simulated metric saved successfully!</div>"});
        });
    }
    onInputChange(event){        
        var name = event.target.name;
        var newValues = this.state.values;
        newValues[name] = event.target.value;
        this.setState({values: newValues});
    }
    renderForm(){
        var servicesSelect = this.renderServicesSelect();
        var fieldsSelect = this.renderFieldsSelect();
        return(
            <form id="form-service" onSubmit={this.onSubmitForm}>
                <div className="input-field col s12">
                    <select value={this.state.values.serviceName} onChange={this.onInputChange} name="serviceName" id="serviceName">
                        <option value="" disabled="disabled">Choose service</option>
                        {servicesSelect}
                    </select>
                    <label htmlFor="serviceName">Service</label>
                </div>
                <div className="input-field col s12">
                    <select value={this.state.values.field} onChange={this.onInputChange} name="field" id="field">
                        <option value="" disabled="disabled">Choose field</option>
                        {fieldsSelect}
                    </select>
                    <label htmlFor="field">Field</label>
                </div>
                <div className="input-field col s12">
                    <input value={this.state.values.minValue} onChange={this.onInputChange} type="number" name="minValue" id="minValue" autoComplete="off"></input>
                    <label htmlFor="minValue">Minimum value</label>
                </div>
                <div className="input-field col s12">
                    <input value={this.state.values.maxValue} onChange={this.onInputChange} type="number" name="maxValue" id="maxValue" autoComplete="off"></input>
                    <label htmlFor="maxValue">Maximum value</label>
                </div>
                <div className="input-field col s12">
                    <select value={this.state.values.override} onChange={this.onInputChange} name="override" id="override">
                        <option value="" disabled="disabled">Choose override</option>
                        <option value='true'>True</option>
                        <option value='false'>False</option>
                    </select>
                    <label htmlFor="override">Override</label>
                </div>
                
                <button className="btn waves-effect waves-light" type="submit" name="action">
                    Save
                    <i className="material-icons right">send</i>
                </button>
            </form>
        );
    }
    render() {
        if(this.state.formSubmit){
            return <Redirect to='/ui/simulatedmetrics/services' />;
        }
        return (
            <MainLayout title='Service simulated metric detail' breadcrumbs={this.state.breadcrumbs}>
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

class ContainerSimulatedMetricsCard extends Component {
    constructor(props) {
        super(props);
        this.onClickRemove = this.onClickRemove.bind(this);
    }
    onClickRemove() {
        var action = '/api/simulatedmetrics/containers/' + this.props.simulatedMetric.id;       
        var self = this;
        Utils.formSubmit(action, 'DELETE', {}, function (data) {
            M.toast({html: "<div>Container simulated metric removed successfully!</div>"});
            self.props.reloadSimulatedMetrics();
        });
    }
    render() {
        var style = {marginLeft: '10px'};
        var override = '' + this.props.simulatedMetric.override;
        return (
            <div className='row'>
                <div className='col s12'>
                    <div className='card'>
                        <div className='card-content'>
                            <div className="right-align">                                
                                <div className="row">
                                    <div className="col s12">
                                        <Link className="waves-effect waves-light btn-small" to={'/ui/simulatedmetrics/containers/detail/' + this.props.simulatedMetric.id}>Edit</Link>
                                        <button style={style} className="waves-effect waves-light btn-small red darken-4" onClick={this.onClickRemove}>Remove</button>
                                    </div>
                                </div>
                            </div>
                            <CardItem label='Container id' value={this.props.simulatedMetric.containerId}/>
                            <CardItem label='Field' value={this.props.simulatedMetric.field}/>
                            <CardItem label='Minimum value' value={this.props.simulatedMetric.minValue}/>
                            <CardItem label='Maximum value' value={this.props.simulatedMetric.maxValue}/>
                            <CardItem label='Override' value={override}/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export class ContainerSimulatedMetrics extends Component {
    constructor(props) {
        super(props);
        this.state = { data: [], loading: false, showAdd: true };
        this.loadSimulatedMetrics = this.loadSimulatedMetrics.bind(this);
        this.renderSimulatedMetrics = this.renderSimulatedMetrics.bind(this);
    }
    loadSimulatedMetrics() {
        this.setState({ loading: true });
        var self = this;
        Utils.ajaxGet('/api/simulatedmetrics/containers',           
            function (data) {
                var simulatedmetrics = data;                
                self.setState({data: simulatedmetrics, loading: false});
            });
    }
    componentDidMount() {
        this.loadSimulatedMetrics();
        var instances = M.Tooltip.init(document.querySelectorAll('.tooltipped'));
        this.setState({tooltipInstances: instances});
    }
    componentWillUnmount() {
        this.state.tooltipInstances[0].destroy();
    }
    renderSimulatedMetrics() {
        var simulatedMetricsNodes;
        var self = this;
        if (this.state.data) {
            simulatedMetricsNodes = this.state.data.map(function (simulatedMetric, index) {
                return (
                    <ContainerSimulatedMetricsCard key={simulatedMetric.id} simulatedMetric={simulatedMetric} reloadSimulatedMetrics={self.loadSimulatedMetrics}/>
                );
            });
        }
        return simulatedMetricsNodes;
    }
    render() {
        return (
            <MainLayout title='Container simulated metrics'>
                {this.renderSimulatedMetrics()}
                <div className="fixed-action-btn tooltipped" data-position="left" data-tooltip="Add container simulated metric">
                    <Link className="waves-effect waves-light btn-floating btn-large grey darken-4" to='/ui/simulatedmetrics/containers/detail'>
                        <i className="large material-icons">add</i>
                    </Link>
                </div>
            </MainLayout>
        );
    }
}

export class ContainerSimulatedMetricsDetail extends Component {
    constructor(props) {
        super(props);
        var defaultId = 0;
        if(props.match.params.id){
            defaultId = props.match.params.id;
        }
        var defaultValues = {
            containerId: '', field: '', minValue: '', maxValue: '', override: ''
        }
        var thisBreadcrumbs = [  ];    
        this.state = { id: defaultId, values: defaultValues, containers: [], fields:[], loading: false, formSubmit: false, breadcrumbs: thisBreadcrumbs};
        this.loadContainers = this.loadContainers.bind(this);
        this.loadFields = this.loadFields.bind(this);
        this.loadContainerSimulatedMetrics = this.loadContainerSimulatedMetrics.bind(this);
        this.onSubmitForm = this.onSubmitForm.bind(this);
        this.renderContainersSelect = this.renderContainersSelect.bind(this);
        this.renderFieldsSelect = this.renderFieldsSelect.bind(this);
        this.onInputChange = this.onInputChange.bind(this);
        this.renderForm = this.renderForm.bind(this);
    }
    loadContainers(){
        this.setState({ loading: true });  
        var self = this;
        var url = '/api/containers';
        Utils.ajaxGet(url, function(data){
            self.setState({containers: data, loading: false});
        });
    }
    loadFields(){
        this.setState({ loading: true });  
        var self = this;
        var url = '/api/fields';
        Utils.ajaxGet(url, function(data){
            self.setState({fields: data, loading: false});
        });
    }
    loadContainerSimulatedMetrics() {
        if(this.state.id != 0) {
            this.setState({ loading: true });  
            var self = this;
            var url = '/api/simulatedmetrics/containers/' + this.state.id;
            Utils.ajaxGet(url, function(data){               
                self.setState({values: data, loading: false});
            });
        }
    }
    renderContainersSelect(){
        var containersNodes;
        if (this.state.containers) {
            containersNodes = this.state.containers.map(function (container) {
                return (
                    <option key={container.id} value={container.id}>{container.names[0]}</option>
                );
            });
            return containersNodes;
        }
    }
    renderFieldsSelect(){
        var fieldsNodes;
        if (this.state.fields) {
            fieldsNodes = this.state.fields.map(function (field) {
                return (
                    <option key={field.id} value={field.fieldName}>{field.fieldName}</option>
                );
            });
            return fieldsNodes;
        }
    }   
    componentDidMount() {
        this.loadContainers();
        this.loadFields();
        this.loadContainerSimulatedMetrics();
    }
    componentDidUpdate(){
        M.updateTextFields();
        var elems = document.querySelectorAll('select');
        M.FormSelect.init(elems);
    }
    onSubmitForm(event){
        event.preventDefault();
        var formId = "form-service";
        var formAction = '/api/simulatedmetrics/containers/' + this.state.id;
        var formMethod = 'POST';
        var formData = Utils.convertFormToJson(formId);     
        var self = this;
        Utils.formSubmit(formAction, formMethod, formData, function (data) {
            self.setState({isEdit: false, formSubmit: true});
            M.toast({html: "<div>Container simulated metric saved successfully!</div>"});
        });
    }
    onInputChange(event){        
        var name = event.target.name;
        var newValues = this.state.values;
        newValues[name] = event.target.value;
        this.setState({values: newValues});
    }
    renderForm(){
        var containersSelect = this.renderContainersSelect();
        var fieldsSelect = this.renderFieldsSelect();
        return(
            <form id="form-service" onSubmit={this.onSubmitForm}>
                <div className="input-field col s12">
                    <select value={this.state.values.containerId} onChange={this.onInputChange} name="containerId" id="containerId">
                        <option value="" disabled="disabled">Choose container</option>
                        {containersSelect}
                    </select>
                    <label htmlFor="containerId">Container</label>
                </div>
                <div className="input-field col s12">
                    <select value={this.state.values.field} onChange={this.onInputChange} name="field" id="field">
                        <option value="" disabled="disabled">Choose field</option>
                        {fieldsSelect}
                    </select>
                    <label htmlFor="field">Field</label>
                </div>
                <div className="input-field col s12">
                    <input value={this.state.values.minValue} onChange={this.onInputChange} type="number" name="minValue" id="minValue" autoComplete="off"></input>
                    <label htmlFor="minValue">Minimum value</label>
                </div>
                <div className="input-field col s12">
                    <input value={this.state.values.maxValue} onChange={this.onInputChange} type="number" name="maxValue" id="maxValue" autoComplete="off"></input>
                    <label htmlFor="maxValue">Maximum value</label>
                </div>
                <div className="input-field col s12">
                    <select value={this.state.values.override} onChange={this.onInputChange} name="override" id="override">
                        <option value="" disabled="disabled">Choose override</option>
                        <option value='true'>True</option>
                        <option value='false'>False</option>
                    </select>
                    <label htmlFor="override">Override</label>
                </div>
                
                <button className="btn waves-effect waves-light" type="submit" name="action">
                    Save
                    <i className="material-icons right">send</i>
                </button>
            </form>
        );
    }
    render() {
        if(this.state.formSubmit){
            return <Redirect to='/ui/simulatedmetrics/containers' />;
        }
        return (
            <MainLayout title='Container simulated metric detail' breadcrumbs={this.state.breadcrumbs}>
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

class DefaultHostSimulatedMetricsCard extends Component {
    constructor(props) {
        super(props);
        this.onClickRemove = this.onClickRemove.bind(this);
    }
    onClickRemove() {
        var action = '/api/simulatedmetrics/defaulthosts/' + this.props.simulatedMetric.id;       
        var self = this;
        Utils.formSubmit(action, 'DELETE', {}, function (data) {
            M.toast({html: "<div>Default host simulated metric removed successfully!</div>"});
            self.props.reloadSimulatedMetrics();
        });
    }
    render() {
        var style = {marginLeft: '10px'};
        var override = '' + this.props.simulatedMetric.override;
        return (
            <div className='row'>
                <div className='col s12'>
                    <div className='card'>
                        <div className='card-content'>
                            <div className="right-align">                                
                                <div className="row">
                                    <div className="col s12">
                                        <Link className="waves-effect waves-light btn-small" to={'/ui/simulatedmetrics/defaulthosts/detail/' + this.props.simulatedMetric.id}>Edit</Link>
                                        <button style={style} className="waves-effect waves-light btn-small red darken-4" onClick={this.onClickRemove}>Remove</button>
                                    </div>
                                </div>
                            </div>
                            <CardItem label='Field' value={this.props.simulatedMetric.field}/>
                            <CardItem label='Minimum value' value={this.props.simulatedMetric.minValue}/>
                            <CardItem label='Maximum value' value={this.props.simulatedMetric.maxValue}/>
                            <CardItem label='Override' value={override}/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export class DefaultHostSimulatedMetrics extends Component {
    constructor(props) {
        super(props);
        this.state = { data: [], loading: false, showAdd: true };
        this.loadSimulatedMetrics = this.loadSimulatedMetrics.bind(this);
        this.renderSimulatedMetrics = this.renderSimulatedMetrics.bind(this);
    }
    loadSimulatedMetrics() {
        this.setState({ loading: true });
        var self = this;
        Utils.ajaxGet('/api/simulatedmetrics/defaulthosts',           
            function (data) {
                var simulatedmetrics = data;                
                self.setState({data: simulatedmetrics, loading: false});
            });
    }
    componentDidMount() {
        this.loadSimulatedMetrics();
        var instances = M.Tooltip.init(document.querySelectorAll('.tooltipped'));
        this.setState({tooltipInstances: instances});
    }
    componentWillUnmount() {
        this.state.tooltipInstances[0].destroy();
    }
    renderSimulatedMetrics() {
        var simulatedMetricsNodes;
        var self = this;
        if (this.state.data) {
            simulatedMetricsNodes = this.state.data.map(function (simulatedMetric, index) {
                return (
                    <DefaultHostSimulatedMetricsCard key={simulatedMetric.id} simulatedMetric={simulatedMetric} reloadSimulatedMetrics={self.loadSimulatedMetrics}/>
                );
            });
        }
        return simulatedMetricsNodes;
    }
    render() {
        return (
            <MainLayout title='Default host simulated metrics'>
                {this.renderSimulatedMetrics()}
                <div className="fixed-action-btn tooltipped" data-position="left" data-tooltip="Add default host simulated metric">
                    <Link className="waves-effect waves-light btn-floating btn-large grey darken-4" to='/ui/simulatedmetrics/defaulthosts/detail'>
                        <i className="large material-icons">add</i>
                    </Link>
                </div>
            </MainLayout>
        );
    }
}

export class DefaultHostSimulatedMetricsDetail extends Component {
    constructor(props) {
        super(props);
        var defaultId = 0;
        if(props.match.params.id){
            defaultId = props.match.params.id;
        }
        var defaultValues = {
            field: '', minValue: '', maxValue: '', override: ''
        }
        var thisBreadcrumbs = [  ];    
        this.state = { id: defaultId, values: defaultValues, fields:[], loading: false, formSubmit: false, breadcrumbs: thisBreadcrumbs};
        this.loadFields = this.loadFields.bind(this);
        this.loadDefaultHostSimulatedMetrics = this.loadDefaultHostSimulatedMetrics.bind(this);
        this.onSubmitForm = this.onSubmitForm.bind(this);
        this.renderFieldsSelect = this.renderFieldsSelect.bind(this);
        this.onInputChange = this.onInputChange.bind(this);
        this.renderForm = this.renderForm.bind(this);
    }
    loadFields(){
        this.setState({ loading: true });  
        var self = this;
        var url = '/api/fields';
        Utils.ajaxGet(url, function(data){
            self.setState({fields: data, loading: false});
        });
    }
    loadDefaultHostSimulatedMetrics() {
        if(this.state.id != 0) {
            this.setState({ loading: true });  
            var self = this;
            var url = '/api/simulatedmetrics/defaulthosts/' + this.state.id;
            Utils.ajaxGet(url, function(data){               
                self.setState({values: data, loading: false});
            });
        }
    }
    renderFieldsSelect(){
        var fieldsNodes;
        if (this.state.fields) {
            fieldsNodes = this.state.fields.map(function (field) {
                return (
                    <option key={field.id} value={field.fieldName}>{field.fieldName}</option>
                );
            });
            return fieldsNodes;
        }
    }   
    componentDidMount() {
        this.loadFields();
        this.loadDefaultHostSimulatedMetrics();
    }
    componentDidUpdate(){
        M.updateTextFields();
        var elems = document.querySelectorAll('select');
        M.FormSelect.init(elems);
    }
    onSubmitForm(event){
        event.preventDefault();
        var formId = "form-service";
        var formAction = '/api/simulatedmetrics/defaulthosts/' + this.state.id;
        var formMethod = 'POST';
        var formData = Utils.convertFormToJson(formId);     
        var self = this;
        Utils.formSubmit(formAction, formMethod, formData, function (data) {
            self.setState({isEdit: false, formSubmit: true});
            M.toast({html: "<div>Default host simulated metric saved successfully!</div>"});
        });
    }
    onInputChange(event){        
        var name = event.target.name;
        var newValues = this.state.values;
        newValues[name] = event.target.value;
        this.setState({values: newValues});
    }
    renderForm(){
        var fieldsSelect = this.renderFieldsSelect();
        return(
            <form id="form-service" onSubmit={this.onSubmitForm}>                
                <div className="input-field col s12">
                    <select value={this.state.values.field} onChange={this.onInputChange} name="field" id="field">
                        <option value="" disabled="disabled">Choose field</option>
                        {fieldsSelect}
                    </select>
                    <label htmlFor="field">Field</label>
                </div>
                <div className="input-field col s12">
                    <input value={this.state.values.minValue} onChange={this.onInputChange} type="number" name="minValue" id="minValue" autoComplete="off"></input>
                    <label htmlFor="minValue">Minimum value</label>
                </div>
                <div className="input-field col s12">
                    <input value={this.state.values.maxValue} onChange={this.onInputChange} type="number" name="maxValue" id="maxValue" autoComplete="off"></input>
                    <label htmlFor="maxValue">Maximum value</label>
                </div>
                <div className="input-field col s12">
                    <select value={this.state.values.override} onChange={this.onInputChange} name="override" id="override">
                        <option value="" disabled="disabled">Choose override</option>
                        <option value='true'>True</option>
                        <option value='false'>False</option>
                    </select>
                    <label htmlFor="override">Override</label>
                </div>
                
                <button className="btn waves-effect waves-light" type="submit" name="action">
                    Save
                    <i className="material-icons right">send</i>
                </button>
            </form>
        );
    }
    render() {
        if(this.state.formSubmit){
            return <Redirect to='/ui/simulatedmetrics/defaulthosts' />;
        }
        return (
            <MainLayout title='Default host simulated metric detail' breadcrumbs={this.state.breadcrumbs}>
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

class SpecificHostSimulatedMetricsCard extends Component {
    constructor(props) {
        super(props);
        this.onClickRemove = this.onClickRemove.bind(this);
    }
    onClickRemove() {
        var action = '/api/simulatedmetrics/specifichosts/' + this.props.simulatedMetric.id;       
        var self = this;
        Utils.formSubmit(action, 'DELETE', {}, function (data) {
            M.toast({html: "<div>Specific host simulated metric removed successfully!</div>"});
            self.props.reloadSimulatedMetrics();
        });
    }
    render() {
        var style = {marginLeft: '10px'};
        var override = '' + this.props.simulatedMetric.override;
        return (
            <div className='row'>
                <div className='col s12'>
                    <div className='card'>
                        <div className='card-content'>
                            <div className="right-align">                                
                                <div className="row">
                                    <div className="col s12">
                                        <Link className="waves-effect waves-light btn-small" to={'/ui/simulatedmetrics/specifichosts/detail/' + this.props.simulatedMetric.id}>Edit</Link>
                                        <button style={style} className="waves-effect waves-light btn-small red darken-4" onClick={this.onClickRemove}>Remove</button>
                                    </div>
                                </div>
                            </div>
                            <CardItem label='Hostname' value={this.props.simulatedMetric.hostname}/>
                            <CardItem label='Field' value={this.props.simulatedMetric.field}/>
                            <CardItem label='Minimum value' value={this.props.simulatedMetric.minValue}/>
                            <CardItem label='Maximum value' value={this.props.simulatedMetric.maxValue}/>
                            <CardItem label='Override' value={override}/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export class SpecificHostSimulatedMetrics extends Component {
    constructor(props) {
        super(props);
        this.state = { data: [], loading: false, showAdd: true };
        this.loadSimulatedMetrics = this.loadSimulatedMetrics.bind(this);
        this.renderSimulatedMetrics = this.renderSimulatedMetrics.bind(this);
    }
    loadSimulatedMetrics() {
        this.setState({ loading: true });
        var self = this;
        Utils.ajaxGet('/api/simulatedmetrics/specifichosts',           
            function (data) {
                var simulatedmetrics = data;                
                self.setState({data: simulatedmetrics, loading: false});
            });
    }
    componentDidMount() {
        this.loadSimulatedMetrics();
        var instances = M.Tooltip.init(document.querySelectorAll('.tooltipped'));
        this.setState({tooltipInstances: instances});
    }
    componentWillUnmount() {
        this.state.tooltipInstances[0].destroy();
    }
    renderSimulatedMetrics() {
        var simulatedMetricsNodes;
        var self = this;
        if (this.state.data) {
            simulatedMetricsNodes = this.state.data.map(function (simulatedMetric, index) {
                return (
                    <SpecificHostSimulatedMetricsCard key={simulatedMetric.id} simulatedMetric={simulatedMetric} reloadSimulatedMetrics={self.loadSimulatedMetrics}/>
                );
            });
        }
        return simulatedMetricsNodes;
    }
    render() {
        return (
            <MainLayout title='Specific host simulated metrics'>
                {this.renderSimulatedMetrics()}
                <div className="fixed-action-btn tooltipped" data-position="left" data-tooltip="Add specific host simulated metric">
                    <Link className="waves-effect waves-light btn-floating btn-large grey darken-4" to='/ui/simulatedmetrics/specifichosts/detail'>
                        <i className="large material-icons">add</i>
                    </Link>
                </div>
            </MainLayout>
        );
    }
}

export class SpecificHostSimulatedMetricsDetail extends Component {
    constructor(props) {
        super(props);
        var defaultId = 0;
        if(props.match.params.id){
            defaultId = props.match.params.id;
        }
        var defaultValues = {
            hostname: '', field: '', minValue: '', maxValue: '', override: ''
        }
        var thisBreadcrumbs = [  ];    
        this.state = { id: defaultId, values: defaultValues, nodes: [], fields:[], loading: false, formSubmit: false, breadcrumbs: thisBreadcrumbs};
        this.loadNodes = this.loadNodes.bind(this);
        this.loadSpecificHostSimulatedMetrics = this.loadSpecificHostSimulatedMetrics.bind(this);
        this.onSubmitForm = this.onSubmitForm.bind(this);
        this.renderNodesSelect = this.renderNodesSelect.bind(this);
        this.renderFieldsSelect = this.renderFieldsSelect.bind(this);
        this.onInputChange = this.onInputChange.bind(this);
        this.renderForm = this.renderForm.bind(this);
    }
    loadNodes(){
        this.setState({ loading: true });  
        var self = this;
        var url = '/api/nodes';
        Utils.ajaxGet(url, function(data){
            self.setState({nodes: data, loading: false});
        });
    }
    loadFields(){
        this.setState({ loading: true });  
        var self = this;
        var url = '/api/fields';
        Utils.ajaxGet(url, function(data){
            self.setState({fields: data, loading: false});
        });
    }
    loadSpecificHostSimulatedMetrics() {
        if(this.state.id != 0) {
            this.setState({ loading: true });  
            var self = this;
            var url = '/api/simulatedmetrics/specifichosts/' + this.state.id;
            Utils.ajaxGet(url, function(data){               
                self.setState({values: data, loading: false});
            });
        }
    }
    renderNodesSelect(){
        var nodes;
        if (this.state.nodes) {
            nodes = this.state.nodes.map(function (node) {
                return (
                    <option key={node.hostname} value={node.hostname}>{node.hostname}</option>
                );
            });
            return nodes;
        }
    }
    renderFieldsSelect(){
        var fieldsNodes;
        if (this.state.fields) {
            fieldsNodes = this.state.fields.map(function (field) {
                return (
                    <option key={field.id} value={field.fieldName}>{field.fieldName}</option>
                );
            });
            return fieldsNodes;
        }
    }   
    componentDidMount() {
        this.loadNodes();
        this.loadFields();
        this.loadSpecificHostSimulatedMetrics();
    }
    componentDidUpdate(){
        M.updateTextFields();
        var elems = document.querySelectorAll('select');
        M.FormSelect.init(elems);
    }
    onSubmitForm(event){
        event.preventDefault();
        var formId = "form-service";
        var formAction = '/api/simulatedmetrics/specifichosts/' + this.state.id;
        var formMethod = 'POST';
        var formData = Utils.convertFormToJson(formId);     
        var self = this;
        Utils.formSubmit(formAction, formMethod, formData, function (data) {
            self.setState({isEdit: false, formSubmit: true});
            M.toast({html: "<div>Specific host simulated metric saved successfully!</div>"});
        });
    }
    onInputChange(event){        
        var name = event.target.name;
        var newValues = this.state.values;
        newValues[name] = event.target.value;
        this.setState({values: newValues});
    }
    renderForm(){
        var nodesSelect = this.renderNodesSelect();
        var fieldsSelect = this.renderFieldsSelect();
        return(
            <form id="form-service" onSubmit={this.onSubmitForm}>
                <div className="input-field col s12">
                    <select value={this.state.values.hostname} onChange={this.onInputChange} name="hostname" id="hostname">
                        <option value="" disabled="disabled">Choose host</option>
                        {nodesSelect}
                    </select>
                    <label htmlFor="hostname">Hostname</label>
                </div>
                <div className="input-field col s12">
                    <select value={this.state.values.field} onChange={this.onInputChange} name="field" id="field">
                        <option value="" disabled="disabled">Choose field</option>
                        {fieldsSelect}
                    </select>
                    <label htmlFor="field">Field</label>
                </div>
                <div className="input-field col s12">
                    <input value={this.state.values.minValue} onChange={this.onInputChange} type="number" name="minValue" id="minValue" autoComplete="off"></input>
                    <label htmlFor="minValue">Minimum value</label>
                </div>
                <div className="input-field col s12">
                    <input value={this.state.values.maxValue} onChange={this.onInputChange} type="number" name="maxValue" id="maxValue" autoComplete="off"></input>
                    <label htmlFor="maxValue">Maximum value</label>
                </div>
                <div className="input-field col s12">
                    <select value={this.state.values.override} onChange={this.onInputChange} name="override" id="override">
                        <option value="" disabled="disabled">Choose override</option>
                        <option value='true'>True</option>
                        <option value='false'>False</option>
                    </select>
                    <label htmlFor="override">Override</label>
                </div>
                
                <button className="btn waves-effect waves-light" type="submit" name="action">
                    Save
                    <i className="material-icons right">send</i>
                </button>
            </form>
        );
    }
    render() {
        if(this.state.formSubmit){
            return <Redirect to='/ui/simulatedmetrics/specifichosts' />;
        }
        return (
            <MainLayout title='Specific host simulated metric detail' breadcrumbs={this.state.breadcrumbs}>
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