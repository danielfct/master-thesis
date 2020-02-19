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
import { Redirect } from 'react-router';
import MainLayout from '../shared/MainLayout';
import {deleteData, getData, postData} from "../../utils/api";

export default class ConditionPage extends React.Component {
  constructor (props) {
    super(props);
    let thisConditionId = 0;
    if (props.match.params.conditionId) {
      thisConditionId = props.match.params.conditionId;
    }
    const conditionInitialValues = {
      valueModeId: '', fieldId: '', operatorId: '', conditionValue: ''
    };
    const thisBreadcrumbs = [{ link: '/rules/conditions', title: 'Conditions' }];
    this.state = {
      breadcrumbs: thisBreadcrumbs,
      conditionId: thisConditionId,
      condition: conditionInitialValues,
      valueModes: [],
      fields: [],
      operators: [],
      isDeleted: false,
      loading: false
    };
  }

  componentDidMount() {
    this.loadValueModes();
    this.loadFields();
    this.loadOperators();
    this.loadCondition();
  };

  componentDidUpdate = () => {
    M.updateTextFields();
    M.FormSelect.init(document.querySelectorAll('select'));
  };

  loadCondition = () => {
    if (this.state.conditionId !== 0) {
      this.setState({ loading: true });
      getData(
        `http://localhostconditions/${this.state.conditionId}`,
        data => {
          const currentCondition = {
            valueModeId: data.valueMode.id,
            fieldId: data.field.id,
            operatorId: data.operator.id,
            conditionValue: data.conditionValue
          };
          this.setState({ condition: currentCondition, loading: false });
        });
    }
  };

  loadValueModes = () => {
    this.setState({ loading: true });
    getData(
      'http://localhostrules/valueModes',
      data => this.setState({ valueModes: data, loading: false })
    );
  };

  loadFields = () => {
    this.setState({ loading: true });
    getData(
      'http://localhostrules/fields',
      data => this.setState({ fields: data, loading: false })
    );
  };

  loadOperators = () => {
    this.setState({ loading: true });
    getData(
      'http://localhostrules/operators/',
      data => this.setState({ operators: data, loading: false })
    );
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  renderValueModesSelect = () => {
    let valueModesNodes;
    if (this.state.valueModes) {
      valueModesNodes = this.state.valueModes.map(function (valueMode) {
        return (
          <option key={valueMode.id} value={valueMode.id}>{valueMode.valueModeName}</option>
        );
      });
      return valueModesNodes;
    }
  };

  renderFieldsSelect = () => {
    let fieldsNodes;
    if (this.state.fields) {
      fieldsNodes = this.state.fields.map(function (field) {
        return (
          <option key={field.id} value={field.id}>{field.fieldName}</option>
        );
      });
      return fieldsNodes;
    }
  };

  renderOperatorsSelect = () => {
    let operatorsNodes;
    if (this.state.operators) {
      operatorsNodes = this.state.operators.map(function (operator) {
        return (
          <option key={operator.id} value={operator.id}>{operator.operatorSymbol}</option>
        );
      });
      return operatorsNodes;
    }
  };

  renderDelete = () => {
    if (this.state.conditionId === 0) {
      return null;
    } else {
      const style = { marginLeft: '5px' };
      return (
        <a style={style} className="waves-effect waves-light btn-small red darken-4" onClick={this.onDelete}>Delete</a>
      );
    }
  };

  onDelete = () => {
    deleteData(
      `http://localhostconditions/${this.state.conditionId}`,
      () => {
        this.setState({ isDeleted: true });
        M.toast({ html: '<div>Condition successfully deleted!</div>' });
      });
  };

  onSubmitForm = event => {
    event.preventDefault();
    postData(
      `http://localhostconditions/${this.state.conditionId}`,
      event.target[0].value,
      data => {
        this.setState({ conditionId: data, isEdit: false });
        M.toast({ html: '<div>Condition successfully saved!</div>' });
      });
  };

  renderConditionForm = () => {
    if (this.state.isDeleted) {
      return <Redirect to='/rules/conditions'/>;
    }
    const valueModesSelect = this.renderValueModesSelect();
    const fieldsSelect = this.renderFieldsSelect();
    const operatorsSelect = this.renderOperatorsSelect();
    return (
      <div className='row'>
        <div className="right-align">
          <div className="row">
            <div className="col s12">
              {this.renderDelete()}
            </div>
          </div>
        </div>
        <form id='conditionForm' onSubmit={this.onSubmitForm}>
          <div className="input-field col s12">
            <select value={this.state.condition.valueModeId} onChange={this.handleChange} name="valueModeId"
                    id="valueModeId">
              <option value="" disabled="disabled">Choose Value mode</option>
              {valueModesSelect}
            </select>
            <label htmlFor="valueModeId">Value mode</label>
          </div>
          <div className="input-field col s12">
            <select value={this.state.condition.fieldId} onChange={this.handleChange} name="fieldId" id="fieldId">
              <option value="" disabled="disabled">Choose Field</option>
              {fieldsSelect}
            </select>
            <label htmlFor="fieldId">Field</label>
          </div>
          <div className="input-field col s12">
            <select value={this.state.condition.operatorId} onChange={this.handleChange} name="operatorId"
                    id="operatorId">
              <option value="" disabled="disabled">Choose Operator</option>
              {operatorsSelect}
            </select>
            <label htmlFor="operatorId">Operator</label>
          </div>
          <div className="input-field col s12">
            <input value={this.state.condition.conditionValue} onChange={this.handleChange} name="conditionValue"
                   id="conditionValue" type="number"/>
            <label htmlFor="conditionValue">Condition value</label>
          </div>
          <button className="btn waves-effect waves-light" type="submit" name="action">
            Save
            <i className="material-icons right">send</i>
          </button>
        </form>
      </div>
    );
  };
/*<MainLayout title={{title:'Condition detail'}}>*/
  render = () => (
    <MainLayout>
      {this.renderConditionForm()}
    </MainLayout>
  );
}
