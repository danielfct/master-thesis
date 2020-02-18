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
import MainLayout from '../shared/MainLayout';
import ServiceCard from './ServiceCard';

import AddButton from "../shared/AddButton";
import {connect} from "react-redux";
import {loadServices} from "../../actions";
import {ReduxState} from "../../reducers";
import CardList from "../shared/CardList";
import {IService} from "./Service";
import './Services.css'
import Empty from "../shared/Empty";

interface StateToProps {
  isLoading: boolean
  error: string;
  services: IService[];
}

interface DispatchToProps {
  loadServices: (name?: string) => any;
}

type Props = StateToProps & DispatchToProps;

class Services extends React.Component<Props, {}> {

  public componentDidMount = () =>
    this.props.loadServices();

  private service = (service: IService): JSX.Element =>
    <ServiceCard key={service.id} service={service} />;

  private predicate = (service: IService, search: string): boolean =>
    service.serviceName.includes(search);

  render = () =>
    <MainLayout>
      <AddButton tooltip={'Add service'} pathname={'/services/service?new=true'}/>
      <div className="services-container">
        {console.log(this.props.services)}
        <CardList<IService>
          isLoading={this.props.isLoading}
          error={this.props.error}
          emptyMessage={"No services to display"}
          list={this.props.services}
          card={this.service}
          predicate={this.predicate}/>
      </div>
    </MainLayout>

}

const mapStateToProps = (state: ReduxState): StateToProps => {
  console.log(state.entities.services.data)
  return {
    isLoading: state.entities.services.isLoading,
    error: state.entities.services.error,
    services: Object.values(state.entities.services.data),
  }
};

const mapDispatchToProps: DispatchToProps = {
  loadServices,
};

export default connect(mapStateToProps, mapDispatchToProps)(Services);
