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
let Component = React.Component;
let Redirect = require('react-router-dom').Redirect;
let Link = require('react-router-dom').Link;
import Utils from './utils';
import {CardItem, MainLayout} from './globalComponents';

export class SimulatedMetricsLandingPage extends Component {

    constructor(props) {
        super(props);
        let simulatedMetricsLinks = [
            {name: 'Service simulated metrics', link: '/ui/simulatedMetrics/services'},
            {name: 'Container simulated metrics', link: '/ui/simulatedMetrics/containers'},
            {name: 'Default host simulated metrics', link: '/ui/simulatedMetrics/defaultHosts'},
            {name: 'Specific host simulated metrics', link: '/ui/simulatedMetrics/specificHosts'}
        ];
        this.state = {links: simulatedMetricsLinks, loading: false};
    }

    renderLinks = () => {
        return this.state.links.map(function (link) {
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
    };

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
    }

    onClickRemove = () => {
        let action = '/simulatedMetrics/services/' + this.props.simulatedMetric.id;
        let self = this;
        Utils.formSubmit(action, 'DELETE', {}, function (data) {
            M.toast({html: "<div>Service simulated metric removed successfully!</div>"});
            self.props.reloadSimulatedMetrics();
        });
    };

    render() {
        let style = {marginLeft: '10px'};
        let override = '' + this.props.simulatedMetric.override;
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
        this.state = {data: [], loading: false, showAdd: true};
    }

    componentDidMount() {
        this.loadSimulatedMetrics();
        let instances = M.Tooltip.init(document.querySelectorAll('.tooltipped'));
        this.setState({tooltipInstances: instances});
    }
    componentWillUnmount() {
        this.state.tooltipInstances[0].destroy();
    }

    loadSimulatedMetrics = () => {
        this.setState({ loading: true });
        let self = this;
        Utils.ajaxGet('/simulatedMetrics/services',
            function (data) {
                self.setState({data: data, loading: false});

            });
    };

    renderSimulatedMetrics = () => {
        let simulatedMetricsNodes;
        let self = this;
        if (this.state.data) {
            simulatedMetricsNodes = this.state.data.map(function (simulatedMetric, index) {
                return (
                    <ServiceSimulatedMetricsCard key={simulatedMetric.id} simulatedMetric={simulatedMetric} reloadSimulatedMetrics={self.loadSimulatedMetrics}/>
                );
            });
        }
        return simulatedMetricsNodes;
    };

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
        let defaultId = 0;
        if(props.match.params.id){
            defaultId = props.match.params.id;
        }
        let defaultValues = {
            serviceName: '', field: '', minValue: '', maxValue: '', override: ''
        };
        let thisBreadcrumbs = [  ];
        this.state = { id: defaultId, values: defaultValues, services: [], fields:[], loading: false, formSubmit: false,
            breadcrumbs: thisBreadcrumbs};
    }

    componentDidMount() {
        this.loadServices();
        this.loadFields();
        this.loadServiceSimulatedMetrics();
    }
    componentDidUpdate() {
        M.updateTextFields();
        var elems = document.querySelectorAll('select');
        M.FormSelect.init(elems);
    }

    loadServices = () => {
        this.setState({ loading: true });  
        let self = this;
        let url = '/services';
        Utils.ajaxGet(url, function(data){
            self.setState({services: data, loading: false});
        });
    };

    loadFields = () => {
        this.setState({ loading: true });
        let self = this;
        let url = '/rules/fields';
        Utils.ajaxGet(url, function(data){
            self.setState({fields: data, loading: false});
        });
    };

    loadServiceSimulatedMetrics = () => {
        if (this.state.id !== 0) {
            this.setState({ loading: true });
            let self = this;
            let url = '/simulatedMetrics/services/' + this.state.id;
            Utils.ajaxGet(url, function(data){               
                self.setState({values: data, loading: false});
            });
        }
    };

