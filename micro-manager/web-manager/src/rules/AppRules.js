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
import Utils from '../utils';

export default class AppRules extends React.Component {
  constructor (props) {
    super(props);
    this.state = { appRules: [], loading: false };
  }

  componentDidMount () {
    this.loadAppRules();
  }

  loadAppRules () {
    this.setState({ loading: true });
    const self = this;
    Utils.ajaxGet('/apps/' + self.props.app.id + '/rules',
      function (data) {
        self.setState({ appRules: data, loading: false });
      });
  };

  renderAppRules () {
    let appRulesNodes;
    if (this.state.appRules) {
      appRulesNodes = this.state.appRules.map(function (appRule) {
        return (
          <div key={appRule.rule.id}>
            <div className='card'>
              <div className='card-content'>
                {appRule.rule.ruleName}
              </div>
            </div>
          </div>
        );
      });
    }
    return appRulesNodes;
  };

  render () {
    return (
      <div>
        <h5>Rules</h5>
        {this.renderAppRules()}
      </div>
    );
  }
}
