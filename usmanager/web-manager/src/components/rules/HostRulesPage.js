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

export default class HostRulesPage extends React.Component {
  constructor (props) {
    super(props);
    let thisHostname = '';
    if (props.match.params.hostname) {
      thisHostname = props.match.params.hostname;
    }
    const thisBreadcrumbs = [{ link: '/rules/hosts', title: 'Hosts rules' }];
    this.state = {
      breadcrumbs: thisBreadcrumbs,
      hostname: thisHostname,
      rules: [],
      allRules: [],
      loadedRules: false,
      loading: false
    };
  }

  componentDidMount = () => {
    this.loadHostRules();
    this.loadAllRules();
  };

  componentDidUpdate = () => {
    M.updateTextFields();
  };

  loadHostRules = () => {
    this.setState({ loadedRules: false, loading: true });
    getData(
      `http://localhosthosts/${this.state.hostname}/rules`,
      data => this.setState({ rules: data, loadedRules: true, loading: false })
    );
  };

  loadAllRules = () => {
    this.setState({ loading: true });
    getData(
      'http://localhostrules/hosts',
      data => this.setState({ allRules: data, loading: false })
    );
  };

  onRemoveRule = (ruleId, event) => {
    const data = {
      hostname: this.state.hostname,
      ruleId: Number(ruleId)
    };
    deleteData(
      `http://localhosthosts/${this.state.hostname}/rules/`, JSON.stringify(data),
      data => {
        M.toast({ html: '<div>Rule successfully deleted from hosts rules!</div>' });
        this.loadHostRules();
      });
  };

  addRule = (ruleId, event) => {
    postData(
      `/hosts/${this.state.hostname}/rules`,
      {
        ruleId
      },
      data => {
        M.toast({ html: '<div>Rule successfully added to host rules!</div>' });
        this.loadHostRules();
      });
  };

  renderRules = () => {
    let rulesNodes;
    const style = { marginTop: '-4px' };
    if (this.state.rules) {
      rulesNodes = this.state.rules.map(hostRule => (
        <li key={hostRule.rule.id} className="collection-item">
          <div>
            {hostRule.rule.ruleName}
            <a style={style} className="secondary-content btn-floating btn-small waves-effect waves-light"
               onClick={(e) => this.onRemoveRule(hostRule.rule.id, e)}>
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
/*<MainLayout title={{title:'Host detail'}}>*/
  render = () => (
<MainLayout>
      <div className='row'>
        <div className="input-field col s12">
          <input disabled={true} value={this.state.hostname} name="hostname" id="hostname" type="text"/>
          <label htmlFor="hostname">Hostname</label>
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
