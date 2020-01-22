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
import { Link } from 'react-router-dom';
import CardItem from '../shared/CardItem';

export default class ConditionCard extends React.Component {
  constructor (props) {
    super(props);
    const condition = this.props.condition;
    this.state = { data: condition, loading: false };
  }

  renderLink = () => (
    <div className="right-align">
      <div className="row">
        <div className="col s12">
          <Link className="waves-effect waves-light btn-small"
                to={'/rules/conditions/condition/' + this.state.data.id}>
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
        <CardItem label='Value mode' value={this.state.data.valueMode.valueModeName}/>
        <CardItem label='Field' value={this.state.data.field.fieldName}/>
        <CardItem label='Operator' value={this.state.data.operator.operatorSymbol}/>
        <CardItem label='Condition value' value={this.state.data.conditionValue}/>
      </div>
    );
  };

  renderCard = () => (
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

  render = () => this.props.renderSimple ? this.renderSimple() : this.renderCard();
}
