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

import React from "react";
import {Link, Redirect} from "react-router-dom";
import M from 'materialize-css'
import $ from "jquery";
import Utils from '../utils';
import {MainLayout} from "../sharedComponents/mainLayout";
import {CardItem} from "../sharedComponents/cardItem";

export class ServiceCard extends React.Component {

    constructor(props) {
        super(props);
        let service = this.props.service;
        this.state = { data: service, loading: false };
    }

    renderLink = () => {
        return (
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
    };

    renderSimple = () => {
        let linkDetails = this.props.viewDetails ? this.renderLink() : null;
        return (
            <div>
                {linkDetails}
                <CardItem label='Service name' value={this.state.data.serviceName}/>
                <CardItem label='Docker Repository' value={this.state.data.dockerRepository}/>
                <CardItem label='Default external port' value={this.state.data.defaultExternalPort}/>
                <CardItem label='Default internal port' value={this.state.data.defaultInternalPort}/>
                <CardItem label='Default database' value={this.state.data.defaultDb}/>
                <CardItem label='Launch command' value={this.state.data.launchCommand}/>
                <CardItem label='Minimum Replics' value={this.state.data.minReplics}/>
                <CardItem label='Maximum Replics' value={this.state.data.maxReplics}/>
                <CardItem label='Output label' value={this.state.data.outputLabel}/>
                <CardItem label='Service type' value={this.state.data.serviceType}/>
                <CardItem label='Average Memory (bytes)' value={this.state.data.expectedMemoryConsumption}/>
            </div>
        )
    };

    renderCard = () => {
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
    };

    render() {
        return this.props.renderSimple ? this.renderSimple() : this.renderCard();
    }
}

export class Services extends React.Component {

    constructor(props) {
        super(props);
        this.state = {data: [], filtServices: [], filter: '', loading: false};
    }

    componentDidMount() {
        this.loadServices();
        var instances = M.Tooltip.init(document.querySelectorAll('.tooltipped'));
        this.setState({tooltipInstances: instances});
    }
    componentWillUnmount() {
        this.state.tooltipInstances[0].destroy();
    }

    onChangeFilter = (event) => {
        let filterVal = event.target.value;
        let self = this;
        this.setState({filter: filterVal}, function(){
            self.applyFilter();
        });
    };

    applyFilter = () => {
        let filterVal = this.state.filter;
        let data = this.state.data;
        let filteredServices = [];
        for (let index = 0; index < data.length; index++) {
            const service = data[index];
            if(service.serviceName.includes(filterVal)) {
                filteredServices.push(service);
            }
        }
        this.setState({filtServices: filteredServices});
    };

    clearFilter = () => {
        let self = this;
        this.setState({filter: ''}, function(){
            self.applyFilter();
            $('#filter').val('');
        });
    };

    loadServices = () => {
        this.setState({ loading: true });
        let self = this;
        Utils.ajaxGet('/services',
            function (data) {
                var services = data;
                self.setState({data: services, filtServices: services, loading: false});
            });
    };

    render() {
        let serviceNodes;
        if (this.state.data) {
            serviceNodes = this.state.filtServices.map(function (service) {
                return (
                    <ServiceCard viewDetails={true} key={service.id} service={service} />
                );
            });
        }
        return (
            <MainLayout title='Services configs'>
                <div className="input-field col s10">
                    <input onChange={this.onChangeFilter} value={this.state.filter} type="text" name="filter" id="filter" autoComplete="off"/>
                    <label htmlFor="filter">Filter by name</label>
                </div>
                <div className="input-field col s2 right-align">
                    <a onClick={this.clearFilter} title="Clear filter" className="btn-floating waves-effect waves-light red darken-4">
                        <i className="material-icons">clear</i>
                    </a>
                </div>
                {serviceNodes}
                <div className="fixed-action-btn tooltipped" data-position="left" data-tooltip="Add service">
                    <Link className="waves-effect waves-light btn-floating btn-large grey darken-4" to='/ui/services/detail'>
                        <i className="large material-icons">add</i>
                    </Link>
                </div>
            </MainLayout>
        );
    }
}

export class ServicePage extends React.Component {

