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
import { Redirect } from 'react-router';
import MainLayout from '../shared/MainLayout';
import {deleteData, getData, postData} from "../../utils/data";

export default class RulePage extends React.Component {
  constructor (props) {
    super(props);
    let thisRuleId = 0;
    if (props.match.params.ruleId) {
      thisRuleId = props.match.params.ruleId;
    }
    const ruleInitialValues = {
      ruleName: '', componentTypeId: '', priority: 0, decisionId: ''
    };
    const thisBreadcrumbs = [{ link: '/rules', title: 'Rules' }];
    this.state = {
      breadcrumbs: thisBreadcrumbs,
      ruleId: thisRuleId,
      rule: ruleInitialValues,
      componentTypes: [],
      decisions: [],
      conditions: [],
      allConditions: [],
      loadedConditions: false,
      isDeleted: false,
      loading: false
    };
  }

  componentDidMount = () => {
    M.updateTextFields();
    this.loadComponentTypes();
    this.loadDecisions();
    this.loadRule();
    this.loadConditions();
    this.loadAllConditions();
  };

  componentDidUpdate = () => {
    M.updateTextFields();
    M.FormSelect.init(document.querySelectorAll('select'));
  };

  loadConditions = () => {
    this.setState({ loadedConditions: false, loading: true });
    getData(
      `http://localhost/rules/${this.state.ruleId}/conditions`,
      data => this.setState({ conditions: data, loadedConditions: true, loading: false })
    );
  };

  loadRule = () => {
    if (this.state.ruleId !== 0) {
      this.setState({ loading: true });
      getData(
        `http://localhost/rules/${this.state.ruleId}`,
        (data) => {
          const currentRule = {
            ruleName: data.ruleName,
            componentTypeId: data.componentType.id,
            priority: data.priority,
            decisionId: data.decision.id
          };
          this.setState({ rule: currentRule, loading: false });
        });
    }
  };

  loadComponentTypes = () => {
    this.setState({ loading: true });
    getData(
      'http://localhost/rules/componentTypes/',
      data => this.setState({ componentTypes: data, loading: false })
    );
  };

