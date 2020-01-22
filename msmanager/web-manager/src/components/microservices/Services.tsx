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

import React, {Fragment} from 'react';
import MainLayout from '../shared/MainLayout';
import ServiceCard from './ServiceCard';
import AddButton from "../shared/AddButton";
import List from "../shared/List";
import IService from "./IService";

export default class Services extends React.Component<{}, {}> {

  private show = (service: IService): JSX.Element =>
      <ServiceCard key={service.id} service={service} />;

  private predicate = (service: IService, filter: string): boolean =>
      service.serviceName.includes(filter);

  render = () => {
    const ServicesList = List<IService>();
    return (
        <MainLayout title='Services'>
          <Fragment>
            <ServicesList
                url="/services.json" //TODO change url
                show={this.show}
                predicate={this.predicate}
            />
          </Fragment>
          <AddButton tooltip={'Add service'} link={'/services/service'}/>
        </MainLayout>
    )
  }
}
