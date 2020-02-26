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
import { Link } from 'react-router-dom';
import CardItem from '../../components/list/CardItem';
import {deleteData} from "../../utils/api";

export default class ContainerSimulatedMetricsCard extends React.Component {
  onClickRemove = () => {
    deleteData(
      `http://localhostmetrics/simulated/containers/${this.props.simulatedMetric.id}`,
      data => {
        M.toast({ html: '<div>Container simulated metric removed successfully!</div>' });
        this.props.reloadSimulatedMetrics();
      });
  };

  render() {
    const style = {marginLeft: '10px'};
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
                          to={'/metrics/simulated/containers/metric/' + this.props.simulatedMetric.id}>Edit</Link>
                    <button style={style} className="waves-effect waves-light btn-small red darken-4"
                            onClick={this.onClickRemove}>Remove
                    </button>
                  </div>
                </div>
              </div>
              <CardItem label='Container id' value={this.props.simulatedMetric.containerId}/>
              <CardItem label='Field' value={this.props.simulatedMetric.field}/>
              <CardItem label='Minimum value' value={this.props.simulatedMetric.minValue}/>
              <CardItem label='Maximum value' value={this.props.simulatedMetric.maxValue}/>
              <CardItem label='Override' value={override}/>
            </div>
          </div>
        </div>
      </div>
    );
  };
}
