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
import { Link } from 'react-router-dom';
import CardItem from '../../components/list/CardItem';
import MainLayout from '../../views/mainLayout/MainLayout';
import {getData} from "../../utils/api";

export default class AppsRulesList extends React.Component {
  constructor (props) {
    super(props);
    this.state = { apps: [], loading: false };
  }

  componentDidMount() {
    this.loadApps();
  };

  loadApps = () => {
    this.setState({ loading: true });
    getData(
      'http://localhost:8080/apps',
      data => this.setState({ apps: data, loading: false })
    );
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
                        <Link className="waves-effect waves-light btn-small" to={'/rules/apps/app/' + app.id}>
                          View details
                        </Link>
                      </div>
                    </div>
                  </div>
                  <CardItem label='App' value={app.appName}/>
                  {/*<AppRules app={app}/>*/}
                </div>
              </div>
            </div>
          </div>
        );
      });
    }
    return appNodes;
  };
/*<MainLayout title={{title:'Apps rules'}}>*/
  render = () => (
<MainLayout>
      {this.renderApps()}
    </MainLayout>
  );
}
