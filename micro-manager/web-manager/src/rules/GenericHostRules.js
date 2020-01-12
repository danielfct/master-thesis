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

export default class GenericHostRules extends React.Component {
  constructor (props) {
    super(props);
    this.state = { genericHostRules: [], loading: false };
  }

  componentDidMount () {
    this.loadGenericHostRules();
  }

  loadGenericHostRules () {
    this.setState({ loading: true });
    const self = this;
    Utils.ajaxGet('/hosts/genericRules',
      function (data) {
        self.setState({ genericHostRules: data, loading: false });
      });
  };

  renderGenericHostRules () {
    let genericHostRulesNodes;
    if (this.state.genericHostRules) {
      genericHostRulesNodes = this.state.genericHostRules.map(function (genericHostRule) {
        return (
          <div key={genericHostRule.id} className='row'>
            <div className='col s12'>
              <div className='card'>
                <div className='card-content'>
                  {genericHostRule.rule.ruleName}
                </div>
              </div>
            </div>
          </div>
        );
      });
    }
    return genericHostRulesNodes;
  }

  render () {
    return (
      <div>
        {this.renderGenericHostRules()}
      </div>
    );
  }
}