  loadDecisions = () => {
    this.setState({ loading: true });
    getData(
      'http://localhost/decisions/',
      data => this.setState({ decisions: data, loading: false })
    );
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  addCondition = (conditionId, event) => {
    if (this.state.ruleId !== 0) {
      postData(`http://localhostrules/${this.state.ruleId}/conditions`,
        conditionId,
        data => {
          M.toast({ html: '<div>Condition successfully added to rule!</div>' });
          this.loadConditions();
        });
    }
  };

  renderComponentTypesSelect = () => {
    let componentTypesNodes;
    if (this.state.componentTypes) {
      componentTypesNodes = this.state.componentTypes.map(function (componentType) {
        return (
          <option key={componentType.id} value={componentType.id}>{componentType.componentTypeName}</option>
        );
      });
      return componentTypesNodes;
    }
  };

  renderDecisionsSelect = () => {
    let decisionsNodes;
    if (this.state.decisions) {
      decisionsNodes = this.state.decisions.map(function (decision) {
        return (
          <option key={decision.id} value={decision.id}>
            {decision.decisionName + ' (' + decision.componentType.componentTypeName + ')'}
          </option>
        );
      });
      return decisionsNodes;
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
    deleteData(`http://localhostrules/${this.state.ruleId}`,
      () => {
        this.setState({ isDeleted: true });
        M.toast({ html: '<div>Rule successfully deleted!</div>' });
      });
  };

  onRemoveCondition = (conditionId, event) => {
    deleteData(`http://localhostrules/${this.state.ruleId}/conditions/${conditionId}`,
      () => {
        M.toast({ html: '<div>Condition successfully deleted from rule!</div>' });
        this.loadConditions();
      });
  };

  onSubmitForm = event => {
    event.preventDefault();
    postData(`http://localhostrules/${this.state.ruleId}`,
      event.target[0].value,
      data => {
        this.setState({ ruleId: data, isEdit: false });
        M.toast({ html: '<div>Rule successfully saved!</div>' });
      });
  };

  renderConditions = () => {
    let conditionNodes;
    const style = { marginTop: '-4px' };
    if (this.state.conditions) {
      conditionNodes = this.state.conditions.map(condition => (
        <li key={condition.id} className="collection-item">
          <div>
            {'(' + condition.valueMode.valueModeName + ') ' + condition.field.fieldName + ' ' + condition.operator.operatorSymbol + ' ' + condition.conditionValue}
            <a style={style} className="secondary-content btn-floating btn-small waves-effect waves-light"
               onClick={(e) => this.onRemoveCondition(condition.id, e)}>
              <i className="material-icons">clear</i>
            </a>
          </div>
        </li>
      ));
    }
    return conditionNodes;
  };

  loadAllConditions = () => {
    this.setState({ loading: true });
    getData(
      'http://localhostconditions',
      data => this.setState({ allConditions: data, loading: false })
    );
  };

  renderAddCondition = () => {
    let conditionNodes;
    const style = { marginTop: '-4px' };
    //TODO fix
    const canAddCondition = conditionId => {
      for (let i = 0; i < this.state.conditions.length; i++) {
        if (this.state.conditions[i].id === conditionId) {
          return false;
        }
      }
      return true;
    };

    if (this.state.allConditions && this.state.loadedConditions) {
      conditionNodes = this.state.allConditions.map(condition => {
        if (canAddCondition(condition.id)) {
          return (
            <li key={condition.id} className="collection-item">
              <div>
                {'(' + condition.valueMode.valueModeName + ') ' + condition.field.fieldName + ' ' + condition.operator.operatorSymbol + ' ' + condition.conditionValue}
                <a style={style} className="secondary-content btn-floating btn-small waves-effect waves-light"
                   onClick={(e) => this.addCondition(condition.id, e)}>
                  <i className="material-icons">add</i>
                </a>
              </div>
            </li>
          );
        }
      });
    }
    return (
      <ul className="collection">
        {conditionNodes}
      </ul>
    );
  };

  renderRuleForm = () => {
    if (this.state.isDeleted) {
      return <Redirect to='/rules'/>;
    }
    const componentTypesSelect = this.renderComponentTypesSelect();
    const decisionsSelect = this.renderDecisionsSelect();
    return (
      <div className='row'>
        <div className="right-align">
          <div className="row">
            <div className="col s12">
              {this.renderDelete()}
            </div>
          </div>
        </div>
        <form id='ruleForm' onSubmit={this.onSubmitForm}>
          <div className="input-field col s12">
            <input value={this.state.rule.ruleName} onChange={this.handleChange} name="ruleName" id="ruleName"
                   type="text" autoComplete="off"/>
            <label htmlFor="ruleName">Rule name</label>
          </div>
          <div className="input-field col s12">
            <select value={this.state.rule.componentTypeId} onChange={this.handleChange} name="componentTypeId"
                    id="componentTypeId">
              <option value="" disabled="disabled">Choose rule type</option>
              {componentTypesSelect}
            </select>
            <label htmlFor="componentTypeId">Rule type</label>
          </div>
          <div className="input-field col s12">
            <input value={this.state.rule.priority} onChange={this.handleChange} name="priority" id="priority"
                   type="number"/>
            <label htmlFor="priority">Priority</label>
          </div>
          <div className="input-field col s12">
            <select value={this.state.rule.decisionId} onChange={this.handleChange} name="decisionId" id="decisionId">
              <option value="" disabled="disabled">Choose decision</option>
              {decisionsSelect}
            </select>
            <label htmlFor="decisionId">Decision</label>
          </div>
          <button className="btn waves-effect waves-light" type="submit" name="action">
            Save
            <i className="material-icons right">send</i>
          </button>
        </form>
        <br/>
        <div>
          <h5>Rule conditions</h5>
          <ul className="collection">
            {this.renderConditions()}
          </ul>
          <br/>
          <h5>Add conditions</h5>
          {this.renderAddCondition()}
        </div>
      </div>
    );
  };

  render = () => (
    <MainLayout title='Rule detail' breadcrumbs={this.state.breadcrumbs}>
      {this.renderRuleForm()}
    </MainLayout>
  );
}
