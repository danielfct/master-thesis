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
import {deleteData, getData, postData} from "../../utils/rest";

export default class AppRulesPage extends React.Component {
  constructor (props) {
    super(props);
    let thisAppId = 0;
    if (props.match.params.appId) {
      thisAppId = props.match.params.appId;
    }
    const thisBreadcrumbs = [{ link: '/rules/apps', title: 'Apps rules' }];
    this.state = {
      breadcrumbs: thisBreadcrumbs,
      appId: thisAppId,
      app: {},
      rules: [],
      allRules: [],
      loadedRules: false,
      loading: false
    };
  }

  componentDidMount = () => {
    this.loadApp();
    this.loadAppRules();
    this.loadAllRules();
  };

  componentDidUpdate = () => {
    M.updateTextFields();
  };

  loadApp = () => {
    getData(
      `http://localhostapps/${this.state.appId}`,
      data => this.setState({ app: data, loading: false })
    );
  };

  loadAppRules = () => {
    this.setState({ loadedRules: false, loading: true });
    getData(
      `http://localhostapps/${this.state.appId}/rules`,
      data => this.setState({ rules: data, loadedRules: true, loading: false })
    );
  };

  loadAllRules = () => {
    this.setState({ loading: true });
    getData(
      'http://localhostrules/containers',
      data => this.setState({ allRules: data, loading: false })
    );
  };

  onRemoveRule = (ruleId, event) => {
    deleteData(
      `http://localhostapps/${this.state.appId}/rules/${ruleId}`,
      data => {
        M.toast({ html: '<div>Rule successfully deleted from app rules!</div>' });
        this.loadAppRules();
      });
  };

  addRule = (ruleId, event) => {
    postData(
      `http://localhostapps/${this.state.appId}/rules`,
      {
        appId: Number(this.state.appId), //TODO remove appId from server too
        ruleId: Number(ruleId)
      },
      data => {
        M.toast({ html: '<div>Rule successfully added to app rules!</div>' });
        this.loadAppRules();
      });
  };

  renderRules = () => {
    let rulesNodes;
    const style = { marginTop: '-4px' };
    if (this.state.rules) {
      rulesNodes = this.state.rules.map(appRule => (
        <li key={appRule.rule.id} className="collection-item">
          <div>
            {appRule.rule.ruleName}
            <a style={style} className="secondary-content btn-floating btn-small waves-effect waves-light"
               onClick={(e) => this.onRemoveRule(appRule.rule.id, e)}>
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

/*<MainLayout title={{title:'App rules detail'}}>*/
  render = () => (
  <MainLayout>
      <div className='row'>
        <div className="input-field col s12">
          <input disabled={true} value={this.state.app.appName} name="appName" id="appName" type="text"/>
          <label htmlFor="appName">App name</label>
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
