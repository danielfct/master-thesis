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
import { Link, Redirect } from 'react-router-dom';
import M from 'materialize-css';
import $ from 'jquery';
import Utils from '../utils';
import { MainLayout } from '../sharedComponents/mainLayout';
import { CardItem } from '../sharedComponents/cardItem';

export class RulesLandingPage extends React.Component {
  constructor (props) {
    super(props);
    const ruleLinks = [
      { name: 'Conditions', link: '/ui/rules/conditions' },
      { name: 'Rules', link: '/ui/rules' },
      { name: 'Generic Hosts rules', link: '/ui/rules/generic/hosts' },
      { name: 'Hosts rules', link: '/ui/rules/hosts' },
      { name: 'Apps rules', link: '/ui/rules/apps' },
      { name: 'Services rules', link: '/ui/rules/services' },
      { name: 'Service event predictions', link: '/ui/rules/serviceEventPredictions' }
    ];
    this.state = { links: ruleLinks, loading: false };
  }

    renderLinks = () => {
      return this.state.links.map(function (link) {
        return (
          <li key={link.name} className="collection-item">
            <div>{link.name}
              <Link className="secondary-content" to={link.link}>
                <i className="material-icons">keyboard_arrow_right</i>
              </Link>
            </div>
          </li>
        );
      });
    };

    render () {
      return (
        <MainLayout title='Rules management'>
          <div className="row">
            <div className="col s12">
              <ul className="collection">
                {this.renderLinks()}
              </ul>
            </div>
          </div>
        </MainLayout>
      );
    }
}

export class ConditionCard extends React.Component {
  constructor (props) {
    super(props);
    const condition = this.props.condition;
    this.state = { data: condition, loading: false };
  }

    renderLink = () => {
      return (
        <div className="right-align">
          <div className="row">
            <div className="col s12">
              <Link className="waves-effect waves-light btn-small" to={'/ui/rules/conditions/detail/' + this.state.data.id}>
                            View details
              </Link>
            </div>
          </div>
        </div>
      );
    };

    renderSimple = () => {
      const linkDetails = this.props.viewDetails ? this.renderLink() : null;
      return (
        <div>
          {linkDetails}
          <CardItem label='Value mode' value={this.state.data.valueMode.valueModeName}/>
          <CardItem label='Field' value={this.state.data.field.fieldName}/>
          <CardItem label='Operator' value={this.state.data.operator.operatorSymbol}/>
          <CardItem label='Condition value' value={this.state.data.conditionValue}/>
        </div>
      );
    };

    renderCard = () => {
      return (
        <div className='row'>
          <div className='col s12'>
            <div className='card'>
              <div className='card-content'>
                {this.renderSimple()}
              </div>
            </div>
          </div>
        </div>
      );
    };

    render () {
      return this.props.renderSimple ? this.renderSimple() : this.renderCard();
    }
}

export class Conditions extends React.Component {
  constructor (props) {
    super(props);
    this.state = { data: [], loading: false };
  }

  componentDidMount () {
    this.loadConditions();
  }

    loadConditions = () => {
      this.setState({ loading: true });
      const self = this;
      Utils.ajaxGet('/conditions',
        function (data) {
          self.setState({ data: data, loading: false });
        });
    };

    render () {
      let conditionNodes;
      if (this.state.data) {
        conditionNodes = this.state.data.map(function (condition) {
          return (
            <ConditionCard viewDetails={true} key={condition.id} condition={condition} />
          );
        });
      }
      return (
        <MainLayout title='Conditions'>
          <div className="right-align">
            <div className="row">
              <div className="col s12">
                <Link className="waves-effect waves-light btn-small" to='/ui/rules/conditions/detail/'>
                                New condition
                </Link>
              </div>
            </div>
          </div>
          {conditionNodes}
        </MainLayout>
      );
    }
}

export class ConditionPage extends React.Component {
  constructor (props) {
    super(props);
    let thisConditionId = 0;
    if (props.match.params.conditionId) {
      thisConditionId = props.match.params.conditionId;
    }
    const conditionInitialValues = {
      valueModeId: '', fieldId: '', operatorId: '', conditionValue: ''
    };
    const thisBreadcrumbs = [{ link: '/ui/rules/conditions', title: 'Conditions' }];
    this.state = { breadcrumbs: thisBreadcrumbs, conditionId: thisConditionId, condition: conditionInitialValues, valueModes: [], fields: [], operators: [], isDeleted: false, loading: false };
  }

  componentDidMount () {
    this.loadValueModes();
    this.loadFields();
    this.loadOperators();
    this.loadCondition();
  }

  componentDidUpdate () {
    M.updateTextFields();
    M.FormSelect.init(document.querySelectorAll('select'));
  }

    loadCondition = () => {
      if (this.state.conditionId !== 0) {
        this.setState({ loading: true });
        const self = this;
        Utils.ajaxGet('/conditions/' + this.state.conditionId,
          function (data) {
            const currentCondition = {
              valueModeId: data.valueMode.id,
              fieldId: data.field.id,
              operatorId: data.operator.id,
              conditionValue: data.conditionValue
            };
            self.setState({ condition: currentCondition, loading: false });
          });
      }
    };

