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
import { CardItem } from '../sharedComponents/cardItem';

export class ServiceCard extends React.Component {
  constructor (props) {
    super(props);
    const service = this.props.service;
    this.state = { data: service, loading: false };
  }

  renderLink () {
    return (
      <div className="right-align">
        <div className="row">
          <div className="col s12">
            <Link className="waves-effect waves-light btn-small" to={'/ui/services/detail/' + this.state.data.id}>
              View details
            </Link>
          </div>
        </div>
      </div>
    );
  }

  renderSimple () {
    const linkDetails = this.props.viewDetails ? this.renderLink() : null;
    return (
      <div>
        {linkDetails}
        <CardItem label='Service name' value={this.state.data.serviceName}/>
        <CardItem label='Docker Repository' value={this.state.data.dockerRepository}/>
        <CardItem label='Default external port' value={this.state.data.defaultExternalPort}/>
        <CardItem label='Default internal port' value={this.state.data.defaultInternalPort}/>
        <CardItem label='Default database' value={this.state.data.defaultDb}/>
        <CardItem label='Launch command' value={this.state.data.launchCommand}/>
        <CardItem label='Minimum Replics' value={this.state.data.minReplics}/>
        <CardItem label='Maximum Replics' value={this.state.data.maxReplics}/>
        <CardItem label='Output label' value={this.state.data.outputLabel}/>
        <CardItem label='Service type' value={this.state.data.serviceType}/>
        <CardItem label='Average Memory (bytes)' value={this.state.data.expectedMemoryConsumption}/>
      </div>
    );
  };

  renderCard () {
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
