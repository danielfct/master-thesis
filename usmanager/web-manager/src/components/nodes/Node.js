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
import {Link} from 'react-router-dom';
import M from 'materialize-css';
import MainLayout from '../shared/MainLayout';
import NodeCard from './NodeCard';
import {getData} from "../../utils/rest";

export default class Nodes extends React.Component {
  constructor (props) {
    super(props);
    this.state = { data: [], loading: false };
  }

  componentDidMount = () => {
    this.loadNodes();
    const instances = M.Tooltip.init(document.querySelectorAll('.tooltipped'));
    this.setState({ tooltipInstances: instances });
  };

  componentWillUnmount = () => {
    this.state.tooltipInstances[0].destroy();
  };

  loadNodes = () => {
    this.setState({ loading: true });
    getData(
      'http://localhostnodes',
      data => this.setState({ data: data, loading: false })
    );
  };

  render = () => {
    let nodes;
    if (this.state.data) {
      nodes = this.state.data.map(node => (
        <NodeCard key={node.id} node={node} reloadNodes={this.loadNodes}/>
      ));
    }
{/*    <MainLayout title={{title:'Nodes'}}>*/}
    return (
      <MainLayout>
        <div className="fixed-action-btn tooltipped" data-position="left" data-tooltip="Add node">
          <Link className="waves-effect waves-light btn-floating grey darken-3" to='/nodes/add'>
            <i className="large material-icons">add</i>
          </Link>
        </div>
        {nodes}
      </MainLayout>
    );
  };
}