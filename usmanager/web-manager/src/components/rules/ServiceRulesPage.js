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
import MainLayout from '../shared/MainLayout';
import {deleteData, getData, postData} from "../../utils/data";

export default class ServiceRulesPage extends React.Component {
  constructor (props) {
    super(props);
    let thisServiceId = 0;
    if (props.match.params.serviceId) {
      thisServiceId = props.match.params.serviceId;
    }
    const thisBreadcrumbs = [{ link: '/rules/services', title: 'Services rules' }];
    this.state = {
      breadcrumbs: thisBreadcrumbs,
      serviceId: thisServiceId,
      service: {},
      rules: [],
      allRules: [],
      loadedRules: false,
      loading: false
    };
  }

  componentDidMount = () => {
    this.loadService();
    this.loadServiceRules();
    this.loadAllRules();
  };

  componentDidUpdate = () => {
    M.updateTextFields();
  };

  loadService = () => {
    getData(
      `http://localhostservices/${this.state.serviceId}`,
      data => this.setState({ service: data, loading: false })
    );
  };

  loadServiceRules = () => {
    this.setState({ loadedRules: false, loading: true });
    getData(
      `http://localhostservices/${this.state.serviceId}/rules`,
      data => this.setState({ rules: data, loadedRules: true, loading: false })
    );
  };

  loadAllRules = () => {
    this.setState({ loading: true });
    getData(
      'http://localhost/rules/containers',
      data => this.setState({ allRules: data, loading: false })
    );
  };

  onRemoveRule = (ruleId, event) => {
    deleteData(
      `http://localhostservices/${this.state.serviceId}/rules/${ruleId}`,
      () => {
        M.toast({ html: '<div>Rule successfully deleted from service rules!</div>' });
        this.loadServiceRules();
      });
  };

  addRule = (ruleId, event) => {
    postData(`http://localhostservices/${this.state.serviceId}/rules`,
      {
        ruleId
      },
      data => {
        M.toast({ html: '<div>Rule successfully added to service rules!</div>' });
        this.loadServiceRules();
      });
  };

  renderRules = () => {
    let rulesNodes;
    const style = { marginTop: '-4px' };
    if (this.state.rules) {
      rulesNodes = this.state.rules.map(serviceRule => (
        <li key={serviceRule.rule.id} className="collection-item">
          <div>
            {serviceRule.rule.ruleName}
            <a style={style} className="secondary-content btn-floating btn-small waves-effect waves-light"
               onClick={(e) => this.onRemoveRule(serviceRule.rule.id, e)}>
              <i className="material-icons">clear</i>
            </a>
          </div>
        </li>
      ));
    }
    return rulesNodes;
  };

  renderAddRules = () => {
    let ruleNodes;
    const style = { marginTop: '-4px' };
    //TODO fix code
    const canAddRule = ruleId => {
      for (let i = 0; i < this.state.rules.length; i++) {
        if (this.state.rules[i].rule.id === ruleId) {
          return false;
        }
      }
      return true;
    };

    if (this.state.allRules && this.state.loadedRules) {
      ruleNodes = this.state.allRules.map(rule => {
        if (canAddRule(rule.id)) {
          return (
            <li key={rule.id} className="collection-item">
              <div>
                {rule.ruleName}
                <a style={style} className="secondary-content btn-floating btn-small waves-effect waves-light"
                   onClick={(e) => this.addRule(rule.id, e)}>
                  <i className="material-icons">add</i>
                </a>
              </div>
            </li>
          );
        }
      });
    }
    return (
      <ul className="collection">
        {ruleNodes}
      </ul>
    );
  };
/*<MainLayout title={{title:'Service rules detail'}}>*/
  render = () => (

      <MainLayout>
      <div className='row'>
        <div className="input-field col s12">
          <input disabled={true} value={this.state.service.serviceName} name="serviceName" id="serviceName"
                 type="text"/>
          <label htmlFor="serviceName">Service name</label>
        </div>
        <div>
          <h5>Rules</h5>
          <ul className="collection">
            {this.renderRules()}
          </ul>
          <br/>
          <h5>Add rules</h5>
          {this.renderAddRules()}
        </div>
      </div>
    </MainLayout>
  );
}
