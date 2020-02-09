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
import {getData, deleteData, postData} from '../../utils/rest';

export default class ContainerCard extends React.Component {
  constructor (props) {
    super(props);
    this.state = { nodes: [], isReplicate: false, isMigrate: false, hostnameSelected: '', seconds: 0, loading: false };
  }

  componentDidUpdate = () => {
    if (this.state.isReplicate || this.state.isMigrate) {
      M.FormSelect.init(this.hostname);
    }
  };

  componentDidMount = () => M.Collapsible.init(document.querySelectorAll('.collapsible'));

  renderNames = () => this.props.container.names.map((name, index) =>
    <CardItem key={name + index + 1} label={`Name ${index + 1}`} value={name}/>
  );

  renderPorts = () => this.props.container.ports.map((port, index) => (
    <div key={'port' + index}>
      <h6>Public port : Private port</h6>
      <div>{port.publicPort + ' : ' + port.privatePort}</div>
      <h6>IP / Type</h6>
      <div>{port.ip + ' / ' + port.type}</div>
    </div>
  ));

  renderLabels = () => {
    const propsLabels = this.props.container.labels;
    return Object.keys(propsLabels).map(key => (
      <div key={key}>
        {key + ': ' + propsLabels[key]}
      </div>
    ));
  };

  renderLogs = () =>
    <div>
      {this.props.container.logs}
    </div>;

  stopContainer = () => {
    /* const action = `localhost/containers/${this.props.container.id}`;
     const dataObject = {
       hostname: this.props.container.hostname,
       containerId: this.props.container.id
     };
     const dataToSend = JSON.stringify(dataObject);*/
    deleteData(`localhost/containers/${this.props.container.id}`,
      this.props.container, () => {
        M.toast({ html: '<div>Container stopped successfully!</div>' });
        this.props.containerStopped(this.props.container.id);
      });
  };

  loadAvailableNodes = () => {
    this.setState({ loading: true });
    getData('localhost/nodes', nodes => this.setState({ nodes: nodes, loading: false })
    );
  };

  onClickReplicate = () => {
    this.loadAvailableNodes();
    this.setState({ isReplicate: true });
  };

  onClickMigrate = () => {
    this.loadAvailableNodes();
    this.setState({ isMigrate: true });
  };

  onClickCancelReplicate = () => {
    const instance = M.FormSelect.getInstance(this.hostname);
    instance.destroy();
    this.setState({ isReplicate: false, isMigrate: false });
  };

  handleChangeHostname = event => {
    this.setState({ hostnameSelected: event.target.value });
  };

  onSubmitReplicate = () => {
    postData(`localhost/containers/${this.props.container.id}/replicate`,
      {
        fromHostname: this.props.container.hostname,
        toHostname: this.state.hostnameSelected
      },
      () => {
        this.onClickCancelReplicate();
        this.props.onReplicate();
        M.toast({ html: '<div>Container replicated successfully!</div>' });
      });
  };

  onSubmitMigrate = () => {
    postData(`localhost/containers/${this.props.container.id}/migrate`,
      {
        fromHostname: this.props.container.hostname,
        toHostname: this.state.hostnameSelected,
        secondsBeforeStop: this.state.seconds
      },
      () => {
        this.onClickCancelReplicate();
        this.props.onReplicate();
        M.toast({ html: '<div>Container migrated successfully!</div>' });
      });
  };

  renderHostnamesSelect = () =>
    this.state.nodes && this.state.nodes.map(node =>
      <option key={node.id} value={node.hostname}>{node.hostname}</option>
    );

  renderSelectTotal = () => (
    <div className="input-field col s6">
      <select ref={hostname => this.hostname = hostname} defaultValue="" name="hostname" id="hostname"
              onChange={this.handleChangeHostname}>
        <option value="" disabled="disabled">Choose hostname</option>
        {this.renderHostnamesSelect()}
      </select>
      <label htmlFor="hostname">Hostname</label>
    </div>
  );

  renderReplicate = () => {
    const style = { marginLeft: '10px' };
    if (this.state.isReplicate || this.state.isMigrate) {
      return (
        <div className="row">
          {this.renderSelectTotal()}
          <div className="input-field col s6">
            <a title={this.state.isReplicate ? "Replicate" : "Migrate"} style={style}
               className="btn-floating waves-effect waves-light"
               onClick={this.state.isReplicate ? this.onSubmitReplicate : this.onSubmitMigrate}>
              <i className="material-icons">send</i>
            </a>
            <a title="Cancel" style={style} className="btn-floating waves-effect waves-light red darken-4"
               onClick={this.onClickCancelReplicate}>
              <i className="material-icons">clear</i>
            </a>
          </div>
        </div>
      );
    } else {
      return (
        <div className="row">
          <div className="col s12">
            <a style={style} className="waves-effect waves-light btn-small" onClick={this.onClickMigrate}>Migrate</a>
            <a style={style} className="waves-effect waves-light btn-small"
               onClick={this.onClickReplicate}>Replicate</a>
          </div>
        </div>
      );
    }
  };

  render = () => {
    const style = { marginLeft: '5px' };
    const labelStyle = { paddingTop: '0px', paddingBottom: '0px' };
    return (
      <div className='row'>
        <div className='col s12'>
          <div className='card'>
            <div className='card-content'>
              <div className="right-align">
                {this.renderReplicate()}
                <div className="row">
                  <div className="col s12">
                    <a style={style} className="waves-effect waves-light btn-small red darken-4"
                       onClick={this.stopContainer}>Stop</a>
                  </div>
                </div>
              </div>
              <CardItem label='Id' value={this.props.container.id}/>
              {this.renderNames()}
              <CardItem label='Image' value={this.props.container.image}/>
              <CardItem label='Command' value={this.props.container.command}/>
              <CardItem label='State' value={this.props.container.state}/>
              <CardItem label='Status' value={this.props.container.status}/>
              <CardItem label='Hostname' value={this.props.container.hostname}/>
              <h5>Ports</h5>
              {this.renderPorts()}
              <div className="row">
                <ul className="collapsible">
                  <li>
                    <div style={labelStyle} className="collapsible-header">
                      <h5>Labels</h5>
                    </div>
                    <div className="collapsible-body">
                      {this.renderLabels()}
                    </div>
                  </li>
                </ul>
              </div>
              <div className="row">
                <ul className="collapsible">
                  <li>
                    <div style={labelStyle} className="collapsible-header">
                      <h5>Logs</h5>
                    </div>
                    <div className="collapsible-body">
                      {this.renderLogs()}
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
}
