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
import Utils from '../../utils';
import ServiceCard from './ServiceCard';
import { Redirect } from 'react-router';
import MainLayout from '../shared/MainLayout';

export default class ServicePage extends React.Component {
  constructor (props) {
    super(props);
    let paramId = 0;
    if (this.props.match.params.id) {
      paramId = this.props.match.params.id;
    }
    const isEdit = paramId === 0;
    const serviceInitialValues = {
      id: paramId,
      serviceName: '',
      dockerRepository: '',
      defaultExternalPort: '',
      defaultInternalPort: '',
      defaultDb: '',
      launchCommand: '',
      minReplics: 0,
      maxReplics: 0,
      outputLabel: '',
      serviceType: '',
      expectedMemoryConsumption: 0
    };
    const thisBreadcrumbs = [{ title: 'Services configs', link: '/ui/services' }];
    this.state = {
      breadcrumbs: thisBreadcrumbs,
      service: serviceInitialValues,
      dependencies: [],
      loadedDependencies: false,
      loading: false,
      isEdit: isEdit,
      isDeleted: false
    };
  }

  componentDidMount = () => {
    if (this.state.service.id !== 0) {
      this.loadDependencies();
      this.loadService();
    }
    M.updateTextFields();
    M.FormSelect.init(document.querySelectorAll('select'));
  };

  componentDidUpdate = () => {
    M.updateTextFields();
    M.Collapsible.init(document.querySelectorAll('.collapsible'));
    M.FormSelect.init(document.querySelectorAll('select'));
  };

  loadService = () => {
    this.setState({ loading: true });
    Utils.ajaxGet(
      `localhost/services/${this.state.service.id}`,
      data => this.setState({ service: data, loading: false })
    );
  };

  loadDependencies = () => {
    this.setState({ loading: true });
    Utils.ajaxGet(
      `localhost/services/${this.state.service.id}/dependencies`,
      data => this.setState({ dependencies: data, loadedDependencies: true, loading: false })
    );
  };

