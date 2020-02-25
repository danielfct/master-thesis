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
import { Link } from 'react-router-dom';
import CardItem from '../shared/list/CardItem';
import HostRules from './HostRules';
import MainLayout from '../shared/MainLayout';
import {getData} from "../../utils/api";

export default class HostsRulesList extends React.Component {
  constructor (props) {
    super(props);
    this.state = { hosts: [], loading: false };
    this.loadHosts = this.loadHosts.bind(this);
    this.renderHosts = this.renderHosts.bind(this);
  }

  componentDidMount() {
    this.loadHosts();
  };

  loadHosts = () => {
    this.setState({ loading: true });
    getData(
      'http://localhosthosts',
      data => this.setState({ hosts: data, loading: false })
    );
  };

  renderHosts = () => {
    let hostNodes;
    if (this.state.hosts) {
      hostNodes = this.state.hosts.map(function (host) {
        return (
          <div key={host.hostname} className='row'>
            <div className='col s12'>
              <div className='card'>
                <div className='card-content'>
                  <div className="right-align">
                    <div className="row">
                      <div className="col s12">
                        <Link className="waves-effect waves-light btn-small"
                              to={'/ui/rules/hosts/host/' + host.hostname}>
                          View details
                        </Link>
                      </div>
                    </div>
                  </div>
                  <CardItem label='Host' value={host.hostname}/>
                  <HostRules host={host}/>
                </div>
              </div>
            </div>
          </div>
        );
      });
    }
    return hostNodes;
  };
/*<MainLayout title={{title:'Host rules management'}}>*/
  render = () => (
<MainLayout>
      {this.renderHosts()}
    </MainLayout>
  );
}