    renderServicesSelect = () => {
        let servicesNodes;
        if (this.state.services) {
            servicesNodes = pt.unl.fct.microserviceManagement.managerMaster.entities.service.map(function (service) {
                return (
                    <option key={service.id} value={service.serviceName}>{service.serviceName}</option>
                );
            });
            return servicesNodes;
        }
    };

    renderFieldsSelect = () => {
        let fieldsNodes;
        if (this.state.fields) {
            fieldsNodes = this.state.fields.map(function (field) {
                return (
                    <option key={field.id} value={field.fieldName}>{field.fieldName}</option>
                );
            });
            return fieldsNodes;
        }
    };

    onSubmitForm = (event) => {
        event.preventDefault();
        let formId = "form-service";
        let formAction = '/simulatedMetrics/services/' + this.state.id;
        let formData = Utils.convertFormToJson(formId);
        let self = this;
        Utils.formSubmit(formAction, 'POST', formData, function (data) {
            self.setState({isEdit: false, formSubmit: true});
            M.toast({html: "<div>Service simulated metric saved successfully!</div>"});
        });
    };

    onInputChange = (event) => {
        let name = event.target.name;
        let newValues = this.state.values;
        newValues[name] = event.target.value;
        this.setState({values: newValues});
    };

    renderForm = () => {
        let servicesSelect = this.renderServicesSelect();
        let fieldsSelect = this.renderFieldsSelect();
        return (
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
                    <input value={this.state.values.minValue} onChange={this.onInputChange} type="number" name="minValue" id="minValue" autoComplete="off"/>
                    <label htmlFor="minValue">Minimum value</label>
                </div>
                <div className="input-field col s12">
                    <input value={this.state.values.maxValue} onChange={this.onInputChange} type="number" name="maxValue" id="maxValue" autoComplete="off"/>
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
    };

    render() {
        if (this.state.formSubmit) {
            return <Redirect to='/ui/simulatedMetrics/services' />;
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
    }

    onClickRemove = () => {
        let action = '/simulatedMetrics/containers/' + this.props.simulatedMetric.id;
        let self = this;
        Utils.formSubmit(action, 'DELETE', {}, function (data) {
            M.toast({html: "<div>Container simulated metric removed successfully!</div>"});
            self.props.reloadSimulatedMetrics();
        });
    };

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
    }

    componentDidMount() {
        this.loadSimulatedMetrics();
        let instances = M.Tooltip.init(document.querySelectorAll('.tooltipped'));
        this.setState({tooltipInstances: instances});
    }
    componentWillUnmount() {
        this.state.tooltipInstances[0].destroy();
    }

    loadSimulatedMetrics = () => {
        this.setState({ loading: true });
        let self = this;
        Utils.ajaxGet('/simulatedMetrics/containers',
            function (data) {
                self.setState({data: data, loading: false});
            });
    };

    renderSimulatedMetrics = () => {
        let simulatedMetricsNodes;
        let self = this;
        if (this.state.data) {
            simulatedMetricsNodes = this.state.data.map(function (simulatedMetric, index) {
                return (
                    <ContainerSimulatedMetricsCard key={simulatedMetric.id} simulatedMetric={simulatedMetric} reloadSimulatedMetrics={self.loadSimulatedMetrics}/>
                );
            });
        }
        return simulatedMetricsNodes;
    };

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
        let defaultId = 0;
        if (props.match.params.id) {
            defaultId = props.match.params.id;
        }
        let defaultValues = {
            containerId: '', field: '', minValue: '', maxValue: '', override: ''
        };
        let thisBreadcrumbs = [  ];
        this.state = { id: defaultId, values: defaultValues, containers: [], fields:[], loading: false, formSubmit: false, breadcrumbs: thisBreadcrumbs};
    }

    componentDidMount() {
        this.loadContainers();
        this.loadFields();
        this.loadContainerSimulatedMetrics();
    }

    componentDidUpdate(){
        M.updateTextFields();
        let elems = document.querySelectorAll('select');
        M.FormSelect.init(elems);
    }

