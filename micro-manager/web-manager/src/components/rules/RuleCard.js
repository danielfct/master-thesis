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
import Utils from '../../utils';
import ConditionCard from './ConditionCard';
import { Link } from 'react-router-dom';
import CardItem from '../shared/CardItem';

export default class RuleCard extends React.Component {
  constructor (props) {
    super(props);
    const rule = this.props.rule;
    this.state = { data: rule, conditions: [], loading: false };
  }

  componentDidMount = () => {
    this.loadConditions();
  };

  componentDidUpdate = () => {
    const elems = document.querySelectorAll('.collapsible');
    M.Collapsible.init(elems);
  };

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
          <li key={condition.id}>
            <div className="collapsible-header">
              {condition.field.fieldName + ' ' + condition.operator.operatorSymbol + ' ' + condition.conditionValue}
            </div>
            <div className="collapsible-body">
              <ConditionCard renderSimple={true} viewDetails={false} condition={condition}/>
            </div>
          </li>
        );
      });
    }
    return conditionNodes;
  };

  renderLink = () => (
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

  renderCard = () => (
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

  render = () => this.props.renderSimple ? this.renderSimple() : this.renderCard();
}
