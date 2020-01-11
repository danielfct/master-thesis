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
import { AppLinksDropdown } from './appLinksDropdown';
import { PageTitle } from './pageTitle';
import { AppLinks } from './appLinks';

export class MainLayout extends React.Component {
  constructor (props) {
    super(props);
    const navLinks = [
      { link: '/ui/services', name: 'Services configs' },
      { link: '/ui/apps', name: 'Apps packages' },
      { link: '/ui/edgeHosts', name: 'Edge Hosts' },
      { link: '/ui/regions', name: 'Regions' },
      { link: '/ui/containers', name: 'Containers' },
      { link: '/ui/nodes', name: 'Nodes' },
      { link: '/ui/eureka', name: 'Eureka servers' },
      { link: '/ui/loadBalancer', name: 'Load balancers' },
      { link: '/ui/rules/management', name: 'Rules Management' },
      { link: '/ui/simulatedMetrics/management', name: 'Simulated metrics Management' }
    ];
    this.state = { links: navLinks };
  }

  render () {
    return (
      <div className='row'>
        <AppLinksDropdown links={this.state.links}/>
        <PageTitle title={this.props.title} breadcrumbs={this.props.breadcrumbs}/>
        <div className='col s12 m8'>
          {this.props.children}
        </div>
        <AppLinks links={this.state.links}/>
      </div>
    );
  }
}
