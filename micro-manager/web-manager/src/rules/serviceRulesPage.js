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
import { MainLayout } from '../sharedComponents/mainLayout';

export class ServiceRulesPage extends React.Component {
  constructor (props) {
    super(props);
    let thisServiceId = 0;
    if (props.match.params.serviceId) {
      thisServiceId = props.match.params.serviceId;
    }
    const thisBreadcrumbs = [{ link: '/ui/rules/services', title: 'Services rules' }];
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

  componentDidMount () {
    this.loadService();
    this.loadServiceRules();
    this.loadAllRules();
  }

  componentDidUpdate () {
    M.updateTextFields();
  }

  loadService () {
    const self = this;
    Utils.ajaxGet('/services/' + self.state.serviceId,
      function (data) {
        self.setState({ service: data, loading: false });
      });
  };

  loadServiceRules () {
    this.setState({ loadedRules: false, loading: true });
    const self = this;
    Utils.ajaxGet('/services/' + self.state.serviceId + '/rules',
      function (data) {
        self.setState({ rules: data, loadedRules: true, loading: false });
      });
  };

  loadAllRules () {
    this.setState({ loading: true });
    const self = this;
    Utils.ajaxGet('/rules/container',
      function (data) {
        self.setState({ allRules: data, loading: false });
      });
  }

  onRemoveRule (ruleId, event) {
    const formAction = '/services/' + this.state.serviceId + '/rules';
    const self = this;
    const data = {
      serviceId: Number(self.state.serviceId),
      ruleId: Number(ruleId)
    };
    Utils.formSubmit(formAction, 'DELETE', JSON.stringify(data), function (data) {
      M.toast({ html: '<div>Rule successfully deleted from service rules!</div>' });
      self.loadServiceRules();
    });
  };

  addRule (ruleId, event) {
    const formAction = '/services/' + this.state.serviceId + '/rules';
    const self = this;
    const data = {
      serviceId: Number(self.state.serviceId),
      ruleId: Number(ruleId)
    };
    Utils.formSubmit(formAction, 'POST', JSON.stringify(data), function (data) {
      M.toast({ html: '<div>Rule successfully added to service rules!</div>' });
      self.loadServiceRules();
    });
  };

  renderRules () {
    let rulesNodes;
    const self = this;
    const style = { marginTop: '-4px' };
    if (this.state.rules) {
      rulesNodes = this.state.rules.map(function (serviceRule) {
        return (
          <li key={serviceRule.rule.id} className="collection-item">
            <div>
              {serviceRule.rule.ruleName}
              <a style={style} className="secondary-content btn-floating btn-small waves-effect waves-light"
                onClick={(e) => self.onRemoveRule(serviceRule.rule.id, e)}>
                <i className="material-icons">clear</i>
              </a>
            </div>
          </li>
        );
      });
    }
    return rulesNodes;
  };

  renderAddRules () {
    let ruleNodes;
    const style = { marginTop: '-4px' };
    const self = this;

    function canAddRule (ruleId) {
      for (let i = 0; i < self.state.rules.length; i++) {
        if (self.state.rules[i].rule.id === ruleId) {
          return false;
        }
      }
      return true;
    }

    if (this.state.allRules && this.state.loadedRules) {
      ruleNodes = this.state.allRules.map(function (rule) {
        if (canAddRule(rule.id)) {
          return (
            <li key={rule.id} className="collection-item">
              <div>
                {rule.ruleName}
                <a style={style} className="secondary-content btn-floating btn-small waves-effect waves-light"
                  onClick={(e) => self.addRule(rule.id, e)}>
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

  render () {
    return (
      <MainLayout title='Service rules detail' breadcrumbs={this.state.breadcrumbs}>
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
}
