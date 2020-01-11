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
import { Link, Redirect } from 'react-router-dom';
import M from 'materialize-css';
import $ from 'jquery';
import Utils from '../utils';
import { MainLayout } from '../sharedComponents/mainLayout';
import { CardItem } from '../sharedComponents/cardItem';

class NodeCard extends React.Component {
  constructor (props) {
    super(props);
  }

    onClickStop = () => {
      const action = '/api/nodes';
      const dataObject = {
        hostname: this.props.node.hostname
      };
      const dataToSend = JSON.stringify(dataObject);
      const self = this;
      Utils.formSubmit(action, 'DELETE', dataToSend, function (data) {
        M.toast({ html: '<div>Node removed successfully!</div>' });
        self.props.reloadNodes();
      });
    };

    render () {
      return (
        <div className='row'>
          <div className='col s12'>
            <div className='card'>
              <div className='card-content'>
                <div className="right-align">
                  <div className="row">
                    <div className="col s12">
                      <button disabled={this.props.node.role === 'manager'}
                        className="waves-effect waves-light btn-small red darken-4"
                        onClick={this.onClickStop}>Remove node</button>
                    </div>
                  </div>
                </div>
                <CardItem label='Id' value={this.props.node.id}/>
                <CardItem label='Hostname' value={this.props.node.hostname}/>
                <CardItem label='Role' value={this.props.node.role}/>
                <CardItem label='State' value={this.props.node.state}/>
              </div>
            </div>
          </div>
        </div>
      );
    }
}

export class Nodes extends React.Component {
  constructor (props) {
    super(props);
    this.state = { data: [], loading: false };
  }

  componentDidMount () {
    this.loadNodes();
    const instances = M.Tooltip.init(document.querySelectorAll('.tooltipped'));
    this.setState({ tooltipInstances: instances });
  }

  componentWillUnmount () {
    this.state.tooltipInstances[0].destroy();
  }

    loadNodes = () => {
      this.setState({ loading: true });
      const self = this;
      Utils.ajaxGet('/nodes',
        function (data) {
          self.setState({ data: data, loading: false });
        });
    };

    render () {
      let nodes;
      const self = this;
      if (this.state.data) {
        nodes = this.state.data.map(function (node) {
          return (
            <NodeCard key={node.id} node={node} reloadNodes={self.loadNodes}/>
          );
        });
      }
      return (
        <MainLayout title='Nodes'>
          <div className="fixed-action-btn tooltipped" data-position="left" data-tooltip="Add node">
            <Link className="waves-effect waves-light btn-floating btn-large grey darken-4" to='/ui/nodes/add'>
              <i className="large material-icons">add</i>
            </Link>
          </div>
          {nodes}
        </MainLayout>
      );
    }
}

export class AddNode extends React.Component {
  constructor (props) {
    super(props);
    const defaultValues = {
      region: '', country: '', city: '', quantity: 1
    };
    const thisBreadcrumbs = [{ link: '/ui/nodes', title: 'Nodes' }];
    this.state = { breadcrumbs: thisBreadcrumbs, loading: false, values: defaultValues, availableRegions: [], formSubmit: false };
  }

  componentDidMount () {
    this.loadRegions();
  }

  componentDidUpdate () {
    M.FormSelect.init(document.querySelectorAll('select'));
  }

    loadRegions = () => {
      this.setState({ loading: true });
      const self = this;
      Utils.ajaxGet('/regions',
        function (data) {
          self.setState({ availableRegions: data, loading: false });
        });
    };

    renderRegionsSelect = () => {
      let regions;
      if (this.state.availableRegions) {
        regions = this.state.availableRegions.map(function (region) {
          return (
            <option key={region.regionName} value={region.regionName}>{region.regionName + ' (' + region.regionDescription + ')'}</option>
          );
        });
        return regions;
      }
    };

    onSubmitForm = (event) => {
      event.preventDefault();
      const formAction = '/nodes';
      const formData = Utils.convertFormToJson('form-node');
      const self = this;
      Utils.formSubmit(formAction, 'POST', formData, function (data) {
        self.setState({ formSubmit: true });
        const nodes = data.toString();
        M.toast({ html: '<div>New nodes added successfully!</br>Nodes: ' + nodes + '</div>' });
      });
    };

    renderForm = () => {
      const regionSelect = this.renderRegionsSelect();
      return (
        <form id="form-node" onSubmit={this.onSubmitForm}>
          <div className="input-field col s12">
            <select defaultValue={this.state.values.region} name="region" id="region" >
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
            <input defaultValue={this.state.values.quantity} type="number" name="quantity" id="quantity" autoComplete="off"/>
            <label htmlFor="quantity">Quantity</label>
          </div>
          <button className="btn waves-effect waves-light" type="submit" name="action">
                    Add
            <i className="material-icons right">send</i>
          </button>
        </form>
      );
    };

    render () {
      if (this.state.formSubmit) {
        return <Redirect to='/ui/nodes' />;
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
