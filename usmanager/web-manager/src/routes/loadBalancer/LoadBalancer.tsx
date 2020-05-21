/*
 * Copyright (c) 2020 usmanager
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import BaseComponent from "../../components/BaseComponent";
import React from "react";
import {RouteComponentProps} from "react-router";
import Form, {IFields, required, requiredAndTrimmed} from "../../components/form/Form";
import ListLoadingSpinner from "../../components/list/ListLoadingSpinner";
import Error from "../../components/errors/Error";
import Field from "../../components/form/Field";
import Tabs, {Tab} from "../../components/tabs/Tabs";
import MainLayout from "../../views/mainLayout/MainLayout";
import {ReduxState} from "../../reducers";
import {loadRegions, loadServices} from "../../actions";
import {connect} from "react-redux";
import {IService} from "../services/Service";
import {IRegion} from "../region/Region";
import {IReply} from "../../utils/api";

export interface ILoadBalancer {
}

const buildNewLoadBalancer = (): Partial<ILoadBalancer> => ({
  service: undefined,
});

const isLaunchLoadBalancer = (id: string) =>
  id === 'launch';


interface StateToProps {
  isLoading: boolean;
  error?: string | null;
  loadBalancer: Partial<ILoadBalancer>;
  formLoadBalancer?: Partial<ILoadBalancer>; //TODO remove formLoadBalancer if not needed
  services: { [key: string]: IService };
  regions: { [key: string]: IRegion };
}

interface DispatchToProps {
  loadServices: () => any;
  loadRegions: () => any;
  //addLoadBalancer: () => void; TODO
}

interface MatchParams {
  id: string;
}

type Props = StateToProps & DispatchToProps & RouteComponentProps<MatchParams>;


class LoadBalancer extends BaseComponent<Props, {}> {

  //TODO change toasts messages

  componentDidMount(): void {
    this.props.loadServices();
    this.props.loadRegions();
  }

  private onPostSuccess = (reply: IReply<ILoadBalancer>): void => {
    //super.toast(`Load balancer <b>${edgeHostHostname}</b> saved`); TODO
  };

  private onPostFailure = (reason: string): void =>
    super.toast(`Unable to launch load balancer`, 10000, reason, true);

  private onDeleteSuccess = (id: string): void => {
    super.toast(`<span class="green-text">${id} load-balancer successfully stopped</span>`);
    this.props.history.push(`/load-balancers`)
  };

  private onDeleteFailure = (reason: string, id: string): void =>
    super.toast(`Unable to stop load balancer ${id}`, 10000, reason, true);

  private getFields = (loadBalancer: Partial<ILoadBalancer>): IFields =>
    Object.entries(loadBalancer).map(([key, _]) => {
      return {
        [key]: {
          id: key,
          label: key,
          validation: { rule: requiredAndTrimmed }
        }
      };
    }).reduce((fields, field) => {
      for (let key in field) {
        fields[key] = field[key];
      }
      return fields;
    }, {});

  private serviceOption = (service: string) =>
    service;

  private getSelectableServices = () =>
    this.props.services && Object.keys(this.props.services);

  private loadBalancer = () => {
    const {isLoading, error, formLoadBalancer, loadBalancer} = this.props;
    // @ts-ignore
    const loadBalancerKey: (keyof ILoadBalancer) = formLoadBalancer && Object.keys(formLoadBalancer)[0];
    return (
      <>
        {isLoading && <ListLoadingSpinner/>}
        {!isLoading && error && <Error message={error}/>}
        {!isLoading && !error && formLoadBalancer && (
          <Form id={loadBalancerKey}
                fields={this.getFields(formLoadBalancer)}
                values={loadBalancer}
                isNew={isLaunchLoadBalancer(this.props.match.params.id)}
                post={{
                  textButton: 'launch',
                  url: 'containers/loadBalancer',
                  successCallback: this.onPostSuccess,
                  failureCallback: this.onPostFailure}}
                delete={{
                  url: `loadBalancers/${loadBalancer[loadBalancerKey]}`,
                  successCallback: this.onDeleteSuccess,
                  failureCallback: this.onDeleteFailure}}>
            {Object.entries(formLoadBalancer).map((([key, value], index) =>
                key === 'service'
                  ? <Field key={index}
                           id={key}
                           label={key}
                           type={'dropdown'}
                           dropdown={{
                             defaultValue: "Select service",
                             values: this.getSelectableServices(),
                             optionToString: this.serviceOption}}/>
                  :
                  key === 'regions'
                    ? <Field key={index}
                             id={key}
                             label={key}
                             type={'list'}
                             value={value}/>
                    : <Field key={index}
                             id={key}
                             label={key}/>
            ))}
          </Form>
        )}
      </>
    )
  };

  private tabs: Tab[] = [
    {
      title: 'Load balancer',
      id: 'loadBalancer',
      content: () => this.loadBalancer()
    },
  ];

  render() {
    return (
      <MainLayout>
        <div className="container">
          <Tabs {...this.props} tabs={this.tabs}/>
        </div>
      </MainLayout>
    );
  }

}

function mapStateToProps(state: ReduxState, props: Props): StateToProps {
  const regions = state.entities.regions.data;
  const isLoading = false; //state.entities.loadBalancers.loading;
  const error = null; //state.entities.loadBalancers.error;
  const id = props.match.params.id;
  const loadBalancer = isLaunchLoadBalancer(id) ? buildNewLoadBalancer() : {}; //state.entities.loadBalancers.data[id];
  let formLoadBalancer;
  if (loadBalancer) {
    formLoadBalancer = { ...loadBalancer, regions: Object.keys(regions) };
  }
  const services = state.entities.services.data;
  return  {
    isLoading,
    error,
    loadBalancer,
    formLoadBalancer,
    services,
    regions
  }
}

const mapDispatchToProps: DispatchToProps = {
  loadServices,
  loadRegions,
};

export default connect(mapStateToProps, mapDispatchToProps)(LoadBalancer);
