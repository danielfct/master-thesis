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
import CardItem from '../shared/CardItem';
import {deleteData} from "../../utils/api";

export default class NodeCard extends React.Component {
  onClickStop = () => {
    deleteData(
      `http://localhostnodes/${this.props.node.hostname}`, //TODO fix server
      () => {
        M.toast({ html: '<div>Node removed successfully!</div>' });
        this.props.reloadNodes();
      });
  };

  render = () => (
    <div className='row'>
      <div className='col s12'>
        <div className='card'>
          <div className='card-content'>
            <div className="right-align">
              <div className="row">
                <div className="col s12">
                  <button disabled={this.props.node.role === 'manager'}
                          className="waves-effect waves-light btn-small red darken-4"
                          onClick={this.onClickStop}>Remove node
                  </button>
                </div>
              </div>
            </div>
            <CardItem label='Id' value={this.props.node.id}/>
            <CardItem label='Hostname' value={this.props.node.hostname}/>
            <CardItem label='Role' value={this.props.node.role}/>
            <CardItem label='State' value={this.props.node.state}/>
          </div>
        </div>
      </div>
    </div>
  );
}
