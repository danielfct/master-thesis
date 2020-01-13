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
import Utils from '../../utils';
import ConditionCard from './ConditionCard';
import MainLayout from '../shared/MainLayout';
import { Link } from 'react-router-dom';

export default class Conditions extends React.Component {
  constructor (props) {
    super(props);
    this.state = { data: [], loading: false };
  }

  componentDidMount = () => {
    this.loadConditions();
  };

  loadConditions = () => {
    this.setState({ loading: true });
    Utils.ajaxGet(
      'localhost/conditions',
      data => this.setState({ data: data, loading: false })
    );
  };

  render = () => {
    let conditionNodes;
    if (this.state.data) {
      conditionNodes = this.state.data.map(function (condition) {
        return (
          <ConditionCard viewDetails={true} key={condition.id} condition={condition}/>
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
  };
}
