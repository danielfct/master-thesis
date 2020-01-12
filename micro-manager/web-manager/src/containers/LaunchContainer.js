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

import React from 'react';
import M from 'materialize-css';
import Utils from '../utils';
import { Redirect } from 'react-router';
import MainLayout from '../sharedComponents/MainLayout';

export default class LaunchContainer extends React.Component {
  constructor (props) {
    super(props);
    const serviceDefaultValues = [];
    if (props.match.params.containerId) {

    }
    const defaultValues = {
      internalPort: '', externalPort: ''
    };
    const thisBreadcrumbs = [{ link: '/containers', title: 'Containers' }];
    this.state = {
      breadcrumbs: thisBreadcrumbs,
      services: [],
      nodes: [],
      loading: false,
      values: defaultValues,
      formSubmit: false
    };
  }

  componentDidMount () {
    this.loadServices();
    this.loadAvailableNodes();
  }

  componentDidUpdate () {
    const elems = document.querySelectorAll('select');
    M.FormSelect.init(elems);
  }

  loadAvailableNodes () {
    this.setState({ loading: true });
    const self = this;
    Utils.ajaxGet('/nodes', function (data) {
      self.setState({ nodes: data, loading: false });
    });
  };

  loadServices () {
    this.setState({ loading: true });
    const self = this;
    const url = '/services';
    Utils.ajaxGet(url, function (data) {
      self.setState({ services: data, loading: false });
    });
  };

  renderServicesSelect () {
    return this.state.services && this.state.services.map((service) =>
      <option key={service.id} value={service.serviceName}>{service.serviceName}</option>
    );
  };

  renderHostnamesSelect () {
    return this.state.nodes && this.state.nodes.map((node) =>
      <option key={node.id} value={node.hostname}>{node.hostname}</option>
    );
  };

  onSubmitForm (event) {
    event.preventDefault();
    const formId = 'form-service';
    const formAction = '/containers';
    const formData = Utils.convertFormToJson(formId);
    const self = this;
    Utils.formSubmit(formAction, 'POST', formData, function (data) {
      self.setState({ isEdit: false, formSubmit: true });
      console.log(data);
      M.toast({ html: '<div>Container launched successfully!</div>' });
    });
  };

  onInputChange (event) {
    const name = event.target.name;
    const newValues = this.state.values;
    newValues[name] = event.target.value;
    this.setState({ values: newValues });
  };

  onChangeServicesSelect (event) {
    const services = this.state.services;
    for (let index = 0; index < services.length; index++) {
      if (services[index].serviceName === event.target.value) {
        const newValues = this.state.values;
        newValues.internalPort = services[index].internalPort;
        newValues.externalPort = services[index].externalPort;

        this.setState({ values: newValues });
      }
    }
  };

  renderForm () {
    const servicesSelect = this.renderServicesSelect();
    const hostnamesSelect = this.renderHostnamesSelect();
    return (
      <form id="form-service" onSubmit={this.onSubmitForm}>
        <div className="input-field col s12">
          <select defaultValue="" name="hostname" id="hostname">
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
          <input defaultValue={this.state.values.internalPort} type="text" name="internalPort" id="internalPort"
            autoComplete="off"/>
          <label htmlFor="internalPort">Internal Port</label>
        </div>
        <div className="input-field col s12">
          <input defaultValue={this.state.values.externalPort} type="text" name="externalPort" id="externalPort"
            autoComplete="off"/>
          <label htmlFor="externalPort">External Port</label>
        </div>
        <button className="btn waves-effect waves-light" type="submit" name="action">
          Launch
          <i className="material-icons right">send</i>
        </button>
      </form>
    );
  };

  render () {
    if (this.state.formSubmit) {
      return <Redirect to='/ui/containers'/>;
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
