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
import { Redirect } from 'react-router';
import MainLayout from '../shared/MainLayout';
import {getData, postData} from "../../utils/data";

export default class ContainerSimulatedMetricsDetail extends React.Component {
  constructor (props) {
    super(props);
    let defaultId = 0;
    if (props.match.params.id) {
      defaultId = props.match.params.id;
    }
    const defaultValues = {
      containerId: '', field: '', minValue: '', maxValue: '', override: ''
    };
    const thisBreadcrumbs = [];
    this.state = {
      id: defaultId,
      values: defaultValues,
      containers: [],
      fields: [],
      loading: false,
      formSubmit: false,
      breadcrumbs: thisBreadcrumbs
    };
  }

  componentDidMount = () => {
    this.loadContainers();
    this.loadFields();
    this.loadContainerSimulatedMetrics();
  };

  componentDidUpdate = () => {
    M.updateTextFields();
    const elems = document.querySelectorAll('select');
    M.FormSelect.init(elems);
  };

  loadContainers = () => {
    this.setState({ loading: true });
    getData(
      'localhost/containers',
      data => this.setState({ containers: data, loading: false })
    );
  };

  loadFields = () => {
    this.setState({ loading: true });
    getData(
      'localhost/rules/fields',
      data => this.setState({ fields: data, loading: false })
    );
  };

  loadContainerSimulatedMetrics = () => {
    if (this.state.id !== 0) {
      this.setState({ loading: true });
      getData(
        `localhost/metrics/simulated/containers/${this.state.id}`,
        data => this.setState({ values: data, loading: false })
      );
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

  onSubmitForm = event => {
    event.preventDefault();
    postData(
      `localhost/metrics/simulated/containers/${this.state.id}`,
      event.target[0].value,
      data => {
        this.setState({ isEdit: false, formSubmit: true });
        M.toast({ html: '<div>Container simulated metric saved successfully!</div>' });
      });
  };

  onInputChange = event => {
    const name = event.target.name;
    const newValues = this.state.values;
    newValues[name] = event.target.value;
    this.setState({ values: newValues });
  };

  renderForm = () => {
    const containersSelect = this.renderContainersSelect();
    const fieldsSelect = this.renderFieldsSelect();
    return (
      <form id="form-service" onSubmit={this.onSubmitForm}>
        <div className="input-field col s12">
          <select value={this.state.values.containerId} onChange={this.onInputChange} name="containerId"
                  id="containerId">
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
          <input value={this.state.values.minValue} onChange={this.onInputChange} type="number" name="minValue"
                 id="minValue" autoComplete="off"/>
          <label htmlFor="minValue">Minimum value</label>
        </div>
        <div className="input-field col s12">
          <input value={this.state.values.maxValue} onChange={this.onInputChange} type="number" name="maxValue"
                 id="maxValue" autoComplete="off"/>
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
      return <Redirect to='/metrics/simulated/containers'/>;
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
  };
}