    loadValueModes = () => {
      this.setState({ loading: true });
      const self = this;
      Utils.ajaxGet('/rules/valueModes/',
        function (data) {
          self.setState({ valueModes: data, loading: false });
        });
    };

    loadFields = () => {
      this.setState({ loading: true });
      const self = this;
      Utils.ajaxGet('/rules/fields/',
        function (data) {
          self.setState({ fields: data, loading: false });
        });
    };

    loadOperators = () => {
      this.setState({ loading: true });
      const self = this;
      Utils.ajaxGet('/rules/operators/',
        function (data) {
          self.setState({ operators: data, loading: false });
        });
    };

    handleChange = (event) => {
      const name = event.target.name;
      const newData = this.state.condition;
      newData[name] = event.target.value;
      this.setState({ condition: newData });
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
      const formAction = '/conditions/' + this.state.conditionId;
      const self = this;
      Utils.formSubmit(formAction, 'DELETE', {}, function (data) {
        self.setState({ isDeleted: true });
        M.toast({ html: '<div>Condition successfully deleted!</div>' });
      });
    };

    onSubmitForm = (event) => {
      event.preventDefault();
      const formAction = '/conditions/' + this.state.conditionId;
      const formData = Utils.convertFormToJson('conditionForm');
      const self = this;
      Utils.formSubmit(formAction, 'POST', formData, function (data) {
        self.setState({ conditionId: data, isEdit: false });
        M.toast({ html: '<div>Condition successfully saved!</div>' });
      });
    };

