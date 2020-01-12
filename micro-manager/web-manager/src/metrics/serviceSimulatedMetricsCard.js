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
import M from 'materialize-css';
import { Link } from 'react-router-dom';
import { CardItem } from '../sharedComponents/cardItem';

export class ServiceSimulatedMetricsCard extends React.Component {
  onClickRemove () {
    const action = '/simulatedMetrics/services/' + this.props.simulatedMetric.id;
    const self = this;
    Utils.formSubmit(action, 'DELETE', {}, function (data) {
      M.toast({ html: '<div>Service simulated metric removed successfully!</div>' });
      self.props.reloadSimulatedMetrics();
    });
  };

  render () {
    const style = { marginLeft: '10px' };
    const override = '' + this.props.simulatedMetric.override;
    return (
      <div className='row'>
        <div className='col s12'>
          <div className='card'>
            <div className='card-content'>
              <div className="right-align">
                <div className="row">
                  <div className="col s12">
                    <Link className="waves-effect waves-light btn-small"
                      to={'/ui/simulatedmetrics/services/detail/' + this.props.simulatedMetric.id}>Edit</Link>
                    <button style={style} className="waves-effect waves-light btn-small red darken-4"
                      onClick={this.onClickRemove}>Remove
                    </button>
                  </div>
                </div>
              </div>
              <CardItem label='Service' value={this.props.simulatedMetric.serviceName}/>
              <CardItem label='Field' value={this.props.simulatedMetric.field}/>
              <CardItem label='Minimum value' value={this.props.simulatedMetric.minValue}/>
              <CardItem label='Maximum value' value={this.props.simulatedMetric.maxValue}/>
              <CardItem label='Override' value={override}/>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
