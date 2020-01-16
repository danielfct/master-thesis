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
import MainLayout from '../shared/MainLayout';

export default class SimulatedMetricsLandingPage extends React.Component {
  constructor (props) {
    super(props);
    const simulatedMetricsLinks = [
      { name: 'Service simulated metrics', link: '/metrics/simulated/services' },
      { name: 'Container simulated metrics', link: '/metrics/simulated/containers' },
      { name: 'Default host simulated metrics', link: '/metrics/simulated/hosts/default' },
      { name: 'Specific host simulated metrics', link: '/metrics/simulated/hosts/specific' }
    ];
    this.state = { links: simulatedMetricsLinks, loading: false };
  }

  renderLinks = () => this.state.links.map(function (link) {
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

  render = () => (
    <MainLayout title='Simulated metrics Management'>
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
