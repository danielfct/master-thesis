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
import { Link } from 'react-router-dom';
import M from 'materialize-css';
import Utils from '../../utils';
import MainLayout from '../shared/MainLayout';
import ServiceEventPredictionCard from './ServiceEventPredictionCard';

export default class ServiceEventPredictions extends React.Component {
  constructor (props) {
    super(props);
    this.state = { data: [], loading: false, showAdd: true };
  }

  componentDidMount = () => {
    this.loadServiceEventPredictions();
    const instances = M.Tooltip.init(document.querySelectorAll('.tooltipped'));
    this.setState({ tooltipInstances: instances });
  };

  componentWillUnmount = () => {
    this.state.tooltipInstances[0].destroy();
  };

  loadServiceEventPredictions = () => {
    this.setState({ loading: true });
    Utils.ajaxGet(
      'localhost/services/eventPredictions',
      data => this.setState({ data: data, loading: false })
    );
  };

  renderServiceEvents = () => {
    let serviceEventsNodes;
    if (this.state.data) {
      serviceEventsNodes = this.state.data.map((serviceEvent, index) => (
        <ServiceEventPredictionCard key={serviceEvent.id} serviceEvent={serviceEvent}
                                    reloadServiceEvents={this.loadServiceEventPredictions}/>
      ));
    }
    return serviceEventsNodes;
  };

  render = () => (
    <MainLayout title='Service event predictions'>
      {this.renderServiceEvents()}
      <div className="fixed-action-btn tooltipped" data-position="left" data-tooltip="Add service event prediction">
        <Link className="waves-effect waves-light btn-floating btn-large grey darken-4"
              to='/ui/rules/serviceeventpredictions/detail'>
          <i className="large material-icons">add</i>
        </Link>
      </div>
    </MainLayout>
  );
}
