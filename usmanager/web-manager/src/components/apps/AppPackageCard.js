/*
 * MIT License
 *
 * Copyright (c) 2020 usmanager
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
import ServiceCard from '../services/ServiceCard';
import {deleteData, getData, postData} from "../../utils/data";

export default class AppPackageCard extends React.Component {
  constructor (props) {
    super(props);
    const propAppPackage = this.props.appPackage;
    const defaultEdit = propAppPackage.id === 0;
    this.state = {
      isLaunchActive: false,
      appPackage: propAppPackage,
      data: [],
      availableRegions: [],
      regionSelected: '',
      countrySelected: '',
      citySelected: '',
      loading: false,
      isEdit: defaultEdit
    };
  }

  componentDidMount = () => {
    this.loadAppServices();
  };

  componentDidUpdate = () => {
    M.updateTextFields();
    M.Collapsible.init(document.querySelectorAll('.collapsible'));
    if (this.state.isLaunchActive) {
      M.FormSelect.init(this.region);
    }
  };

  loadRegions = () => {
    this.setState({ loading: true });
    getData(
      'http://localhostregions',
      data => this.setState({ availableRegions: data, loading: false })
    );
  };

  loadAppServices = () => {
    this.setState({ loading: true });
    getData(
      `http://localhostapps/${this.state.appPackage.id}/services`,
      data => this.setState({ data: data, loading: false })
    );
  };

  handleChangeRegion = event => {
    this.setState({ regionSelected: event.target.value });
  };

  handleChangeCountry = event => {
    this.setState({ countrySelected: event.target.value });
  };

  handleChangeCity = event => {
    this.setState({ citySelected: event.target.value });
  };

  renderRegionsSelect = () => {
    let regions;
    if (this.state.availableRegions) {
      regions = this.state.availableRegions.map(function (region) {
        return (
          <option key={region.regionName}
                  value={region.regionName}>{region.regionName + ' (' + region.regionDescription + ')'}</option>
        );
      });
      return regions;
    }
  };

  renderRegionsSelectTotal = () => (
    <div className="input-field col s6">
      <select ref={region => this.region = region} defaultValue="" name="region" id="region"
              onChange={this.handleChangeRegion}>
        <option value="" disabled="disabled">Choose region</option>
        {this.renderRegionsSelect()}
      </select>
      <label htmlFor="Region">Region</label>
    </div>
  );

  renderNormal = () => (
    <div>
      <h5>App name</h5>
      <div>{this.state.appPackage.appName}</div>
    </div>
  );

  onClickLaunch = () => {
    this.loadRegions();
    this.setState({ isLaunchActive: true });
  };

  onClickCancelLaunch = () => {
    const instance = M.FormSelect.getInstance(this.region);
    instance.destroy();
    this.setState({ isLaunchActive: false });
  };

  renderLaunchApp = () => {
    const style = { marginLeft: '10px' };
    const cancelButton =
      <a title="Cancel" style={style} className="btn-floating waves-effect waves-light red darken-4"
         onClick={this.onClickCancelLaunch}>
        <i className="material-icons">clear</i>
      </a>;
    if (this.state.isLaunchActive) {
      return (
        <div>
          <div className="row">
            {this.renderRegionsSelectTotal()}
            <div className="input-field col s6">
              <input onChange={this.handleChangeCountry} defaultValue={this.state.countrySelected} name='country'
                     id='country' type="text" autoComplete="off"/>
              <label htmlFor="country">Country</label>
            </div>
          </div>
          <div className="row">
            <div className="input-field col s6">
              <input onChange={this.handleChangeCity} defaultValue={this.state.citySelected} name='city' id='city'
                     type="text" autoComplete="off"/>
              <label htmlFor="city">City</label>
            </div>
            <div className="input-field col s6">
              <a title="Launch App" style={style} className="btn-floating waves-effect waves-light"
                 onClick={this.onLaunchApp}>
                <i className="material-icons">send</i>
              </a>
              {cancelButton}
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="row">
          <div className="col s12">
            <button disabled={this.state.appPackage.id === 0} style={style}
                    className="waves-effect waves-light btn-small" onClick={this.onClickLaunch}>
              Launch
            </button>
          </div>
        </div>
      );
    }
  };

  onClickEdit = () => {
    const setEdit = !this.state.isEdit;
    if (!setEdit && this.state.appPackage.id === 0) {
      this.props.updateNewApp(true);
    }
    this.setState({ isEdit: setEdit });
  };

  onClickRemove = () => {
    deleteData(
      `http://localhostapps/${this.state.appPackage.id}`,
      () => {
        M.toast({ html: '<div>App deleted successfully!</div>' });
        this.props.onRemove();
      });
  };

  onLaunchApp = () => {
    postData(
      `http://localhostcontainers/app/${this.state.appPackage.id}`, //TODO confirm link
      {
        region: this.state.regionSelected,
        country: this.state.countrySelected,
        city: this.state.citySelected
      },
      data => {
        console.log(data);
        M.toast({ html: '<div>App launched successfully!</div>' });
        this.onClickCancelLaunch();
      });
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  onSubmitForm = event => {
    event.preventDefault();
    postData(
      `http://localhostapps/${this.state.appPackage.id}`,
      event.target[0].value,
      data => {
        //TODO wtf?
        const newData = this.state.appPackage;
        const oldId = newData.id;
        newData.id = data;
        this.setState({ appPackage: newData, isEdit: false });
        if (oldId === 0) {
          this.props.updateNewApp(false);
        }
        M.toast({ html: '<div>App saved successfully!</div>' });
      });
  };

  renderForm = () => (
    <form id={this.state.appPackage.id + 'appForm'} onSubmit={this.onSubmitForm}>
      <div className="input-field">
        <input value={this.state.appPackage.appName} onChange={this.handleChange} placeholder='App Name'
               name='appName' id={this.state.appPackage.id + 'appName'} type="text" autoComplete="off"/>
        <label htmlFor={this.state.appPackage.id + 'hostname'}>App Name</label>
      </div>
      <button className="btn waves-effect waves-light" type="submit" name="action">
        Save
        <i className="material-icons right">send</i>
      </button>
    </form>
  );

  render = () => {
    let appServices;
    if (this.state.data) {
      appServices = this.state.data.map(function (appService) {
        return (
          <li key={appService.service.id}>
            <div className="collapsible-header">{appService.service.serviceName}</div>
            <div className="collapsible-body">
              <ServiceCard renderSimple={true} service={appService.service}/>
            </div>
          </li>
        );
      });
    }
    const app = this.state.isEdit ? this.renderForm() : this.renderNormal();
    const style = { marginLeft: '5px' };
    return (
      <div id={'app' + this.props.index} className='row'>
        <div className='col s12'>
          <div className='card'>
            <div className='card-content'>
              <div className="right-align">
                {this.renderLaunchApp()}
                <a style={style} className="waves-effect waves-light btn-small"
                   onClick={this.onClickEdit}>{this.state.isEdit ? 'Cancel' : 'Edit'}</a>
                <button disabled={this.state.appPackage.id === 0} style={style}
                        className="waves-effect waves-light btn-small red darken-4" onClick={this.onClickRemove}>Remove
                </button>
              </div>
              {app}
              <h5>Services</h5>
              <ul className="collapsible">
                {appServices}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  };
}
