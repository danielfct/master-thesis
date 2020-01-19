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
import { Redirect } from 'react-router-dom';
import M from 'materialize-css';
import MainLayout from '../shared/MainLayout';
import {getData, postData} from "../../utils/data";

export default class ServiceSimulatedMetricsDetail extends React.Component {
  constructor (props) {
    super(props);
    let defaultId = 0;
    if (props.match.params.id) {
      defaultId = props.match.params.id;
    }
    const defaultValues = {
      serviceName: '', field: '', minValue: '', maxValue: '', override: ''
    };
    const thisBreadcrumbs = [];
    this.state = {
      id: defaultId,
      values: defaultValues,
      services: [],
      fields: [],
      loading: false,
      formSubmit: false,
      breadcrumbs: thisBreadcrumbs
    };
  }

  componentDidMount = () => {
    this.loadServices();
    this.loadFields();
    this.loadServiceSimulatedMetrics();
  };

  componentDidUpdate = () => {
    M.updateTextFields();
    let elems = document.querySelectorAll('select');
    M.FormSelect.init(elems);
  };

  loadServices = () => {
    this.setState({ loading: true });
    getData(
      'http://localhostservices',
      data => this.setState({ services: data, loading: false })
    );
  };

  loadFields = () => {
    this.setState({ loading: true });
    getData(
      'http://localhostrules/fields',
      data => this.setState({ fields: data, loading: false })
    );
  };

  loadServiceSimulatedMetrics = () => {
    if (this.state.id !== 0) {
      this.setState({ loading: true });
      getData(
        `http://localhostmetrics/simulated/services/${this.state.id}`,
        data => this.setState({ values: data, loading: false })
      );
    }
  };

  renderServicesSelect = () => {
    let servicesNodes;
    if (this.state.services) {
      servicesNodes = this.state.services.map(service => (
        <option key={service.id} value={service.serviceName}>{service.serviceName}</option>
      ));
      return servicesNodes;
    }
  };

  renderFieldsSelect = () => {
    let fieldsNodes;
    if (this.state.fields) {
      fieldsNodes = this.state.fields.map(field => (
        <option key={field.id} value={field.fieldName}>{field.fieldName}</option>
      ));
      return fieldsNodes;
    }
  };

  onSubmitForm = event => {
    event.preventDefault();
    postData(
      `http://localhostmetrics/simulated/services/${this.state.id}`,
      event.target[0].value,
      data => {
        this.setState({ isEdit: false, formSubmit: true });
        M.toast({ html: '<div>Service simulated metric saved successfully!</div>' });
      });
  };

  onInputChange = event => {
    const name = event.target.name;
    const newValues = this.state.values;
    newValues[name] = event.target.value;
    this.setState({ values: newValues });
  };

  renderForm = () => {
    const servicesSelect = this.renderServicesSelect();
    const fieldsSelect = this.renderFieldsSelect();
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

  render = () => {
    if (this.state.formSubmit) {
      return <Redirect to='/metrics/simulated/services' />;
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
  };
}
