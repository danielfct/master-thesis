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
import Form, {IFields, required} from "../../components/form/Form";
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
import ListItem from "../../components/list/ListItem";
import styles from "../../components/list/ListItem.module.css";

export interface ILoadBalancer {
}

const emptyLoadBalancer = (): Partial<ILoadBalancer> => ({
  service: undefined,
  regions: [],
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

type State = {
  regions: {name: string, checked: boolean}[],
  displayNoRegionsError: boolean,
}

class LoadBalancer extends BaseComponent<Props, State> {

  state: State = {
    regions: Object.keys(this.props.regions).map(region => ({name: region, checked: false})),
    displayNoRegionsError: false
  };

  componentDidMount(): void {
    this.props.loadServices();
    this.props.loadRegions();
  }

  private checkRegions = (): boolean => {
    const someChecked = this.state.regions.some(region => region.checked);
    if (!someChecked) {
      this.setState({displayNoRegionsError: true});
    }
    return someChecked;
  };

  private onPostSuccess = (reply: any): void => {
    console.log(reply); //TODO show which id it started at
    //super.toast(`Load balancer Edge host <b>${edgeHostHostname}</b> is now saved`);
  };

  private onPostFailure = (reason: string): void =>
    super.toast(`Unable to launch load balancer`, 10000, reason, true);

  private onDeleteSuccess = (id: string): void => {
    super.toast(`Load balancer <b>${id}</b> successfully stopped`);
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
          validation: { rule: required }
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

  private region = (index: number, region: string, checked: boolean): JSX.Element => {
    return (
      <ListItem key={index}>
        <div className={`${styles.nonListContent}`}>
          <label>
            <input id={region}
                   type="checkbox"
                   onChange={this.handleCheckbox}
                   checked={checked}/>
            <span id={'checkbox'}>
                 {region}
            </span>
          </label>
        </div>
      </ListItem>
    );
  };

  //TODO put this login Form
  private handleCheckbox = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {id, checked} = event.target;
    const stateRegion = this.state.regions.find(region => region.name === id);
    if (stateRegion) {
      stateRegion.checked = checked;
    }
    this.setState({regions: this.state.regions, displayNoRegionsError: false});
  };

  private loadBalancer = () => {
    const {isLoading, error, formLoadBalancer, loadBalancer} = this.props;
    const {regions} = this.state;
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
                  url: 'loadBalancers',
                  beforeCallback: this.checkRegions,
                  successCallback: this.onPostSuccess,
                  failureCallback: this.onPostFailure}}
                delete={{
                  url: `loadBalancers/${loadBalancer[loadBalancerKey]}`,
                  successCallback: this.onDeleteSuccess,
                  failureCallback: this.onDeleteFailure}}>
            {Object.keys(formLoadBalancer).map((key, index) =>
              key === 'service'
                ? <Field key={'service'}
                         id={'service'}
                         label={'service'}
                         type={'dropdown'}
                         dropdown={{
                           defaultValue: "Select service",
                           values: this.getSelectableServices(),
                           optionToString: this.serviceOption}}/>
                : <Field key={index}
                         id={key}
                         label={key}/>
            )}
            <div className='input-field'>
              <h6 className={'white-text'}>Regions</h6>
              {this.state.displayNoRegionsError && (
                <span className='helper-text red-text darken-3'>At least one region is required</span>)}
            </div>
            {regions.map((region, index) =>
              this.region(index, region.name, region.checked)
            )}
          </Form>

        )}
      </>
    )
  };
  /*<LoadBalancerRegionsList regions={this.state.regions}
                                       onAddRegion={this.onAddRegion}
                                       onRemoveRegion={this.onRemoveRegion}>

              </LoadBalancerRegionsList>*/
  /* private rules = (): JSX.Element =>
     <EdgeHostRuleList host={this.props.edgeHost}
                       unsavedRules={this.state.newRules}
                       onAddHostRule={this.onAddEdgeHostRule}
                       onRemoveHostRules={this.onRemoveEdgeHostRules}/>;*/

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
  const isLoading = false //state.entities.loadBalancers.isLoading;
  const error = null //state.entities.loadBalancers.loadError;
  const id = props.match.params.id;
  const loadBalancer = isLaunchLoadBalancer(id) ? emptyLoadBalancer() : {} //state.entities.loadBalancers.data[id];
  let formLoadBalancer;
  if (loadBalancer) {
    formLoadBalancer = { ...loadBalancer };
  }
  const services = state.entities.services.data;
  const regions = state.entities.regions.data;
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