    loadContainers = () => {
        this.setState({loading: true});
        let self = this;
        let url = '/containers';
        Utils.ajaxGet(url, function(data) {
            self.setState({containers: data, loading: false});
        });
    };

    loadFields = () => {
        this.setState({loading: true});
        let self = this;
        let url = '/rules/fields';
        Utils.ajaxGet(url, function(data){
            self.setState({fields: data, loading: false});
        });
    };

    loadContainerSimulatedMetrics = () => {
        if (this.state.id !== 0) {
            this.setState({loading: true});
            let self = this;
            let url = '/simulatedMetrics/containers/' + this.state.id;
            Utils.ajaxGet(url, function(data){               
                self.setState({values: data, loading: false});
            });
        }
    };

    renderContainersSelect = () => {
        let containersNodes;
        if (this.state.containers) {
            containersNodes = this.state.containers.map(function (container) {
                return (
                    <option key={container.id} value={container.id}>{container.names[0]}</option>
                );
            });
            return containersNodes;
        }
    };

    renderFieldsSelect = () => {
        let fieldsNodes;
        if (this.state.fields) {
            fieldsNodes = this.state.fields.map(function (field) {
                return (
                    <option key={field.id} value={field.fieldName}>{field.fieldName}</option>
                );
            });
            return fieldsNodes;
        }
    };

    onSubmitForm = (event) => {
        event.preventDefault();
        let formId = "form-service";
        let formAction = '/simulatedMetrics/containers/' + this.state.id;
        let formData = Utils.convertFormToJson(formId);
        let self = this;
        Utils.formSubmit(formAction, 'POST', formData, function (data) {
            self.setState({isEdit: false, formSubmit: true});
            M.toast({html: "<div>Container simulated metric saved successfully!</div>"});
        });
    };

    onInputChange = (event) => {
        let name = event.target.name;
        let newValues = this.state.values;
        newValues[name] = event.target.value;
        this.setState({values: newValues});
    };

