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
import M from "materialize-css";
import Utils from '../utils';
import MainLayout from "../sharedComponents/MainLayout";
import {Redirect} from "react-router";

export default class AddNode extends React.Component {
  constructor(props) {
    super(props);
    const defaultValues = {
      region: '', country: '', city: '', quantity: 1
    };
    const thisBreadcrumbs = [{link: '/ui/nodes', title: 'Nodes'}];
    this.state = {
      breadcrumbs: thisBreadcrumbs,
      loading: false,
      values: defaultValues,
      availableRegions: [],
      formSubmit: false
    };
  }

  componentDidMount() {
    this.loadRegions();
  }

  componentDidUpdate() {
    M.FormSelect.init(document.querySelectorAll('select'));
  }

  loadRegions() {
    this.setState({loading: true});
    const self = this;
    Utils.ajaxGet('/regions',
      function (data) {
        self.setState({availableRegions: data, loading: false});
      });
  };

  renderRegionsSelect() {
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

  onSubmitForm(event) {
    event.preventDefault();
    const formAction = '/nodes';
    const formData = Utils.convertFormToJson('form-node');
    const self = this;
    Utils.formSubmit(formAction, 'POST', formData, function (data) {
      self.setState({formSubmit: true});
      const nodes = data.toString();
      M.toast({html: '<div>New nodes added successfully!</br>Nodes: ' + nodes + '</div>'});
    });
  };

  renderForm() {
    const regionSelect = this.renderRegionsSelect();
    return (
      <form id="form-node" onSubmit={this.onSubmitForm}>
        <div className="input-field col s12">
          <select defaultValue={this.state.values.region} name="region" id="region">
            <option value="" disabled="disabled">Choose region</option>
            {regionSelect}
          </select>
          <label htmlFor="region">Region</label>
        </div>
        <div className="input-field col s12">
          <input defaultValue={this.state.values.country} type="text" name="country" id="country" autoComplete="off"/>
          <label htmlFor="country">Country</label>
        </div>
        <div className="input-field col s12">
          <input defaultValue={this.state.values.city} type="text" name="city" id="city" autoComplete="off"/>
          <label htmlFor="city">City</label>
        </div>
        <div className="input-field col s12">
          <input defaultValue={this.state.values.quantity} type="number" name="quantity" id="quantity"
                 autoComplete="off"/>
          <label htmlFor="quantity">Quantity</label>
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
      return <Redirect to='/ui/nodes'/>;
    }
    return (
      <MainLayout title='Add node' breadcrumbs={this.state.breadcrumbs}>
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