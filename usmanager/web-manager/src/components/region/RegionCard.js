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

import React from "react";
import M from "materialize-css";
import CardItem from "../shared/list/CardItem";
import {deleteData, postData} from "../../utils/api";

export default class RegionCard extends React.Component {
  constructor (props) {
    super(props);
    const region = this.props.region;
    region.active = region.active ? 'true' : 'false';
    const defaultIsEdit = this.props.region.id === 0;
    this.state = {data: region, loading: false, isEdit: defaultIsEdit};
  }

  componentDidMount() {
    M.FormSelect.init(document.querySelectorAll('select'));
  };

  componentDidUpdate = () => {
    M.updateTextFields();
    M.FormSelect.init(document.querySelectorAll('select'));
  };

  onClickEdit = () => {
    const setEdit = !this.state.isEdit;
    if (!setEdit && this.state.data.id === 0) {
      this.props.updateNewRegion(true);
    }
    this.setState({isEdit: setEdit});
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  onSubmitForm = event => {
    event.preventDefault();
    postData(
      `http://localhostregions/${this.state.data.id}`,
      event.target[0].value,
      data => {
        //TODO wtf?
        const newData = this.state.data;
        const oldId = newData.id;
        newData.id = data;
        if (oldId === 0) {
          this.props.updateNewRegion(false);
        }
        this.setState({isEdit: false});
        M.toast({html: '<div>Region saved successfully!</div>'});
      });
  };

  onClickRemove = () => {
    deleteData(
      `http://localhostregions/${this.state.data.id}`,
      () => {
        M.toast({html: '<div>Region deleted successfully!</div>'});
        this.props.onRemove();
      });
  };

  renderNormal = () => (
    <div>
      <CardItem label='Region name' value={this.state.data.regionName}/>
      <CardItem label='Region description' value={this.state.data.regionDescription}/>
      <CardItem label='Is active' value={this.state.data.active}/>
    </div>
  );

  renderForm = () => (
    <form id={this.state.data.id + 'regionForm'} onSubmit={this.onSubmitForm}>
      <div className="input-field">
        <input onChange={this.handleChange} defaultValue={this.state.data.regionName} name='regionName'
               id={this.state.data.id + 'regionName'} type="text" autoComplete="off"/>
        <label htmlFor={this.state.data.id + 'regionName'}>Region name</label>
      </div>
      <div className="input-field">
        <input onChange={this.handleChange} defaultValue={this.state.data.regionDescription} name='regionDescription'
               id={this.state.data.id + 'regionDescription'} type="text" autoComplete="off"/>
        <label htmlFor={this.state.data.id + 'regionDescription'}>Region description</label>
      </div>
      <div className="input-field">
        <select onChange={this.handleChange} defaultValue={this.state.data.active} name="active"
                id={this.state.data.id + 'active'}>
          <option value="" disabled="disabled">Choose active</option>
          <option value='true'>True</option>
          <option value='false'>False</option>
        </select>
        <label htmlFor={this.state.data.id + 'active'}>Active</label>
      </div>
      <button className="btn waves-effect waves-light" type="submit" name="action">
        Save
        <i className="material-icons right">send</i>
      </button>
    </form>
  );

  render() {
    const nodes = this.state.isEdit ? this.renderForm() : this.renderNormal();
    const style = {marginLeft: '5px'};
    return (
      <div id={'region' + this.props.index} className='row'>
        <div className='col s12'>
          <div className='card'>
            <div className='card-content'>
              <div className="right-align">
                <a className="waves-effect waves-light btn-small"
                   onClick={this.onClickEdit}>{this.state.isEdit ? 'Cancel' : 'Edit'}</a>
                <a disabled={this.state.data.id === 0} style={style}
                   className="waves-effect waves-light btn-small red darken-4" onClick={this.onClickRemove}>Remove</a>
              </div>
              {nodes}
            </div>
          </div>
        </div>
      </div>
    );
  };
}