    renderForm = () => {
        let containersSelect = this.renderContainersSelect();
        let fieldsSelect = this.renderFieldsSelect();
        return (
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
                    <input value={this.state.values.minValue} onChange={this.onInputChange} type="number" name="minValue" id="minValue" autoComplete="off"/>
                    <label htmlFor="minValue">Minimum value</label>
                </div>
                <div className="input-field col s12">
                    <input value={this.state.values.maxValue} onChange={this.onInputChange} type="number" name="maxValue" id="maxValue" autoComplete="off"/>
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
    };

    render() {
        if (this.state.formSubmit) {
            return <Redirect to='/ui/simulatedMetrics/containers' />;
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
    }

    onClickRemove = () => {
        let action = '/simulatedMetrics/defaultHosts/' + this.props.simulatedMetric.id; //TODO confirm
        let self = this;
        Utils.formSubmit(action, 'DELETE', {}, function (data) {
            M.toast({html: "<div>Default host simulated metric removed successfully!</div>"});
            self.props.reloadSimulatedMetrics();
        });
    };

    render() {
        let style = {marginLeft: '10px'};
        let override = '' + this.props.simulatedMetric.override;
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
        this.state = {data: [], loading: false, showAdd: true};
    }

    componentDidMount() {
        this.loadSimulatedMetrics();
        let instances = M.Tooltip.init(document.querySelectorAll('.tooltipped'));
        this.setState({tooltipInstances: instances});
    }
    componentWillUnmount() {
        this.state.tooltipInstances[0].destroy();
    }

    loadSimulatedMetrics = () => {
        this.setState({ loading: true });
        let self = this;
        Utils.ajaxGet('/simulatedMetrics/defaultHosts',
            function (data) {
                self.setState({data: data, loading: false});
            });
    };


    renderSimulatedMetrics = () => {
        let simulatedMetricsNodes;
        let self = this;
        if (this.state.data) {
            simulatedMetricsNodes = this.state.data.map(function (simulatedMetric, index) {
                return (
                    <DefaultHostSimulatedMetricsCard key={simulatedMetric.id} simulatedMetric={simulatedMetric} reloadSimulatedMetrics={self.loadSimulatedMetrics}/>
                );
            });
        }
        return simulatedMetricsNodes;
    };

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
        let defaultId = 0;
        if (props.match.params.id) {
            defaultId = props.match.params.id;
        }
        let defaultValues = {
            field: '', minValue: '', maxValue: '', override: ''
        };
        let thisBreadcrumbs = [  ];
        this.state = {id: defaultId, values: defaultValues, fields:[], loading: false, formSubmit: false,
            breadcrumbs: thisBreadcrumbs};
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

    loadFields = () => {
        this.setState({ loading: true });  
        let self = this;
        let url = '/fields';
        Utils.ajaxGet(url, function(data) {
            self.setState({fields: data, loading: false});
        });
    };

    loadDefaultHostSimulatedMetrics = () => {
        if (this.state.id !== 0) {
            this.setState({ loading: true });  
            let self = this;
            let url = '/simulatedMetrics/defaultHosts/' + this.state.id;
            Utils.ajaxGet(url, function(data) {
                self.setState({values: data, loading: false});
            });
        }
    };

    renderFieldsSelect = () => {
        let fieldsNodes;
        if (this.state.fields) {
            fieldsNodes = this.state.fields.map(function (field) {
                return (
                    <option key={field.id} value={field.fieldName}>{field.fieldName}</option>
                );
            });
            return fieldsNodes;
        }
    };

    onSubmitForm = (event) => {
        event.preventDefault();
        let formId = "form-service";
        let formAction = '/simulatedMetrics/defaultHosts/' + this.state.id;
        let formData = Utils.convertFormToJson(formId);
        let self = this;
        Utils.formSubmit(formAction, 'POST', formData, function (data) {
            self.setState({isEdit: false, formSubmit: true});
            M.toast({html: "<div>Default host simulated metric saved successfully!</div>"});
        });
    };

    onInputChange = (event) => {
        let name = event.target.name;
        let newValues = this.state.values;
        newValues[name] = event.target.value;
        this.setState({values: newValues});
    };

    renderForm = () => {
        let fieldsSelect = this.renderFieldsSelect();
        return (
            <form id="form-service" onSubmit={this.onSubmitForm}>                
                <div className="input-field col s12">
                    <select value={this.state.values.field} onChange={this.onInputChange} name="field" id="field">
                        <option value="" disabled="disabled">Choose field</option>
                        {fieldsSelect}
                    </select>
                    <label htmlFor="field">Field</label>
                </div>
                <div className="input-field col s12">
                    <input value={this.state.values.minValue} onChange={this.onInputChange} type="number" name="minValue" id="minValue" autoComplete="off"/>
                    <label htmlFor="minValue">Minimum value</label>
                </div>
                <div className="input-field col s12">
                    <input value={this.state.values.maxValue} onChange={this.onInputChange} type="number" name="maxValue" id="maxValue" autoComplete="off"/>
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
    };

    render() {
        if (this.state.formSubmit) {
            return <Redirect to='/ui/simulatedMetrics/defaultHosts' />;
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
    }

    onClickRemove = () => {
        let action = '/simulatedMetrics/specificHosts/' + this.props.simulatedMetric.id;
        let self = this;
        Utils.formSubmit(action, 'DELETE', {}, function (data) {
            M.toast({html: "<div>Specific host simulated metric removed successfully!</div>"});
            self.props.reloadSimulatedMetrics();
        });
    };

    render() {
        let style = {marginLeft: '10px'};
        let override = '' + this.props.simulatedMetric.override;
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
    }

    componentDidMount() {
        this.loadSimulatedMetrics();
        let instances = M.Tooltip.init(document.querySelectorAll('.tooltipped'));
        this.setState({tooltipInstances: instances});
    }

    componentWillUnmount() {
        this.state.tooltipInstances[0].destroy();
    }

    loadSimulatedMetrics = () => {
        this.setState({loading: true});
        let self = this;
        Utils.ajaxGet('/simulatedMetrics/specificHosts',
            function (data) {
                self.setState({data: data, loading: false});
            });
    };

    renderSimulatedMetrics = () => {
        let simulatedMetricsNodes;
        let self = this;
        if (this.state.data) {
            simulatedMetricsNodes = this.state.data.map(function (simulatedMetric, index) {
                return (
                    <SpecificHostSimulatedMetricsCard key={simulatedMetric.id} simulatedMetric={simulatedMetric} reloadSimulatedMetrics={self.loadSimulatedMetrics}/>
                );
            });
        }
        return simulatedMetricsNodes;
    };

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
        let defaultId = 0;
        if (props.match.params.id) {
            defaultId = props.match.params.id;
        }
        let defaultValues = {
            hostname: '', field: '', minValue: '', maxValue: '', override: ''
        };
        let thisBreadcrumbs = [  ];
        this.state = {id: defaultId, values: defaultValues, nodes: [], fields:[], loading: false, formSubmit: false,
            breadcrumbs: thisBreadcrumbs};
    }

    componentDidMount() {
        this.loadNodes();
        this.loadFields();
        this.loadSpecificHostSimulatedMetrics();
    }
    
    componentDidUpdate() {
        M.updateTextFields();
        let elems = document.querySelectorAll('select');
        M.FormSelect.init(elems);
    }

    loadNodes = () => {
        this.setState({loading: true});
        let self = this;
        let url = '/nodes';
        Utils.ajaxGet(url, function(data) {
            self.setState({nodes: data, loading: false});
        });
    };

    loadFields = () => {
        this.setState({loading: true});
        let self = this;
        let url = '/rules/fields';
        Utils.ajaxGet(url, function(data) {
            self.setState({fields: data, loading: false});
        });
    };

    loadSpecificHostSimulatedMetrics = () => {
        if (this.state.id !== 0) {
            this.setState({loading: true});
            let self = this;
            let url = '/simulatedMetrics/specificHosts/' + this.state.id;
            Utils.ajaxGet(url, function(data) {
                self.setState({values: data, loading: false});
            });
        }
    };

    renderNodesSelect = () => {
        let nodes;
        if (this.state.nodes) {
            nodes = this.state.nodes.map(function (node) {
                return (
                    <option key={node.hostname} value={node.hostname}>{node.hostname}</option>
                );
            });
            return nodes;
        }
    };

    renderFieldsSelect = () => {
        let fieldsNodes;
        if (this.state.fields) {
            fieldsNodes = this.state.fields.map(function (field) {
                return (
                    <option key={field.id} value={field.fieldName}>{field.fieldName}</option>
                );
            });
            return fieldsNodes;
        }
    };

    onSubmitForm = (event) => {
        event.preventDefault();
        let formId = "form-service";
        let formAction = '/simulatedMetrics/specificHosts/' + this.state.id;
        let formData = Utils.convertFormToJson(formId);
        let self = this;
        Utils.formSubmit(formAction, 'POST', formData, function (data) {
            self.setState({isEdit: false, formSubmit: true});
            M.toast({html: "<div>Specific host simulated metric saved successfully!</div>"});
        });
    };

    onInputChange = (event) => {
        let name = event.target.name;
        let newValues = this.state.values;
        newValues[name] = event.target.value;
        this.setState({values: newValues});
    };

    renderForm = () => {
        let nodesSelect = this.renderNodesSelect();
        let fieldsSelect = this.renderFieldsSelect();
        return (
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
                    <input value={this.state.values.minValue} onChange={this.onInputChange} type="number" name="minValue" id="minValue" autoComplete="off"/>
                    <label htmlFor="minValue">Minimum value</label>
                </div>
                <div className="input-field col s12">
                    <input value={this.state.values.maxValue} onChange={this.onInputChange} type="number" name="maxValue" id="maxValue" autoComplete="off"/>
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
    };

    render() {
        if (this.state.formSubmit) {
            return <Redirect to='/ui/simulatedMetrics/specificHosts' />;
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