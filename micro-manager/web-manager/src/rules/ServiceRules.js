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

export default class ServiceRules extends React.Component {
  constructor (props) {
    super(props);
    this.state = { serviceRules: [], loading: false };
  }

  componentDidMount () {
    this.loadServiceRules();
  }

  loadServiceRules () {
    this.setState({ loading: true });
    const self = this;
    Utils.ajaxGet('/services/' + self.props.service.id + '/rules', // TODO confirm
      function (data) {
        self.setState({ serviceRules: data, loading: false });
      });
  };

  renderServiceRules () {
    let serviceRulesNodes;
    if (this.state.serviceRules) {
      serviceRulesNodes = this.state.serviceRules.map(function (serviceRule) {
        return (
          <div key={serviceRule.rule.id}>
            <div className='card'>
              <div className='card-content'>
                {serviceRule.rule.ruleName}
              </div>
            </div>
          </div>
        );
      });
    }
    return serviceRulesNodes;
  }

  render () {
    return (
      <div>
        <h5>Rules</h5>
        {this.renderServiceRules()}
      </div>
    );
  }
}
