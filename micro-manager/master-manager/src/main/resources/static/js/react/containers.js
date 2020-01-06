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
    }

    componentDidUpdate() {
        if (this.state.isReplicate || this.state.isMigrate) {
            let elems = this.hostname;
            M.FormSelect.init(elems);
        }
    }

    componentDidMount() {
        M.Collapsible.init(document.querySelectorAll('.collapsible'));
    }

    renderNames = () => {
        return this.props.container.names.map(function (name, index) {
            let counter = index + 1;
            return (
                <CardItem key={name + index} label={'Name ' + counter} value={name}/>
            );
        });
    };

    renderPorts = () => {
        return this.props.container.ports.map(function (port, index) {
            return (
                <ContainerPort key={'port' + index} port={port}/>
            );
        });
    };

    renderLabels = () => {
        let propsLabels = this.props.container.labels;
        return Object.keys(propsLabels).map(function(key, index) {
            return (
                <div key={key}>
                    {key + ': ' + propsLabels[key]}
                </div>
            )
        });
    };

    /*renderLogs() {
        return (
            <div>
                {this.props.container.logs}
            </div>
        );
    }*/

    onClickStop = () => {
        let action = '/containers/'+ this.props.container.id;
        let dataObject = {
            hostname : this.props.container.hostname,
            containerId : this.props.container.id
        };
        let dataToSend =JSON.stringify(dataObject);
        let self = this;
        Utils.formSubmit(action, 'DELETE', dataToSend, function (data) {
            M.toast({html: "<div>Container stopped successfully!</div>"});
            self.props.containerStopped(self.props.container.id);
        });
    };

    loadAvailableNodes = () => {
        this.setState({ loading: true });
        let self = this;
        Utils.ajaxGet('/nodes', function(data){
            self.setState({nodes: data, loading: false});
        });
    };

    onClickReplicate = () => {
        this.loadAvailableNodes();
        this.setState({ isReplicate: true });
    };

    onClickMigrate = () => {
        this.loadAvailableNodes();
        this.setState({ isMigrate: true });
    };

    onClickCancelReplicate = () => {
        let instance = M.FormSelect.getInstance(this.hostname);
        instance.destroy();
        this.setState({ isReplicate: false, isMigrate: false });
    };

    handleChangeHostname = (event) => {
        this.setState({hostnameSelected: event.target.value});
    };

    onSubmitReplicate = () => {
        let self = this;
        let url = '/containers/' + this.props.container.id + '/replicate';
        let dataToSend = JSON.stringify({fromHostname: this.props.container.hostname,
            containerId: this.props.container.id, toHostname: this.state.hostnameSelected});
        Utils.formSubmit(url, 'POST', dataToSend, function(data){
            self.onClickCancelReplicate();
            self.props.onReplicate();
            M.toast({html: "<div>Container replicated successfully!</div>"});
        });
    };

    onSubmitMigrate = () => {
        let self = this;
        let url = '/containers/' + this.props.container.id + '/migrate';
        let dataToSend = JSON.stringify({fromHostname: this.props.container.hostname,
            containerId: this.props.container.id, toHostname: this.state.hostnameSelected,
            secondsBeforeStop: this.state.seconds});
        Utils.formSubmit(url, 'POST', dataToSend, function(data){
            self.onClickCancelReplicate();
            self.props.onReplicate();
            M.toast({html: "<div>Container migrated successfully!</div>"});
        });
    };

    renderHostnamesSelect = () => {
        let hostnameNodes;
        if (this.state.nodes) {
            hostnameNodes = this.state.nodes.map(function (node) {
                return (
                    <option key={node.id} value={node.hostname}>{node.hostname}</option>
                );
            });
            return hostnameNodes;
        }
    };

    renderSelectTotal = () => {
        return (
            <div className="input-field col s6">
                <select ref={hostname => this.hostname = hostname} defaultValue="" name="hostname" id="hostname" onChange={this.handleChangeHostname}>
                    <option value="" disabled="disabled">Choose hostname</option>
                    {this.renderHostnamesSelect()}
                </select>
                <label htmlFor="hostname">Hostname</label>
            </div>
        )
    };

    renderReplicate = () => {
        let style = {marginLeft: "10px"};
        let cancelButton =
            <a title="Cancel" style={style} className="btn-floating waves-effect waves-light red darken-4" onClick={this.onClickCancelReplicate}>
                <i className="material-icons">clear</i>
            </a>;
        if (this.state.isReplicate) {
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
        else if (this.state.isMigrate) {
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
        else if (!this.state.isReplicate && !this.state.isMigrate)
            return (
                <div className="row">
                    <div className="col s12">
                        <a style={style} className="waves-effect waves-light btn-small" onClick={this.onClickMigrate}>Migrate</a>
                        <a style={style} className="waves-effect waves-light btn-small" onClick={this.onClickReplicate}>Replicate</a>
                    </div>
                </div>
            );
    };

    render() {
        let style = { marginLeft: "5px" };
        let labelStyle = { paddingTop: "0px", paddingBottom: "0px"};
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
                            {/*<div className="row">
                                <ul className="collapsible">
                                    <li>
                                        <div style={labelStyle} className="collapsible-header">
                                            <h5>Logs</h5>
                                        </div>
                                        <div className="collapsible-body">
                                            {this.renderLogs()}
                                        </div>
                                    </li>
                                </ul>
                            </div>*/}
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
    }

    componentDidMount() {
        this.loadContainers();
        let instances = M.Tooltip.init(document.querySelectorAll('.tooltipped'));
        this.setState({tooltipInstances: instances});
    }

    componentWillUnmount() {
        this.state.tooltipInstances[0].destroy();
    }

    onReplicate = () => {
        this.loadContainers();
    };

    onChangeFilter = (event) => {
        let filterVal = event.target.value;
        let self = this;
        this.setState({filter: filterVal}, function() {
            self.applyFilter();
        });
    };

    applyFilter = () => {
        let filterVal = this.state.filter;
        let data = this.state.data;
        let filteredContainers = [];
        for (let index = 0; index < data.length; index++) {
            const container = data[index];
            if(container.names[0].includes(filterVal)) {
                filteredContainers.push(container);
            }
        }
        this.setState({filtContainers: filteredContainers});
    };

    clearFilter = () => {
        let self = this;
        this.setState({filter: ''}, function(){
            self.applyFilter();
            $('#filter').val('');
        });
    };

    loadContainers = () => {
        this.setState({ loading: true });
        let self = this;
        Utils.ajaxGet('/containers',
            function (containers) {
                self.setState({data: containers, filtContainers: containers, loading: false});
            });
    };

    containerStopped = (containerId) => {
        let newData = this.state.data;
        let self = this;
        for (let index = 0; index < newData.length; index++) {
            if (newData[index].id === containerId) {
                newData.splice(index, 1);
                break;
            }
        }
        this.setState({data: newData}, function() {
            self.applyFilter();
        });
    };

    render() {
        let containersNodes;
        let self = this;
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
                    <input onChange={this.onChangeFilter} value={this.state.filter} type="text" name="filter" id="filter" autoComplete="off"/>
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
        let serviceDefaultValues = [];
        if(props.match.params.containerId) {

        }
        let defaultValues = {
            internalPort: '', externalPort: ''
        };
        let thisBreadcrumbs = [{link: '/containers', title: 'Containers'}];
        this.state = { breadcrumbs: thisBreadcrumbs, services: [], nodes: [], loading: false,  values: defaultValues, formSubmit: false};
    }

    componentDidMount() {
        this.loadServices();
        this.loadAvailableNodes();
    }

    componentDidUpdate() {
        let elems = document.querySelectorAll('select');
        M.FormSelect.init(elems);
    }

    loadAvailableNodes = () => {
        this.setState({ loading: true });
        let self = this;
        Utils.ajaxGet('/nodes', function(data){
            self.setState({nodes: data, loading: false});
        });
    };

    loadServices = () => {
        this.setState({ loading: true });
        let self = this;
        let url = '/services';
        Utils.ajaxGet(url, function(data){
            self.setState({services: data, loading: false});
        });
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

    renderHostnamesSelect = () => {
        if (this.state.nodes) {
            return this.state.nodes.map(function (node) {
                return (
                    <option key={node.id} value={node.hostname}>{node.hostname}</option>
                );
            });
        }
    };

    onSubmitForm = (event) => {
        event.preventDefault();
        let formId = "form-service";
        let formAction = '/containers';
        let formData = Utils.convertFormToJson(formId);
        let self = this;
        Utils.formSubmit(formAction, 'POST', formData, function (data) {
            self.setState({isEdit: false, formSubmit: true});
            console.log(data);
            M.toast({html: "<div>Container launched successfully!</div>"});
        });
    };

    onInputChange = (event) => {
        let name = event.target.name ;
        let newValues = this.state.values;
        newValues[name] = event.target.value;
        this.setState({values: newValues});
    };

    onChangeServicesSelect = (event) => {
        let services = this.state.services;
        for (let index = 0; index < services.length; index++) {
            if(services[index].serviceName === event.target.value){
                let newValues = this.state.values;
                newValues.internalPort = services[index].internalPort;
                newValues.externalPort = services[index].externalPort;

                this.setState({values: newValues});
            }
        }
    };

    renderForm = () => {
        let servicesSelect = this.renderServicesSelect();
        let hostnamesSelect = this.renderHostnamesSelect();
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
                    <input defaultValue={this.state.values.internalPort} type="text" name="internalPort" id="internalPort" autoComplete="off"/>
                    <label htmlFor="internalPort">Internal Port</label>
                </div>
                <div className="input-field col s12">
                    <input defaultValue={this.state.values.externalPort} type="text" name="externalPort" id="externalPort" autoComplete="off"/>
                    <label htmlFor="externalPort">External Port</label>
                </div>
                <button className="btn waves-effect waves-light" type="submit" name="action">
                    Launch
                    <i className="material-icons right">send</i>
                </button>
            </form>
        );
    };

    render() {
        if (this.state.formSubmit){
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
