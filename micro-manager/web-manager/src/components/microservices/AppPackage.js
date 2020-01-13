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
import Utils from '../../utils';
import MainLayout from '../shared/MainLayout';
import AppPackageCard from './AppPackageCard';

export default class AppPackages extends React.Component {
  constructor (props) {
    super(props);
    this.state = { data: [], loading: false, showAdd: true };
  }

  componentDidMount = () => {
    this.loadApps();
    const instances = M.Tooltip.init(document.querySelectorAll('.tooltipped'));
    this.setState({ tooltipInstances: instances });
  };

  componentDidUpdate = () => {
    if (this.state.data.length > 0) {
      const lastIndex = this.state.data.length - 1;
      if (this.state.data[lastIndex].id === 0) {
        const offset = $('#app' + lastIndex).offset().top;
        $(window).scrollTop(offset);
        this.state.tooltipInstances[0].destroy();
      }
    }
  };

  loadApps = () => {
    this.setState({ loading: true });
    const self = this;
    Utils.ajaxGet('/apps',
      function (data) {
        self.setState({ data: data, loading: false });
      });
  };

  updateNewApp = isCancel => {
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

  addApp = () => {
    const newApp = {
      id: 0, appName: ''
    };
    const newData = this.state.data;
    newData.push(newApp);
    this.setState({ data: newData, showAdd: false });
  };

  componentWillUnmount = () => {
    this.state.tooltipInstances[0].destroy();
  };

  render = () => {
    let appPackagesNodes;
    const self = this;
    if (this.state.data) {
      appPackagesNodes = this.state.data.map(function (appPackage, index) {
        return (
          <AppPackageCard key={appPackage.id} index={index} appPackage={appPackage} onRemove={self.loadApps} updateNewApp={self.updateNewApp}/>
        );
      });
    }
    return (
      <MainLayout title='App packages'>
        {appPackagesNodes}
        <div className="fixed-action-btn tooltipped" data-position="left" data-tooltip="Add app package">
          <button disabled={!this.state.showAdd} className="waves-effect waves-light btn-floating btn-large grey darken-4" onClick={this.addApp}>
            <i className="large material-icons">add</i>
          </button>
        </div>
      </MainLayout>
    );
  };
}
