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
import {deleteData, postData} from "../../utils/api";

export default class EdgeHostCard extends React.Component {
  constructor (props) {
    super(props);
    const edgeHost = this.props.edgeHost;
    edgeHost.local = edgeHost.local ? 'true' : 'false';
    const defaultIsEdit = this.props.edgeHost.id === 0;
    this.state = { data: edgeHost, loading: false, isEdit: defaultIsEdit };
  }

  componentDidMount = () => {
    M.FormSelect.init(document.querySelectorAll('select'));
  };

  componentDidUpdate = () => {
    M.updateTextFields();
    M.FormSelect.init(document.querySelectorAll('select'));
  };

  onClickEdit = () => {
    const setEdit = !this.state.isEdit;
    if (!setEdit && this.state.data.id === 0) {
      this.props.updateNewEdgeHost(true);
    }
    this.setState({ isEdit: setEdit });
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  onSubmitForm = event => {
    event.preventDefault();
    postData(
      `http://localhosthosts/edge/${this.state.data.id}`,
      event.target[0].value,
      data => {
        //TODO wtf?
        const newData = this.state.data;
        const oldId = newData.id;
        newData.id = data;
        if (oldId === 0) {
          this.props.updateNewEdgeHost(false);
        }
        this.setState({ isEdit: false });
        M.toast({ html: '<div>Edge host saved successfully!</div>' });
      });
  };

  onClickDelete = () => {
    deleteData(
      `http://localhosthosts/edge/${this.state.data.id}`,
      () => {
        M.toast({ html: '<div>Edge host deleted successfully!</div>' });
        this.props.onRemove();
      });
  };

  renderNormal = () => (
    <div>
      <div>
        <h5>Hostname</h5>
        <div>{this.state.data.hostname}</div>
      </div>
      <div>
        <h5>SSH username</h5>
        <div>{this.state.data.sshUsername}</div>
      </div>
      <div>
        <h5>SSH password (Base64)</h5>
        <div>{this.state.data.sshPassword}</div>
      </div>
      <div>
        <h5>Region</h5>
        <div>{this.state.data.region}</div>
      </div>
      <div>
        <h5>Country</h5>
        <div>{this.state.data.country}</div>
      </div>
      <div>
        <h5>City</h5>
        <div>{this.state.data.city}</div>
      </div>
      <div>
        <h5>Is local</h5>
        <div>{this.state.data.local}</div>
      </div>
    </div>
  );

  renderForm = () => (
    <form id={this.state.data.id + 'edgeHostForm'} onSubmit={this.onSubmitForm}>
      <div className="input-field">
        <input onChange={this.handleChange} defaultValue={this.state.data.hostname} name='hostname'
               id={this.state.data.id + 'hostname'} type="text" autoComplete="off"/>
        <label htmlFor={this.state.data.id + 'hostname'}>Hostname</label>
      </div>
      <div className="input-field">
        <input onChange={this.handleChange} defaultValue={this.state.data.sshUsername} name='sshUsername'
               id={this.state.data.id + 'sshUsername'} type="text" autoComplete="off"/>
        <label htmlFor={this.state.data.id + 'sshUsername'}>SSH username</label>
      </div>
      <div className="input-field">
        <input onChange={this.handleChange} defaultValue={this.state.data.sshPassword} name='sshPassword'
               id={this.state.data.id + 'sshPassword'} type="text" autoComplete="off"/>
        <label htmlFor={this.state.data.id + 'sshPassword'}>SSH password (Base64)</label>
      </div>
      <div className="input-field">
        <input onChange={this.handleChange} defaultValue={this.state.data.region} name='region'
               id={this.state.data.id + 'region'} type="text" autoComplete="off"/>
        <label htmlFor={this.state.data.id + 'region'}>Region</label>
      </div>
      <div className="input-field">
        <input onChange={this.handleChange} defaultValue={this.state.data.country} name='country'
               id={this.state.data.id + 'country'} type="text" autoComplete="off"/>
        <label htmlFor={this.state.data.id + 'country'}>Country</label>
      </div>
      <div className="input-field">
        <input onChange={this.handleChange} defaultValue={this.state.data.city} name='city'
               id={this.state.data.id + 'city'} type="text" autoComplete="off"/>
        <label htmlFor={this.state.data.id + 'city'}>City</label>
      </div>
      <div className="input-field">
        <select onChange={this.handleChange} defaultValue={this.state.data.local} name="local"
                id={this.state.data.id + 'local'}>
          <option value="" disabled="disabled">Choose is local</option>
          <option value='true'>True</option>
          <option value='false'>False</option>
        </select>
        <label htmlFor={this.state.data.id + 'local'}>Is local</label>
      </div>
      <button className="btn waves-effect waves-light" type="submit" name="action">
        Save
        <i className="material-icons right">send</i>
      </button>
    </form>
  );

  render = () => {
    const nodes = this.state.isEdit ? this.renderForm() : this.renderNormal();
    const style = { marginLeft: '5px' };
    return (
      <div id={'edgehost' + this.props.index} className='row'>
        <div className='col s12'>
          <div className='card'>
            <div className='card-content'>
              <div className="right-align">
                <a className="waves-effect waves-light btn-small"
                   onClick={this.onClickEdit}>{this.state.isEdit ? 'Cancel' : 'Edit'}</a>
                <a disabled={this.state.data.id === 0} style={style}
                   className="waves-effect waves-light btn-small red darken-4" onClick={this.onClickDelete}>Delete</a>
              </div>
              {nodes}
            </div>
          </div>
        </div>
      </div>
    );
  };
}
