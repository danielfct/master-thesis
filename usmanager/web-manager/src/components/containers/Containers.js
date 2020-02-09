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
import M from 'materialize-css';
import $ from 'jquery';
import MainLayout from '../shared/MainLayout';
import ContainerCard from './ContainerCard';
import {getData} from "../../utils/rest";

export default class Containers extends React.Component {

  constructor (props) {
    super(props);
    this.state = { data: [], filtContainers: [], filter: '', loading: false };
  }

  componentDidMount = () => {
    this.loadContainers();
    const instances = M.Tooltip.init(document.querySelectorAll('.tooltipped'));
    this.setState({ tooltipInstances: instances });
  };

  componentWillUnmount = () =>
    this.state.tooltipInstances[0].destroy();

  onReplicate = () =>
    this.loadContainers();

  onChangeFilter = ({target:{value}}) =>
    this.setState({ filter: value }, () => this.applyFilter());

  applyFilter = () =>
    this.setState({ filtContainers: this.state.data.filter(c => c.names[0].includes(this.state.filter)) });

  clearFilter = () => {
    this.setState({ filter: '' }, () => {
      this.applyFilter();
      $('#filter').val('');
    });
  };

  loadContainers = () => {
    this.setState({ loading: true });
    getData(
      'http://localhostcontainers',
      containers => this.setState({ data: containers, filtContainers: containers, loading: false })
    );
  };

  containerStopped = (containerId) => {
    const newData = this.state.data;
    for (let index = 0; index < newData.length; index++) {
      if (newData[index].id === containerId) {
        newData.splice(index, 1);
        break;
      }
    }
    this.setState({ data: newData }, () => this.applyFilter());
  };

/*<MainLayout title={{title:'Containers'}}>*/
  render = () => {
    return (
        <MainLayout>
        <div className="input-field col s10">
          <input onChange={this.onChangeFilter} value={this.state.filter} type="text" name="filter" id="filter" autoComplete="off"/>
          <label htmlFor="filter">Filter by name</label>
        </div>
        <div className="input-field col s2 right-align">
          <a onClick={this.clearFilter} title="Clear filter" className="btn-floating waves-effect waves-light red darken-4">
            <i className="material-icons">clear</i>
          </a>
        </div>
        {this.state.filtContainers && this.state.filtContainers.map(container => (
          <ContainerCard key={container.id} container={container}
                         onReplicate={this.onReplicate} containerStopped={this.containerStopped}/>))}
        <div className="fixed-action-btn tooltipped" data-position="left" data-tooltip="Launch container">
          <Link className="waves-effect waves-light btn-floating grey darken-3" to='/containers/launch'>
            <i className="large material-icons">add</i>
          </Link>
        </div>
      </MainLayout>
    );
  };
}
