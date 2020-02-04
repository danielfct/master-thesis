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
import CardItem from '../shared/CardItem';
import {deleteData} from "../../utils/data";

export default class ServiceEventPredictionCard extends React.Component {
  onClickRemove = () => {
    deleteData(
      `http://localhostservices/eventPredictions/${this.props.serviceEvent.id}`,
      () => {
        M.toast({ html: '<div>IService event prediction removed successfully!</div>' });
        this.props.reloadServiceEvents();
      });
  };

  render = () => {
    const startDate = new Date(this.props.serviceEvent.startDate).toLocaleString();
    const endDate = new Date(this.props.serviceEvent.endDate).toLocaleString();
    return (
      <div className='row'>
        <div className='col s12'>
          <div className='card'>
            <div className='card-content'>
              <div className="right-align">
                <div className="row">
                  <div className="col s12">
                    <button className="waves-effect waves-light btn-small red darken-4"
                            onClick={this.onClickRemove}>Remove
                    </button>
                  </div>
                </div>
              </div>
              <CardItem label='Description' value={this.props.serviceEvent.description}/>
              <CardItem label='Service config' value={this.props.serviceEvent.service.serviceName}/>
              <CardItem label='Start date' value={startDate}/>
              <CardItem label='End date' value={endDate}/>
              <CardItem label='Minimum replics' value={this.props.serviceEvent.minReplics}/>
            </div>
          </div>
        </div>
      </div>
    );
  };
}
