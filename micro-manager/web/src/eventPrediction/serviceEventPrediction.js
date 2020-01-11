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
import Utils from '../utils';
import {CardItem, MainLayout} from '../globalComponents';

class ServiceEventPredictionCard extends React.Component {

    constructor(props) {
        super(props);
    }

    onClickRemove = () => {
        let action = '/services/serviceEventPredictions/' + this.props.serviceEvent.id;
        let self = this;
        Utils.formSubmit(action, 'DELETE', {}, function (data) {
            M.toast({html: "<div>Service event prediction removed successfully!</div>"});
            self.props.reloadServiceEvents();
        });
    };

    render() {
        let startDate = new Date(this.props.serviceEvent.startDate).toLocaleString();
        let endDate = new Date(this.props.serviceEvent.endDate).toLocaleString();
        return (
            <div className='row'>
                <div className='col s12'>
                    <div className='card'>
                        <div className='card-content'>
                            <div className="right-align">                                
                                <div className="row">
                                    <div className="col s12">
                                        <button className="waves-effect waves-light btn-small red darken-4" onClick={this.onClickRemove}>Remove</button>
                                    </div>
                                </div>
                            </div>
                            <CardItem label='Description' value={this.props.serviceEvent.description}/>
                            <CardItem label='Service config' value={this.props.serviceEvent.service.serviceName}/>
                            <CardItem label='Start date' value={startDate}/>
                            <CardItem label='End date' value={endDate}/>
                            <CardItem label='Minimum replics' value={this.props.serviceEvent.minReplics}/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export class ServiceEventPredictions extends React.Component {

    constructor(props) {
        super(props);
        this.state = {data: [], loading: false, showAdd: true};
    }

    componentDidMount() {
        this.loadServiceEventPredictions();
        let instances = M.Tooltip.init(document.querySelectorAll('.tooltipped'));
        this.setState({tooltipInstances: instances});
    }
    componentWillUnmount() {
        this.state.tooltipInstances[0].destroy();
    }

    loadServiceEventPredictions = () => {
        this.setState({ loading: true });
        let self = this;
        Utils.ajaxGet('/services/serviceEventPredictions',
            function (data) {
                self.setState({data: data, loading: false});
            });
    };

    renderServiceEvents = () => {
        let serviceEventsNodes;
        let self = this;
        if (this.state.data) {
            serviceEventsNodes = this.state.data.map(function (serviceEvent, index) {
                return (
                    <ServiceEventPredictionCard key={serviceEvent.id} serviceEvent={serviceEvent} reloadServiceEvents={self.loadServiceEventPredictions}/>
                );
            });
        }
        return serviceEventsNodes;
    };

    render() {
        return (
            <MainLayout title='Service event predictions'>
                {this.renderServiceEvents()}
                <div className="fixed-action-btn tooltipped" data-position="left" data-tooltip="Add service event prediction">
                    <Link className="waves-effect waves-light btn-floating btn-large grey darken-4" to='/ui/rules/serviceeventpredictions/detail'>
                        <i className="large material-icons">add</i>
                    </Link>
                </div>
            </MainLayout>
        );
    }
}

export class ServiceEventPredictionDetail extends React.Component {

    constructor(props) {
        super(props);
        let defaultId = 0;
        if (props.match.params.id) {
            defaultId = props.match.params.id;
        }
        let defaultValues = {
            serviceId: '', description: '', startDate: '', startTime: '', 
            endDate: '', endTime: '', minReplics: ''
        };
        let thisBreadcrumbs = [{link: '/ui/rules/serviceEventPredictions', title: 'Service event predictions'}];
        this.state = {id: defaultId, values: defaultValues, services: [], loading: false, formSubmit: false, breadcrumbs: thisBreadcrumbs};
    }

    componentDidMount() {
        this.loadServices();
        this.loadServiceEventPrediction();
        let dateElems = document.querySelectorAll('.datepicker');
        let dateOptions = {
            format: 'dd-mm-yyyy'
        };
        M.Datepicker.init(dateElems, dateOptions);
        let timeElems = document.querySelectorAll('.timepicker');
        let timeOptions = {
            twelveHour: false
        };
        M.Timepicker.init(timeElems, timeOptions);
        this.addEventListenersPickers();
    }

    componentDidUpdate(){
        let elems = document.querySelectorAll('select');
        M.FormSelect.init(elems);
    }

    loadServices = () => {
        this.setState({loading: true});
        let self = this;
        let url = '/services';
        Utils.ajaxGet(url, function(data){
            self.setState({services: data, loading: false});
        });
    };

    loadServiceEventPrediction = () => {
        if (this.state.id !== 0) {
            this.setState({ loading: true });
            let self = this;
            let url = '/services/serviceEventPredictions/' + this.state.id;
            Utils.ajaxGet(url, function(data) {
                let loadValues = {
                    serviceId: data.service.id, description: data.description, minReplics: data.minReplics,
                    startDate: data.startDate, startTime: data.startTime, endDate: data.endDate, endTime: data.endTime
                };
                self.setState({values: loadValues, loading: false});
            });
        }
    };

    renderServicesSelect = () => {
        let servicesNodes;
        if (this.state.services) {
            servicesNodes = this.state.services.map(function (service) {
                return (
                    <option key={service.id} value={service.id}>{service.serviceName}</option>
                );
            });
            return servicesNodes;
        }
    };

    updateStateFromPicker = (name, value) => {
        let newValues = this.state.values;
        newValues[name] = value;
        this.setState({values: newValues});
    };

    addEventListenersPickers = () => {
        let self = this;
        let elems = $(document).find('.datepicker,.timepicker');
        for (let i = 0; i < elems.length; i++) {
            let input = elems[i];
            $(input).change(function(e){
                let currInput = $(e.target);
                let val = currInput.val();
                let inputName = currInput.attr("name");
                self.updateStateFromPicker(inputName, val);
            });                         
        }        
    };

    onSubmitForm = (event) => {
        event.preventDefault();
        let formId = "form-service";
        let formAction = '/services/serviceEventPredictions/' + this.state.id;
        let formData = Utils.convertFormToJson(formId);
        let self = this;
        Utils.formSubmit(formAction, 'POST', formData, function (data) {
            self.setState({isEdit: false, formSubmit: true});
            M.toast({html: "<div>Service event prediction saved successfully!</div>"});
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
        return (
            <form id="form-service" onSubmit={this.onSubmitForm}>                
                <div className="input-field col s12">
                    <input value={this.state.values.description} onChange={this.onInputChange} type="text" name="description" id="description" autoComplete="off"/>
                    <label htmlFor="description">Description</label>
                </div>
                <div className="input-field col s12">
                    <select value={this.state.values.serviceId} onChange={this.onInputChange} name="serviceId" id="serviceId">
                        <option value="" disabled="disabled">Choose service</option>
                        {servicesSelect}
                    </select>
                    <label htmlFor="service">Service</label>
                </div>
                <div className="input-field col s6">
                    <input className='datepicker' defaultValue={this.state.values.startDate} type="text" name="startDate" id="startDate" autoComplete="off"/>
                    <label htmlFor="startDate">Start date</label>
                </div>
                <div className="input-field col s6">
                    <input className='timepicker' defaultValue={this.state.values.startTime} type="text" name="startTime" id="startTime" autoComplete="off"/>
                    <label htmlFor="startTime">Start time</label>
                </div>
                <div className="input-field col s6">
                    <input className='datepicker' defaultValue={this.state.values.endDate} type="text" name="endDate" id="endDate" autoComplete="off"/>
                    <label htmlFor="endDate">End date</label>
                </div>
                <div className="input-field col s6">
                    <input className='timepicker' defaultValue={this.state.values.endTime} type="text" name="endTime" id="endTime" autoComplete="off"/>
                    <label htmlFor="endTime">End time</label>
                </div>
                <div className="input-field col s12">
                    <input value={this.state.values.minReplics} onChange={this.onInputChange} type="number" name="minReplics" id="minReplics" autoComplete="off"/>
                    <label htmlFor="minReplics">Minimum replics</label>
                </div>                
                <button className="btn waves-effect waves-light" type="submit" name="action">
                    Add
                    <i className="material-icons right">send</i>
                </button>
            </form>
        );
    };

    render() {
        if (this.state.formSubmit) {
            return <Redirect to='/ui/rules/serviceEventPredictions'/>;
        }
        return (
            <MainLayout title='Service event prediction detail' breadcrumbs={this.state.breadcrumbs}>
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