  renderDependencies = () => {
    if (this.state.loadedDependencies) {
      let dependencies;
      if (this.state.dependencies.length > 0) {
        dependencies = this.state.dependencies.map(function (dependency) {
          return (
            <li key={'dependency-' + dependency.id}>
              <div className="collapsible-header">{dependency.serviceName}</div>
              <div className="collapsible-body">
                <ServiceCard renderSimple={true} service={dependency}/>
              </div>
            </li>
          );
        });
      } else {
        const style = { padding: '15px' };
        dependencies = <div style={style}>No dependencies</div>;
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
    const edit = !this.state.isEdit;
    this.setState({ isEdit: edit });
  };

  onClickRemove = () => {
    const formAction = '/services/' + this.state.service.id;
    Utils.formSubmit(formAction, 'DELETE', {},
      data => {
        this.setState({ isDeleted: true });
        M.toast({ html: '<div>Service config removed successfully!</div>' });
      });
  };

  handleChange = event => {
    const name = event.target.name;
    const newData = this.state.service;
    newData[name] = event.target.value;
    this.setState({ service: newData });
  };

  onSubmitForm = event => {
    event.preventDefault();
    const formAction = '/services';
    const formData = Utils.convertFormToJson('form-service');
    Utils.formSubmit(formAction, 'POST', formData,
      data => {
        const newService = this.state.service;
        if (newService.id === 0) {
          const title = document.title;
          window.history.replaceState({}, title, '/ui/services/detail/' + data);
        }
        newService.id = data;
        this.setState({ service: newService });
        M.toast({ html: '<div>Service config saved successfully!</div>' });
      });
  };

  renderButton = () => {
    if (this.state.isEdit) {
      return (
        <button className="btn waves-effect waves-light" type="submit" name="action">
          Save
          <i className="material-icons right">send</i>
        </button>
      );
    }
    return null;
  };

  renderServiceForm = () => {
    const editLabel = this.state.isEdit ? 'Cancel' : 'Edit';
    const style = { marginLeft: '5px' };
    return (
      <div className='row'>
        <div className="right-align">
          <div className="row">
            <div className="col s12">
              <a className="waves-effect waves-light btn-small" onClick={this.onClickEdit}>{editLabel}</a>
              <button disabled={this.state.service.id === 0} style={style}
                      className="waves-effect waves-light btn-small red darken-4" onClick={this.onClickRemove}>Remove
              </button>
            </div>
          </div>
        </div>
        <form id="form-service" onSubmit={this.onSubmitForm}>
          <div className="input-field col s12">
            <input disabled={!this.state.isEdit} value={this.state.service.serviceName} onChange={this.handleChange}
                   name="serviceName" id="serviceName" type="text" autoComplete="off"/>
            <label htmlFor="serviceName">Service name</label>
          </div>
          <div className="input-field col s12">
            <input disabled={!this.state.isEdit} value={this.state.service.dockerRepo} onChange={this.handleChange}
                   name="dockerRepo" id="dockerRepo" type="text" autoComplete="off"/>
            <label htmlFor="dockerRepo">Docker Repository</label>
          </div>
          <div className="input-field col s12">
            <input disabled={!this.state.isEdit} value={this.state.service.defaultExternalPort}
                   onChange={this.handleChange} name="defaultExternalPort" id="defaultExternalPort" type="text"
                   autoComplete="off"/>
            <label htmlFor="defaultExternalPort">Default external port</label>
          </div>
          <div className="input-field col s12">
            <input disabled={!this.state.isEdit} value={this.state.service.defaultInternalPort}
                   onChange={this.handleChange} name="defaultInternalPort" id="defaultInternalPort" type="text"
                   autoComplete="off"/>
            <label htmlFor="defaultInternalPort">Default internal port</label>
          </div>
          <div className="input-field col s12">
            <input disabled={!this.state.isEdit} value={this.state.service.defaultDb} onChange={this.handleChange}
                   name="defaultDb" id="defaultDb" type="text" autoComplete="off"/>
            <label htmlFor="defaultDb">Default database</label>
          </div>
          <div className="input-field col s12">
            <input disabled={!this.state.isEdit} value={this.state.service.launchCommand} onChange={this.handleChange}
                   name="launchCommand" id="launchCommand" type="text" autoComplete="off"/>
            <label htmlFor="launchCommand">Launch command</label>
          </div>
          <div className="input-field col s12">
            <input disabled={!this.state.isEdit} value={this.state.service.minReplics} onChange={this.handleChange}
                   name="minReplics" id="minReplics" type="number" autoComplete="off"/>
            <label htmlFor="minReplics">Minimum Replics</label>
          </div>
          <div className="input-field col s12">
            <input disabled={!this.state.isEdit} value={this.state.service.maxReplics} onChange={this.handleChange}
                   name="maxReplics" id="maxReplics" type="number" autoComplete="off"/>
            <label htmlFor="maxReplics">Maximum Replics</label>
          </div>
          <div className="input-field col s12">
            <input disabled={!this.state.isEdit} value={this.state.service.outputLabel} onChange={this.handleChange}
                   name="outputLabel" id="outputLabel" type="text" autoComplete="off"/>
            <label htmlFor="outputLabel">Output label</label>
          </div>

          <div className="input-field col s12">
            <select disabled={!this.state.isEdit} value={this.state.service.serviceType} onChange={this.handleChange}
                    name="serviceType" id="serviceType">
              <option value="" disabled="disabled">Choose service type</option>
              <option value='frontend'>frontend</option>
              <option value='backend'>backend</option>
              <option value='database'>database</option>
              <option value='system'>system</option>
            </select>
            <label htmlFor="serviceType">Service type</label>
          </div>
          <div className="input-field col s12">
            <input disabled={!this.state.isEdit} value={this.state.service.avgMem} onChange={this.handleChange}
                   name="avgMem" id="avgMem" type="number" autoComplete="off"/>
            <label htmlFor="avgMem">Average Memory (bytes)</label>
          </div>
          {this.renderButton()}
        </form>
      </div>
    );
  };

  render = () => {
    if (this.state.isDeleted) {
      return <Redirect to='/ui/services'/>;
    }
    return (
      <MainLayout title='Service config detail' breadcrumbs={this.state.breadcrumbs}>
        {this.renderServiceForm()}
        {this.renderDependencies()}
      </MainLayout>
    );
  };
}