    constructor(props) {
        super(props);
        let paramId = 0;
        if (this.props.match.params.id) {
            paramId = this.props.match.params.id;
        }
        let isEdit = paramId === 0;
        let serviceInitialValues = {
            id: paramId, serviceName: '', dockerRepository: '', defaultExternalPort: '',
            defaultInternalPort: '', defaultDb: '', launchCommand: '', minReplics: 0,
            maxReplics: 0, outputLabel: '', serviceType: '', expectedMemoryConsumption: 0
        };
        let thisBreadcrumbs = [{title: 'Services configs', link: '/ui/services'}];
        this.state = {breadcrumbs: thisBreadcrumbs, service: serviceInitialValues, dependencies: [],
            loadedDependencies: false, loading: false, isEdit: isEdit, isDeleted: false};
    }

    componentDidMount() {
        if (this.state.service.id !== 0) {
            this.loadDependencies();
            this.loadService();
        }
        M.updateTextFields();
        M.FormSelect.init(document.querySelectorAll('select'));
    }

    componentDidUpdate() {
        M.updateTextFields();
        M.Collapsible.init(document.querySelectorAll('.collapsible'));
        M.FormSelect.init(document.querySelectorAll('select'));
    }

    loadService = () => {
        this.setState({ loading: true });
        let self = this;
        Utils.ajaxGet('/services/' + this.state.service.id,
            function (data) {
                self.setState({service: data, loading: false});
            });
    };

    loadDependencies = () => {
        this.setState({ loading: true });
        let self = this;
        Utils.ajaxGet('/services/' + this.state.service.id + '/dependencies',
            function (data) {
                self.setState({dependencies: data, loadedDependencies: true, loading: false});
            });
    };

    renderDependencies = () => {
        if (this.state.loadedDependencies) {
            let dependencies;
            if (this.state.dependencies.length > 0) {
                dependencies = this.state.dependencies.map(function (dependency) {
                    return (
                        <li key={'dependency-' + dependency.id} >
                            <div className="collapsible-header">{dependency.serviceName}</div>
                            <div className="collapsible-body">
                                <ServiceCard renderSimple={true} service={dependency}/>
                            </div>
                        </li>
                    );
                });
            }
            else {
                let style = {padding: '15px'};
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
    };

    onClickEdit = () => {
        let edit = !this.state.isEdit;
        this.setState({isEdit: edit});
    };

    onClickRemove = () => {
        let formAction = '/services/' + this.state.service.id;
        let self = this;
        Utils.formSubmit(formAction, 'DELETE', {}, function (data) {
            self.setState({isDeleted: true});
            M.toast({html: "<div>Service config removed successfully!</div>"});
        });
    };

    handleChange = (event) => {
        let name = event.target.name;
        let newData = this.state.service;
        newData[name] = event.target.value;
        this.setState({service: newData});
    };

    onSubmitForm = (event) => {
        event.preventDefault();
        let formAction = '/services';
        let formData = Utils.convertFormToJson('form-service');
        let self = this;
        Utils.formSubmit(formAction, 'POST', formData, function (data) {
            let newService = self.state.service;
            if (newService.id === 0) {
                let title = document.title;
                history.replaceState({}, title, '/ui/services/detail/' + data);
            }
            newService.id = data;
            self.setState({service: newService});
            M.toast({html: "<div>Service config saved successfully!</div>"});
        });
    };

    renderButton = () => {
        if (this.state.isEdit) {
            return (
                <button className="btn waves-effect waves-light" type="submit" name="action">
                    Save
                    <i className="material-icons right">send</i>
                </button>
            )
        }
        return null;
    };

    renderServiceForm = () => {
        let editLabel = this.state.isEdit ? "Cancel" : "Edit";
        let style = {marginLeft: '5px'};
        return (
            <div className='row'>
                <div className="right-align">
                    <div className="row">
                        <div className="col s12">
                            <a className="waves-effect waves-light btn-small" onClick={this.onClickEdit}>{editLabel}</a>
                            <button disabled={this.state.service.id === 0} style={style} className="waves-effect waves-light btn-small red darken-4" onClick={this.onClickRemove}>Remove</button>
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
        );
    };

    render() {
        if (this.state.isDeleted) {
            return <Redirect to='/ui/services'/>;
        }
        return (
            <MainLayout title='Service config detail' breadcrumbs={this.state.breadcrumbs}>
                {this.renderServiceForm()}
                {this.renderDependencies()}
            </MainLayout>
        );
    }
}