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
import RuleCard from './RuleCard';
import MainLayout from '../shared/MainLayout';
import { Link } from 'react-router-dom';
import {getData} from "../../utils/api";

export default class Rules extends React.Component {
  constructor (props) {
    super(props);
    this.state = { data: [], loading: false };
  }

  componentDidMount = () => {
    this.loadRules();
  };

  loadRules = () => {
    this.setState({ loading: true });
    getData(
        '/rules',
        data => this.setState({ data: data, loading: false })
    );
  };

  /*<MainLayout title={{title:'Rules'}}>*/
  render = () => {
    return (
        <MainLayout>
          {this.state.data && this.state.data.map(rule => (
              <RuleCard viewDetails={true} key={rule.id} rule={rule}/>
          ))}
          <div className="fixed-action-btn tooltipped" data-position="left" data-tooltip="New rule">
            <Link className="waves-effect waves-light btn-floating grey darken-3" to='/rules/rule'>
              <i className="large material-icons">add</i>
            </Link>
          </div>
        </MainLayout>
    );
  };
}