    renderConditionForm = () => {
      if (this.state.isDeleted) {
        return <Redirect to='/ui/rules/conditions' />;
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
              <select value={this.state.condition.valueModeId} onChange={this.handleChange} name="valueModeId" id="valueModeId" >
                <option value="" disabled="disabled">Choose Value mode</option>
                {valueModesSelect}
              </select>
              <label htmlFor="valueModeId">Value mode</label>
            </div>
            <div className="input-field col s12">
              <select value={this.state.condition.fieldId} onChange={this.handleChange} name="fieldId" id="fieldId" >
                <option value="" disabled="disabled">Choose Field</option>
                {fieldsSelect}
              </select>
              <label htmlFor="fieldId">Field</label>
            </div>
            <div className="input-field col s12">
              <select value={this.state.condition.operatorId} onChange={this.handleChange} name="operatorId" id="operatorId" >
                <option value="" disabled="disabled">Choose Operator</option>
                {operatorsSelect}
              </select>
              <label htmlFor="operatorId">Operator</label>
            </div>
            <div className="input-field col s12">
              <input value={this.state.condition.conditionValue} onChange={this.handleChange} name="conditionValue" id="conditionValue" type="number"/>
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

    render () {
      return (
        <MainLayout title='Condition detail' breadcrumbs={this.state.breadcrumbs}>
          {this.renderConditionForm()}
        </MainLayout>
      );
    }
}

export class RuleCard extends React.Component {
  constructor (props) {
    super(props);
    const rule = this.props.rule;
    this.state = { data: rule, conditions: [], loading: false };
  }

  componentDidMount () {
    this.loadConditions();
  }

  componentDidUpdate () {
    const elems = document.querySelectorAll('.collapsible');
    M.Collapsible.init(elems);
  }

    loadConditions = () => {
      this.setState({ loading: true });
      const self = this;
      Utils.ajaxGet('/rules/' + self.state.data.id + '/conditions',
        function (data) {
          self.setState({ conditions: data, loading: false });
        });
    };

    renderConditions = () => {
      let conditionNodes;
      if (this.state.conditions) {
        conditionNodes = this.state.conditions.map(function (condition) {
          return (
            <li key={condition.id} >
              <div className="collapsible-header">
                {condition.field.fieldName + ' ' + condition.operator.operatorSymbol + ' ' + condition.conditionValue}
              </div>
              <div className="collapsible-body">
                <ConditionCard renderSimple={true} viewDetails={false} condition={condition} />
              </div>
            </li>
          );
        });
      }
      return conditionNodes;
    };

    renderLink = () => {
      return (
        <div className="right-align">
          <div className="row">
            <div className="col s12">
              <Link className="waves-effect waves-light btn-small" to={'/ui/rules/detail/' + this.state.data.id}>
                            View details
              </Link>
            </div>
          </div>
        </div>
      );
    };

    renderSimple = () => {
      const linkDetails = this.props.viewDetails ? this.renderLink() : null;
      return (
        <div>
          {linkDetails}
          <CardItem label='Rule name' value={this.state.data.ruleName}/>
          <CardItem label='Rule type' value={this.state.data.componentType.componentTypeName}/>
          <CardItem label='Priority' value={this.state.data.priority}/>
          <CardItem label='Decision' value={this.state.data.decision.decisionName}/>
        </div>
      );
    };

    renderCard = () => {
      return (
        <div className='row'>
          <div className='col s12'>
            <div className='card'>
              <div className='card-content'>
                {this.renderSimple()}
                <h5>Rule conditions</h5>
                <ul className="collapsible">
                  {this.renderConditions()}
                </ul>
              </div>
            </div>
          </div>
        </div>
      );
    };

    render () {
      return this.props.renderSimple ? this.renderSimple() : this.renderCard();
    }
}

export class Rules extends React.Component {
  constructor (props) {
    super(props);
    this.state = { data: [], loading: false };
  }

  componentDidMount () {
    this.loadRules();
  }

    loadRules = () => {
      this.setState({ loading: true });
      const self = this;
      Utils.ajaxGet('/rules',
        function (data) {
          self.setState({ data: data, loading: false });
        });
    };

    render () {
      let ruleNodes;
      if (this.state.data) {
        ruleNodes = this.state.data.map(function (rule) {
          return (
            <RuleCard viewDetails={true} key={rule.id} rule={rule} />
          );
        });
      }
      return (
        <MainLayout title='Rules'>
          <div className="right-align">
            <div className="row">
              <div className="col s12">
                <Link className="waves-effect waves-light btn-small" to='/ui/rules/detail/'>
                                New rule
                </Link>
              </div>
            </div>
          </div>
          {ruleNodes}
        </MainLayout>
      );
    }
}

export class RulePage extends React.Component {
  constructor (props) {
    super(props);
    let thisRuleId = 0;
    if (props.match.params.ruleId) {
      thisRuleId = props.match.params.ruleId;
    }
    const ruleInitialValues = {
      ruleName: '', componentTypeId: '', priority: 0, decisionId: ''
    };
    const thisBreadcrumbs = [{ link: '/ui/rules', title: 'Rules' }];
    this.state = { breadcrumbs: thisBreadcrumbs, ruleId: thisRuleId, rule: ruleInitialValues, componentTypes: [], decisions: [], conditions: [], allConditions: [], loadedConditions: false, isDeleted: false, loading: false };
  }

  componentDidMount () {
    M.updateTextFields();
    this.loadComponentTypes();
    this.loadDecisions();
    this.loadRule();
    this.loadConditions();
    this.loadAllConditions();
  }

  componentDidUpdate () {
    M.updateTextFields();
    M.FormSelect.init(document.querySelectorAll('select'));
  }

    loadConditions = () => {
      this.setState({ loadedConditions: false, loading: true });
      const self = this;
      Utils.ajaxGet('/rules/' + self.state.ruleId + '/conditions',
        function (data) {
          self.setState({ conditions: data, loadedConditions: true, loading: false });
        });
    };

    loadRule = () => {
      if (this.state.ruleId !== 0) {
        this.setState({ loading: true });
        const self = this;
        Utils.ajaxGet('/rules/' + this.state.ruleId,
          function (data) {
            const currentRule = {
              ruleName: data.ruleName,
              componentTypeId: data.componentType.id,
              priority: data.priority,
              decisionId: data.decision.id
            };
            self.setState({ rule: currentRule, loading: false });
          });
      }
    };

    loadComponentTypes = () => {
      this.setState({ loading: true });
      const self = this;
      Utils.ajaxGet('/rules/componentTypes/',
        function (data) {
          self.setState({ componentTypes: data, loading: false });
        });
    };

    loadDecisions = () => {
      this.setState({ loading: true });
      const self = this;
      Utils.ajaxGet('/decisions/',
        function (data) {
          self.setState({ decisions: data, loading: false });
        });
    };

    handleChange = (event) => {
      const name = event.target.name;
      const newData = this.state.rule;
      newData[name] = event.target.value;
      this.setState({ rule: newData });
    };

    addCondition = (conditionId, event) => {
      if (this.state.ruleId !== 0) {
        const formAction = '/rules/' + this.state.ruleId + '/conditions/' + conditionId;
        const formMethod = 'POST';
        const self = this;
        Utils.formSubmit(formAction, formMethod, {}, function (data) {
          M.toast({ html: '<div>Condition successfully added to rule!</div>' });
          self.loadConditions();
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
      const formAction = '/rules/' + this.state.ruleId;
      const self = this;
      Utils.formSubmit(formAction, 'DELETE', {}, function (data) {
        self.setState({ isDeleted: true });
        M.toast({ html: '<div>Rule successfully deleted!</div>' });
      });
    };

    onRemoveCondition = (conditionId, event) => {
      const formAction = '/rules/' + this.state.ruleId + '/conditions/' + conditionId;
      const self = this;
      Utils.formSubmit(formAction, 'DELETE', {}, function (data) {
        M.toast({ html: '<div>Condition successfully deleted from rule!</div>' });
        self.loadConditions();
      });
    };

    onSubmitForm = (event) => {
      event.preventDefault();
      const formAction = '/rules/' + this.state.ruleId;
      const formData = Utils.convertFormToJson('ruleForm');
      const self = this;
      Utils.formSubmit(formAction, 'POST', formData, function (data) {
        self.setState({ ruleId: data, isEdit: false });
        M.toast({ html: '<div>Rule successfully saved!</div>' });
      });
    };

    renderConditions = () => {
      let conditionNodes;
      const self = this;
      const style = { marginTop: '-4px' };
      if (this.state.conditions) {
        conditionNodes = this.state.conditions.map(function (condition) {
          return (
            <li key={condition.id} className="collection-item">
              <div>
                {'(' + condition.valueMode.valueModeName + ') ' + condition.field.fieldName + ' ' + condition.operator.operatorSymbol + ' ' + condition.conditionValue}
                <a style={style} className="secondary-content btn-floating btn-small waves-effect waves-light" onClick={(e) => self.onRemoveCondition(condition.id, e)}>
                  <i className="material-icons">clear</i>
                </a>
              </div>
            </li>
          );
        });
      }
      return conditionNodes;
    };

    loadAllConditions = () => {
      this.setState({ loading: true });
      const self = this;
      Utils.ajaxGet('/conditions',
        function (data) {
          self.setState({ allConditions: data, loading: false });
        });
    };

    renderAddCondition = () => {
      let conditionNodes;
      const style = { marginTop: '-4px' };
      const self = this;
      function canAddCondition (conditionId) {
        for (let i = 0; i < self.state.conditions.length; i++) {
          if (self.state.conditions[i].id === conditionId) {
            return false;
          }
        }
        return true;
      }
      if (this.state.allConditions && this.state.loadedConditions) {
        conditionNodes = this.state.allConditions.map(function (condition) {
          if (canAddCondition(condition.id)) {
            return (
              <li key={condition.id} className="collection-item">
                <div>
                  {'(' + condition.valueMode.valueModeName + ') ' + condition.field.fieldName + ' ' + condition.operator.operatorSymbol + ' ' + condition.conditionValue}
                  <a style={style} className="secondary-content btn-floating btn-small waves-effect waves-light" onClick={(e) => self.addCondition(condition.id, e)}>
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
        return <Redirect to='/ui/rules' />;
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
              <input value={this.state.rule.ruleName} onChange={this.handleChange} name="ruleName" id="ruleName" type="text" autoComplete="off"/>
              <label htmlFor="ruleName">Rule name</label>
            </div>
            <div className="input-field col s12">
              <select value={this.state.rule.componentTypeId} onChange={this.handleChange} name="componentTypeId" id="componentTypeId" >
                <option value="" disabled="disabled">Choose rule type</option>
                {componentTypesSelect}
              </select>
              <label htmlFor="componentTypeId">Rule type</label>
            </div>
            <div className="input-field col s12">
              <input value={this.state.rule.priority} onChange={this.handleChange} name="priority" id="priority" type="number"/>
              <label htmlFor="priority">Priority</label>
            </div>
            <div className="input-field col s12">
              <select value={this.state.rule.decisionId} onChange={this.handleChange} name="decisionId" id="decisionId" >
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

    render () {
      return (
        <MainLayout title='Rule detail' breadcrumbs={this.state.breadcrumbs}>
          {this.renderRuleForm()}
        </MainLayout>
      );
    }
}

class AppRules extends React.Component {
  constructor (props) {
    super(props);
    this.state = { appRules: [], loading: false };
  }

  componentDidMount () {
    this.loadAppRules();
  }

    loadAppRules = () => {
      this.setState({ loading: true });
      const self = this;
      Utils.ajaxGet('/apps/' + self.props.app.id + '/rules',
        function (data) {
          self.setState({ appRules: data, loading: false });
        });
    };

    renderAppRules = () => {
      let appRulesNodes;
      if (this.state.appRules) {
        appRulesNodes = this.state.appRules.map(function (appRule) {
          return (
            <div key={appRule.rule.id}>
              <div className='card'>
                <div className='card-content'>
                  {appRule.rule.ruleName}
                </div>
              </div>
            </div>
          );
        });
      }
      return appRulesNodes;
    };

    render () {
      return (
        <div>
          <h5>Rules</h5>
          {this.renderAppRules()}
        </div>
      );
    }
}

export class AppsRulesList extends React.Component {
  constructor (props) {
    super(props);
    this.state = { apps: [], loading: false };
  }

  componentDidMount () {
    this.loadApps();
  }

    loadApps = () => {
      this.setState({ loading: true });
      const self = this;
      Utils.ajaxGet('/apps',
        function (data) {
          self.setState({ apps: data, loading: false });
        });
    };

    renderApps = () => {
      let appNodes;
      if (this.state.apps) {
        appNodes = this.state.apps.map(function (app) {
          return (
            <div key={app.id} className='row'>
              <div className='col s12'>
                <div className='card'>
                  <div className='card-content'>
                    <div className="right-align">
                      <div className="row">
                        <div className="col s12">
                          <Link className="waves-effect waves-light btn-small" to={'/ui/rules/apps/detail/' + app.id}>
                                                    View details
                          </Link>
                        </div>
                      </div>
                    </div>
                    <CardItem label='App' value={app.appName}/>
                    <AppRules app={app}/>
                  </div>
                </div>
              </div>
            </div>
          );
        });
      }
      return appNodes;
    };

    render () {
      return (
        <MainLayout title='Apps rules'>
          {this.renderApps()}
        </MainLayout>
      );
    }
}

export class AppRulesPage extends React.Component {
  constructor (props) {
    super(props);
    let thisAppId = 0;
    if (props.match.params.appId) {
      thisAppId = props.match.params.appId;
    }
    const thisBreadcrumbs = [{ link: '/ui/rules/apps', title: 'Apps rules' }];
    this.state = { breadcrumbs: thisBreadcrumbs, appId: thisAppId, app: {}, rules: [], allRules: [], loadedRules: false, loading: false };
  }

  componentDidMount () {
    this.loadApp();
    this.loadAppRules();
    this.loadAllRules();
  }

  componentDidUpdate () {
    M.updateTextFields();
  }

    loadApp = () => {
      const self = this;
      Utils.ajaxGet('/apps/' + self.state.appId,
        function (data) {
          self.setState({ app: data, loading: false });
        });
    };

    loadAppRules = () => {
      this.setState({ loadedRules: false, loading: true });
      const self = this;
      Utils.ajaxGet('/apps/' + self.state.appId + '/rules',
        function (data) {
          self.setState({ rules: data, loadedRules: true, loading: false });
        });
    };

    loadAllRules = () => {
      this.setState({ loading: true });
      const self = this;
      Utils.ajaxGet('/rules/container',
        function (data) {
          self.setState({ allRules: data, loading: false });
        });
    };

    onRemoveRule = (ruleId, event) => {
      const formAction = '/apps/' + this.state.appId + '/rules';
      const self = this;
      const data = {
        appId: Number(self.state.appId),
        ruleId: Number(ruleId)
      };
      Utils.formSubmit(formAction, 'DELETE', JSON.stringify(data), function (data) {
        M.toast({ html: '<div>Rule successfully deleted from app rules!</div>' });
        self.loadAppRules();
      });
    };

    addRule = (ruleId, event) => {
      const formAction = '/apps/' + this.state.appId + '/rules';
      const self = this;
      const data = {
        appId: Number(self.state.appId),
        ruleId: Number(ruleId)
      };
      Utils.formSubmit(formAction, 'POST', JSON.stringify(data), function (data) {
        M.toast({ html: '<div>Rule successfully added to app rules!</div>' });
        self.loadAppRules();
      });
    };

    renderRules = () => {
      let rulesNodes;
      const self = this;
      const style = { marginTop: '-4px' };
      if (this.state.rules) {
        rulesNodes = this.state.rules.map(function (appRule) {
          return (
            <li key={appRule.rule.id} className="collection-item">
              <div>
                {appRule.rule.ruleName}
                <a style={style} className="secondary-content btn-floating btn-small waves-effect waves-light" onClick={(e) => self.onRemoveRule(appRule.rule.id, e)}>
                  <i className="material-icons">clear</i>
                </a>
              </div>
            </li>
          );
        });
      }
      return rulesNodes;
    };

    renderAddRules = () => {
      let ruleNodes;
      const style = { marginTop: '-4px' };
      const self = this;
      function canAddRule (ruleId) {
        for (let i = 0; i < self.state.rules.length; i++) {
          if (self.state.rules[i].rule.id === ruleId) {
            return false;
          }
        }
        return true;
      }
      if (this.state.allRules && this.state.loadedRules) {
        ruleNodes = this.state.allRules.map(function (rule) {
          if (canAddRule(rule.id)) {
            return (
              <li key={rule.id} className="collection-item">
                <div>
                  {rule.ruleName}
                  <a style={style} className="secondary-content btn-floating btn-small waves-effect waves-light" onClick={(e) => self.addRule(rule.id, e)}>
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
          {ruleNodes}
        </ul>
      );
    };

    render () {
      return (
        <MainLayout title='App rules detail' breadcrumbs={this.state.breadcrumbs}>
          <div className='row'>
            <div className="input-field col s12">
              <input disabled={true} value={this.state.app.appName} name="appName" id="appName" type="text"/>
              <label htmlFor="appName">App name</label>
            </div>
            <div>
              <h5>Rules</h5>
              <ul className="collection">
                {this.renderRules()}
              </ul>
              <br/>
              <h5>Add rules</h5>
              {this.renderAddRules()}
            </div>
          </div>
        </MainLayout>
      );
    }
}

class HostRules extends React.Component {
  constructor (props) {
    super(props);
    this.state = { hostRules: [], loading: false };
  }

  componentDidMount () {
    this.loadHostRules();
  }

    loadHostRules = () => {
      this.setState({ loading: true });
      const self = this;
      Utils.ajaxGet('/hosts/' + self.props.host.hostname + '/rules',
        function (data) {
          self.setState({ hostRules: data, loading: false });
        });
    };

    renderHostRules () {
      let hostRulesNodes;
      if (this.state.hostRules) {
        hostRulesNodes = this.state.hostRules.map(function (hostRule) {
          return (
            <div key={hostRule.rule.id}>
              <div className='card'>
                <div className='card-content'>
                  {hostRule.rule.ruleName}
                </div>
              </div>
            </div>
          );
        });
      }
      return hostRulesNodes;
    }

    render () {
      return (
        <div>
          <h5>Rules</h5>
          {this.renderHostRules()}
        </div>
      );
    }
}

export class HostsRulesList extends React.Component {
  constructor (props) {
    super(props);
    this.state = { hosts: [], loading: false };
    this.loadHosts = this.loadHosts.bind(this);
    this.renderHosts = this.renderHosts.bind(this);
  }

  componentDidMount () {
    this.loadHosts();
  }

    loadHosts = () => {
      this.setState({ loading: true });
      const self = this;
      Utils.ajaxGet('/hosts',
        function (data) {
          self.setState({ hosts: data, loading: false });
        });
    };

    renderHosts () {
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
                          <Link className="waves-effect waves-light btn-small" to={'/ui/rules/hosts/detail/' + host.hostname}>
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
    }

    render () {
      return (
        <MainLayout title='Hosts rules'>
          {this.renderHosts()}
        </MainLayout>
      );
    }
}

export class HostRulesPage extends React.Component {
  constructor (props) {
    super(props);
    let thisHostname = '';
    if (props.match.params.hostname) {
      thisHostname = props.match.params.hostname;
    }
    const thisBreadcrumbs = [{ link: '/ui/rules/hosts', title: 'Hosts rules' }];
    this.state = { breadcrumbs: thisBreadcrumbs, hostname: thisHostname, rules: [], allRules: [], loadedRules: false, loading: false };
  }

  componentDidMount () {
    this.loadHostRules();
    this.loadAllRules();
  }

  componentDidUpdate () {
    M.updateTextFields();
  }

    loadHostRules = () => {
      this.setState({ loadedRules: false, loading: true });
      const self = this;
      Utils.ajaxGet('/hosts/' + self.state.hostname + '/rules',
        function (data) {
          self.setState({ rules: data, loadedRules: true, loading: false });
        });
    };

    loadAllRules = () => {
      this.setState({ loading: true });
      const self = this;
      Utils.ajaxGet('/rules/host',
        function (data) {
          self.setState({ allRules: data, loading: false });
        });
    };

    onRemoveRule = (ruleId, event) => {
      const formAction = '/hosts/' + this.state.hostname + '/rules';
      const self = this;
      const data = {
        hostname: self.state.hostname,
        ruleId: Number(ruleId)
      };
      Utils.formSubmit(formAction, 'DELETE', JSON.stringify(data), function (data) {
        M.toast({ html: '<div>Rule successfully deleted from hosts rules!</div>' });
        self.loadHostRules();
      });
    };

    addRule = (ruleId, event) => {
      const formAction = '/hosts/' + this.state.hostname + '/rules';
      const self = this;
      const data = {
        hostname: self.state.hostname,
        ruleId: Number(ruleId)
      };
      Utils.formSubmit(formAction, 'POST', JSON.stringify(data), function (data) {
        M.toast({ html: '<div>Rule successfully added to host rules!</div>' });
        self.loadHostRules();
      });
    };

    renderRules = () => {
      let rulesNodes;
      const self = this;
      const style = { marginTop: '-4px' };
      if (this.state.rules) {
        rulesNodes = this.state.rules.map(function (hostRule) {
          return (
            <li key={hostRule.rule.id} className="collection-item">
              <div>
                {hostRule.rule.ruleName}
                <a style={style} className="secondary-content btn-floating btn-small waves-effect waves-light" onClick={(e) => self.onRemoveRule(hostRule.rule.id, e)}>
                  <i className="material-icons">clear</i>
                </a>
              </div>
            </li>
          );
        });
      }
      return rulesNodes;
    };

    renderAddRules = () => {
      let ruleNodes;
      const style = { marginTop: '-4px' };
      const self = this;
      function canAddRule (ruleId) {
        for (let i = 0; i < self.state.rules.length; i++) {
          if (self.state.rules[i].rule.id === ruleId) {
            return false;
          }
        }
        return true;
      }
      if (this.state.allRules && this.state.loadedRules) {
        ruleNodes = this.state.allRules.map(function (rule) {
          if (canAddRule(rule.id)) {
            return (
              <li key={rule.id} className="collection-item">
                <div>
                  {rule.ruleName}
                  <a style={style} className="secondary-content btn-floating btn-small waves-effect waves-light" onClick={(e) => self.addRule(rule.id, e)}>
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
          {ruleNodes}
        </ul>
      );
    };

    render () {
      return (
        <MainLayout title='Host detail' breadcrumbs={this.state.breadcrumbs}>
          <div className='row'>
            <div className="input-field col s12">
              <input disabled={true} value={this.state.hostname} name="hostname" id="hostname" type="text"/>
              <label htmlFor="hostname">Hostname</label>
            </div>
            <div>
              <h5>Rules</h5>
              <ul className="collection">
                {this.renderRules()}
              </ul>
              <br/>
              <h5>Add rules</h5>
              {this.renderAddRules()}
            </div>
          </div>
        </MainLayout>
      );
    }
}

class GenericHostRules extends React.Component {
  constructor (props) {
    super(props);
    this.state = { genericHostRules: [], loading: false };
  }

  componentDidMount () {
    this.loadGenericHostRules();
  }

    loadGenericHostRules = () => {
      this.setState({ loading: true });
      const self = this;
      Utils.ajaxGet('/hosts/genericRules',
        function (data) {
          self.setState({ genericHostRules: data, loading: false });
        });
    };

    renderGenericHostRules () {
      let genericHostRulesNodes;
      if (this.state.genericHostRules) {
        genericHostRulesNodes = this.state.genericHostRules.map(function (genericHostRule) {
          return (
            <div key={genericHostRule.id} className='row'>
              <div className='col s12'>
                <div className='card'>
                  <div className='card-content'>
                    {genericHostRule.rule.ruleName}
                  </div>
                </div>
              </div>
            </div>
          );
        });
      }
      return genericHostRulesNodes;
    }

    render () {
      return (
        <div>
          {this.renderGenericHostRules()}
        </div>
      );
    }
}

export class GenericHostsRulesList extends React.Component {
  constructor (props) {
    super(props);
  }

  render () {
    return (
      <MainLayout title='Generic hosts rules'>
        <div className="right-align">
          <div className="row">
            <div className="col s12">
              <Link className="waves-effect waves-light btn-small" to={'/ui/rules/generic/hosts/detail'}>
                                View details
              </Link>
            </div>
          </div>
        </div>
        <GenericHostRules/>
      </MainLayout>
    );
  }
}

export class GenericHostRulesPage extends React.Component {
  constructor (props) {
    super(props);
    this.state = { rules: [], allRules: [], loadedRules: false, loading: false };
  }

  componentDidMount () {
    this.loadHostRules();
    this.loadAllRules();
  }

  componentDidUpdate () {
    M.updateTextFields();
  }

    loadHostRules = () => {
      this.setState({ loadedRules: false, loading: true });
      const self = this;
      Utils.ajaxGet('/hosts/genericRules',
        function (data) {
          self.setState({ rules: data, loadedRules: true, loading: false });
        });
    };

    loadAllRules = () => {
      this.setState({ loading: true });
      const self = this;
      Utils.ajaxGet('/rules/host',
        function (data) {
          self.setState({ allRules: data, loading: false });
        });
    };

    onRemoveRule = (ruleId, event) => {
      const formAction = '/hosts/genericRules/' + ruleId;
      const self = this;
      Utils.formSubmit(formAction, 'DELETE', {}, function (data) {
        M.toast({ html: '<div>Rule successfully deleted from generic hosts rules!</div>' });
        self.loadHostRules();
      });
    };

    addRule = (ruleId, event) => {
      const formAction = '/hosts/genericRules/' + ruleId;
      const formMethod = 'POST';
      const self = this;
      Utils.formSubmit(formAction, formMethod, {}, function (data) {
        M.toast({ html: '<div>Rule successfully added to generic host rules!</div>' });
        self.loadHostRules();
      });
    };

    renderRules = () => {
      let rulesNodes;
      const self = this;
      const style = { marginTop: '-4px' };
      if (this.state.rules) {
        rulesNodes = this.state.rules.map(function (hostRule) {
          return (
            <li key={hostRule.rule.id} className="collection-item">
              <div>
                {hostRule.rule.ruleName}
                <a style={style} className="secondary-content btn-floating btn-small waves-effect waves-light" onClick={(e) => self.onRemoveRule(hostRule.rule.id, e)}>
                  <i className="material-icons">clear</i>
                </a>
              </div>
            </li>
          );
        });
      }
      return rulesNodes;
    };

    renderAddRules = () => {
      let ruleNodes;
      const style = { marginTop: '-4px' };
      const self = this;
      function canAddRule (ruleId) {
        for (let i = 0; i < self.state.rules.length; i++) {
          if (self.state.rules[i].rule.id === ruleId) {
            return false;
          }
        }
        return true;
      }
      if (this.state.allRules && this.state.loadedRules) {
        ruleNodes = this.state.allRules.map(function (rule) {
          if (canAddRule(rule.id)) {
            return (
              <li key={rule.id} className="collection-item">
                <div>
                  {rule.ruleName}
                  <a style={style} className="secondary-content btn-floating btn-small waves-effect waves-light" onClick={(e) => self.addRule(rule.id, e)}>
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
          {ruleNodes}
        </ul>
      );
    };

    render () {
      return (
        <MainLayout title='Generic hosts rules detail'>
          <div className='row'>
            <div>
              <h5>Rules</h5>
              <ul className="collection">
                {this.renderRules()}
              </ul>
              <br/>
              <h5>Add rules</h5>
              {this.renderAddRules()}
            </div>
          </div>
        </MainLayout>
      );
    }
}

class ServiceRules extends React.Component {
  constructor (props) {
    super(props);
    this.state = { serviceRules: [], loading: false };
  }

  componentDidMount () {
    this.loadServiceRules();
  }

    loadServiceRules = () => {
      this.setState({ loading: true });
      const self = this;
      Utils.ajaxGet('/services/' + self.props.service.id + '/rules', // TODO confirm
        function (data) {
          self.setState({ serviceRules: data, loading: false });
        });
    };

    renderServiceRules () {
      let serviceRulesNodes;
      if (this.state.serviceRules) {
        serviceRulesNodes = this.state.serviceRules.map(function (serviceRule) {
          return (
            <div key={serviceRule.rule.id}>
              <div className='card'>
                <div className='card-content'>
                  {serviceRule.rule.ruleName}
                </div>
              </div>
            </div>
          );
        });
      }
      return serviceRulesNodes;
    }

    render () {
      return (
        <div>
          <h5>Rules</h5>
          {this.renderServiceRules()}
        </div>
      );
    }
}

export class ServicesRulesList extends React.Component {
  constructor (props) {
    super(props);
    this.state = { services: [], loading: false };
  }

  componentDidMount () {
    this.loadServices();
  }

    loadServices = () => {
      this.setState({ loading: true });
      const self = this;
      Utils.ajaxGet('/services',
        function (data) {
          self.setState({ services: data, loading: false });
        });
    };

    renderServices = () => {
      let serviceNodes;
      if (this.state.services) {
        serviceNodes = pt.unl.fct.microserviceManagement.managerMaster.entities.service.map(function (service) {
          return (
            <div key={service.id} className='row'>
              <div className='col s12'>
                <div className='card'>
                  <div className='card-content'>
                    <div className="right-align">
                      <div className="row">
                        <div className="col s12">
                          <Link className="waves-effect waves-light btn-small" to={'/ui/rules/services/detail/' + service.id}>
                                                    View details
                          </Link>
                        </div>
                      </div>
                    </div>
                    <CardItem label='Service' value={service.serviceName}/>
                    <ServiceRules service={service}/>
                  </div>
                </div>
              </div>
            </div>
          );
        });
      }
      return serviceNodes;
    };

    render () {
      return (
        <MainLayout title='Services rules'>
          {this.renderServices()}
        </MainLayout>
      );
    }
}

export class ServiceRulesPage extends React.Component {
  constructor (props) {
    super(props);
    let thisServiceId = 0;
    if (props.match.params.serviceId) {
      thisServiceId = props.match.params.serviceId;
    }
    const thisBreadcrumbs = [{ link: '/ui/rules/services', title: 'Services rules' }];
    this.state = { breadcrumbs: thisBreadcrumbs, serviceId: thisServiceId, service: {}, rules: [], allRules: [], loadedRules: false, loading: false };
  }

  componentDidMount () {
    this.loadService();
    this.loadServiceRules();
    this.loadAllRules();
  }

  componentDidUpdate () {
    M.updateTextFields();
  }

    loadService = () => {
      const self = this;
      Utils.ajaxGet('/services/' + self.state.serviceId,
        function (data) {
          self.setState({ service: data, loading: false });
        });
    };

    loadServiceRules = () => {
      this.setState({ loadedRules: false, loading: true });
      const self = this;
      Utils.ajaxGet('/services/' + self.state.serviceId + '/rules',
        function (data) {
          self.setState({ rules: data, loadedRules: true, loading: false });
        });
    };

    loadAllRules = () => {
      this.setState({ loading: true });
      const self = this;
      Utils.ajaxGet('/rules/container',
        function (data) {
          self.setState({ allRules: data, loading: false });
        });
    }

    onRemoveRule = (ruleId, event) => {
      const formAction = '/services/' + this.state.serviceId + '/rules';
      const self = this;
      const data = {
        serviceId: Number(self.state.serviceId),
        ruleId: Number(ruleId)
      };
      Utils.formSubmit(formAction, 'DELETE', JSON.stringify(data), function (data) {
        M.toast({ html: '<div>Rule successfully deleted from service rules!</div>' });
        self.loadServiceRules();
      });
    };

    addRule = (ruleId, event) => {
      const formAction = '/services/' + this.state.serviceId + '/rules';
      const self = this;
      const data = {
        serviceId: Number(self.state.serviceId),
        ruleId: Number(ruleId)
      };
      Utils.formSubmit(formAction, 'POST', JSON.stringify(data), function (data) {
        M.toast({ html: '<div>Rule successfully added to service rules!</div>' });
        self.loadServiceRules();
      });
    };

    renderRules = () => {
      let rulesNodes;
      const self = this;
      const style = { marginTop: '-4px' };
      if (this.state.rules) {
        rulesNodes = this.state.rules.map(function (serviceRule) {
          return (
            <li key={serviceRule.rule.id} className="collection-item">
              <div>
                {serviceRule.rule.ruleName}
                <a style={style} className="secondary-content btn-floating btn-small waves-effect waves-light" onClick={(e) => self.onRemoveRule(serviceRule.rule.id, e)}>
                  <i className="material-icons">clear</i>
                </a>
              </div>
            </li>
          );
        });
      }
      return rulesNodes;
    };

    renderAddRules = () => {
      let ruleNodes;
      const style = { marginTop: '-4px' };
      const self = this;
      function canAddRule (ruleId) {
        for (let i = 0; i < self.state.rules.length; i++) {
          if (self.state.rules[i].rule.id === ruleId) {
            return false;
          }
        }
        return true;
      }
      if (this.state.allRules && this.state.loadedRules) {
        ruleNodes = this.state.allRules.map(function (rule) {
          if (canAddRule(rule.id)) {
            return (
              <li key={rule.id} className="collection-item">
                <div>
                  {rule.ruleName}
                  <a style={style} className="secondary-content btn-floating btn-small waves-effect waves-light" onClick={(e) => self.addRule(rule.id, e)}>
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
          {ruleNodes}
        </ul>
      );
    };

    render () {
      return (
        <MainLayout title='Service rules detail' breadcrumbs={this.state.breadcrumbs}>
          <div className='row'>
            <div className="input-field col s12">
              <input disabled={true} value={this.state.service.serviceName} name="serviceName" id="serviceName" type="text"/>
              <label htmlFor="serviceName">Service name</label>
            </div>
            <div>
              <h5>Rules</h5>
              <ul className="collection">
                {this.renderRules()}
              </ul>
              <br/>
              <h5>Add rules</h5>
              {this.renderAddRules()}
            </div>
          </div>
        </MainLayout>
      );
    }
}
