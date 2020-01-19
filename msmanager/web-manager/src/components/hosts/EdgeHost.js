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
import M from 'materialize-css';
import $ from 'jquery';
import MainLayout from '../shared/MainLayout';
import EdgeHostCard from './EdgeHostCard';
import {getData} from "../../utils/data";

export default class EdgeHosts extends React.Component {
  constructor (props) {
    super(props);
    this.state = { data: [], loading: false, showAdd: true };
  }

  componentDidUpdate = () => {
    if (this.state.data && this.state.data.length > 0) {
      const lastIndex = this.state.data.length - 1;
      if (this.state.data[lastIndex].id === 0) {
        const offset = $('#edgehost' + lastIndex).offset().top;
        $(window).scrollTop(offset);
        this.state.tooltipInstances[0].destroy();
      }
    }
  };

  componentDidMount = () => {
    this.loadHosts();
    const instances = M.Tooltip.init(document.querySelectorAll('.tooltipped'));
    this.setState({ tooltipInstances: instances });
  };

  componentWillUnmount = () => {
    this.state.tooltipInstances[0].destroy();
  };

  updateNewEdgeHost = isCancel => {
    const newData = this.state.data;
    if (isCancel) {
      newData.splice(newData.length - 1, 1);
      this.setState({ data: newData, showAdd: true });
    } else {
      this.setState({ showAdd: true });
    }
    const instances = M.Tooltip.init(document.querySelectorAll('.tooltipped'));
    this.setState({ tooltipInstances: instances });
  };

  addEdgeHost = () => {
    const newEdgeHost = {
      id: 0,
      hostname: '',
      sshUsername: '',
      sshPassword: '',
      region: '',
      country: '',
      city: '',
      local: ''
    };
    const newData = this.state.data;
    newData.push(newEdgeHost);
    this.setState({ data: newData, showAdd: false });
  };

  loadHosts = () => {
    this.setState({ loading: true });
    getData(
      'http://localhosthosts/edge',
      data =>
        this.setState({ data: data, loading: false })
    );
  };

  render = () => {
    let edgeHostsNodes;
    if (this.state.data) {
      edgeHostsNodes = this.state.data.map((edgeHost, index) => (
        <EdgeHostCard key={index} index={index} edgeHost={edgeHost} updateNewEdgeHost={this.updateNewEdgeHost}
                      onRemove={this.loadHosts}/>
      ));
    }
    return (
      <MainLayout title='Edge hosts'>
        {edgeHostsNodes}
        <div className="fixed-action-btn tooltipped" data-position="left" data-tooltip="Add edge host">
          <button disabled={!this.state.showAdd}
                  className="waves-effect waves-light btn-floating grey darken-3"
                  onClick={this.addEdgeHost}>
            <i className="large material-icons">add</i>
          </button>
        </div>
      </MainLayout>
    );
  };
}
