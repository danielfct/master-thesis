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
import {RouteComponentProps} from 'react-router';
import Form, {IFields, required, requiredAndNumberAndMin} from "../../components/form/Form"
import IData from "../../components/IData";
import ServiceDependencyList from "./ServiceDependencyList";
import {addServiceDependency, loadServices} from "../../actions";
import {connect} from "react-redux";
import MainLayout from "../../views/mainLayout/MainLayout";
import LoadingSpinner from "../../components/LoadingSpinner";
import * as queryString from "querystring";
import {ReduxState} from "../../reducers";
import Field, {getTypeFromValue} from "../../components/form/Field";
import BaseComponent from "../../components/BaseComponent";
import Error from "../../components/errors/Error";
import Tabs, {Tab} from "../../components/tabs/Tabs";
import {patchData} from "../../utils/api";
import {hasNewSearch} from "../../utils/text";
import ServiceAppList from "./ServiceAppList";

export interface IService extends IData {
  serviceName: string;
  dockerRepository: string;
  defaultExternalPort: number;
  defaultInternalPort: number;
  defaultDb: string;
  launchCommand: string;
  minReplicas: number;
  maxReplicas: number;
  outputLabel: string;
  serviceType: string;
  expectedMemoryConsumption: number;
  dependencies?: string[];
}

const emptyService = (): Partial<IService> => ({
  serviceName: '',
  dockerRepository: '',
  defaultExternalPort: 0,
  defaultInternalPort: 0,
  defaultDb: '',
  launchCommand: '',
  minReplicas: 0,
  maxReplicas: 0,
  outputLabel: '',
  serviceType: '',
  expectedMemoryConsumption: 0,
});

const getServiceNameFromPathname = (props: Props) =>
  props.match.params.name.split('#')[0];

interface StateToProps {
  isLoadingServices: boolean;
  isLoadingDependencies: boolean;
  isLoadingApps: boolean;
  loadServicesError?: string | null;
  loadDependenciesError?: string | null;
  loadAppsError?: string | null;
  service: Partial<IService>;
  formService?: Partial<IService>,
}

interface DispatchToProps {
  loadServices: (name: string) => any;
  addServiceDependency: (serviceName: string, dependencyName: string) => void;
}

interface MatchParams {
  name: string;
}

type Props = StateToProps & DispatchToProps & RouteComponentProps<MatchParams>;

interface State {
  newDependencies: string[];
  newApps: string[];
}

class Service extends BaseComponent<Props, State> {

  state: State = {
    newDependencies: [],
    newApps: [],
  };

  componentDidMount(): void {
    const serviceName = getServiceNameFromPathname(this.props);
    if (serviceName && !hasNewSearch(this.props.location.search)) {
      this.props.loadServices(serviceName);
    }
  };

  private onAddServiceDependency = (dependency: string): void => {
    this.setState({ newDependencies: this.state.newDependencies.concat(dependency) });
  };

  private onRemoveServiceDependencies = (dependencies: string[]): void => {
    this.setState({
      newDependencies: this.state.newDependencies.filter(dependency => !dependencies.includes(dependency))
    });
  };

  private saveServiceDependencies = (serviceName: string, successCallback: () => void): void => {
    if (this.state.newDependencies.length) {
      patchData(`services/${serviceName}/dependencies`, this.state.newDependencies,
        () => this.onSaveDependenciesSuccess(serviceName, successCallback),
        (reason) => this.onSaveDependenciesFailure(serviceName, reason), 'post');
    }
    else {
      successCallback();
    }
  };

  private onSaveDependenciesSuccess = (serviceName: string, successCallback: () => void): void => {
    successCallback();
    if (!hasNewSearch(this.props.location.search)) {
      this.state.newDependencies.forEach(dependencyName =>
        this.props.addServiceDependency(serviceName, dependencyName)
      );
    }
    this.setState({ newDependencies: [] });
  };

  private onSaveDependenciesFailure = (serviceName: string, reason: string): void =>
    super.toast(`Service <b>${serviceName}</b> saved, but unable to save dependencies`, 10000, reason, true);

  private addServiceApp = (appName: string): void => {
    this.setState({ newApps: this.state.newApps.concat(appName) });
  };

  private onPostSuccess = (serviceName: string): void => {
    this.saveServiceDependencies(serviceName, () => super.toast(`Service <b>${serviceName}</b> is now created`));
  };

  private onPostFailure = (reason: string, serviceName: string): void =>
    super.toast(`Unable to save ${serviceName}`, 10000, reason, true);

  private onPutSuccess = (serviceName: string): void => {
    this.saveServiceDependencies(serviceName, () => super.toast(`Changes to service <b>${serviceName}</b> are now saved`));
  };

  private onPutFailure = (reason: string, serviceName: string): void =>
    super.toast(`Unable to update ${serviceName}`, 10000, reason, true);

  private onDeleteSuccess = (serviceName: string): void => {
    super.toast(`Service <b>${serviceName}</b> successfully removed`);
    this.props.history.push(`/services`)
  };

  private onDeleteFailure = (reason: string, serviceName: string): void =>
    super.toast(`Unable to delete ${serviceName}`, 10000, reason, true);

  private getFields = (service: Partial<IService>): IFields =>
    Object.entries(service).map(([key, value]) => {
      return {
        [key]: {
          id: key,
          label: key,
          validation: getTypeFromValue(value) === 'number'
            ? { rule: requiredAndNumberAndMin, args: 0 }
            : { rule: required }
        }
      };
    }).reduce((fields, field) => {
      for (let key in field) {
        fields[key] = field[key];
      }
      return fields;
    }, {});

  private details = () => {
    const {isLoadingServices, loadServicesError, formService, service} = this.props;
    // @ts-ignore
    const serviceKey: (keyof IService) = formService && Object.keys(formService)[0];
    return (
      <>
        {isLoadingServices && <LoadingSpinner/>}
        {loadServicesError && <Error message={loadServicesError}/>}
        {!loadServicesError && formService && (
          <Form id={serviceKey}
                fields={this.getFields(formService)}
                values={service}
                isNew={hasNewSearch(this.props.location.search)}
                showSaveButton={!!this.state.newDependencies.length}
                post={{url: 'services', successCallback: this.onPostSuccess, failureCallback: this.onPostFailure}}
                put={{url: `services/${service[serviceKey]}`, successCallback: this.onPutSuccess, failureCallback: this.onPutFailure}}
                delete={{url: `services/${service[serviceKey]}`, successCallback: this.onDeleteSuccess, failureCallback: this.onDeleteFailure}}>
            {Object.keys(formService).map((key, index) =>
              key === 'serviceType'
                ? <Field key={index}
                         id={key}
                         type="dropdown"
                         label={key}
                         options={{defaultValue: "Choose service type", values: ["Frontend", "Backend", "Database", "System"]}}/>
                : <Field key={index}
                         id={key}
                         label={key}/>
            )}
          </Form>
        )}
      </>
    )
  };

  private apps = () => {
    const {isLoadingApps, loadAppsError, service} = this.props;
    return (
      <>
        {isLoadingApps &&
        <LoadingSpinner/>}
        {loadAppsError &&
        <Error message={loadAppsError}/>}
        {!loadAppsError && service &&
        <ServiceAppList service={service} addServiceAppCallback={this.addServiceApp}/>}
      </>
    )
  };

  private dependencies = () => {
    const {newDependencies} = this.state;
    const {isLoadingDependencies, loadDependenciesError, service} = this.props;
    return (
      <>
        {isLoadingDependencies &&
        <LoadingSpinner/>}
        {loadDependenciesError &&
        <Error message={loadDependenciesError}/>}
        {!loadDependenciesError && service &&
        <ServiceDependencyList service={service}
                               newDependencies={newDependencies}
                               onAddServiceDependency={this.onAddServiceDependency}
                               onRemoveServiceDependencies={this.onRemoveServiceDependencies}/>}
      </>
    )
  };

  private dependentBy = () => {
    return (
      <div/>
    )
  };

  private predictions = () => {
    return (
      <div/>
    )
  };

  private rules = () => {
    return (
      <div/>
    );
  };

  private tabs: Tab[] = [
    {
      title: 'Service',
      id: 'service',
      content: () => this.details()
    },
    {
      title: 'Apps',
      id: 'apps',
      content: () => this.apps()
    },
    {
      title: 'Dependencies',
      id: 'dependencies',
      content: () => this.dependencies()
    },
    {
      title: 'Dependent by',
      id: 'dependentBy',
      content: () => this.dependentBy()
    },
    {
      title: 'Predictions',
      id: 'predictions',
      content: () => this.predictions()
    },
    {
      title: 'Rules',
      id: 'rules',
      content: () => this.rules()
    }
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
  const name = getServiceNameFromPathname(props);
  const service = hasNewSearch(props.location.search) ? emptyService() : state.entities.services.data[name];
  let formService;
  if (service) {
    formService = { ...service };
    delete formService["id"];
    delete formService["dependencies"];
  }
  const isLoadingServices = state.entities.services?.isLoadingServices;
  const isLoadingDependencies = state.entities.services?.isLoadingDependencies;
  const isLoadingApps = state.entities.services?.isLoadingApps;
  const loadServicesError = state.entities.services?.loadServicesError;
  const loadDependenciesError = state.entities.services?.loadDependenciesError;
  const loadAppsError = state.entities.services?.loadAppsError;
  return  {
    isLoadingServices,
    isLoadingDependencies,
    isLoadingApps,
    loadServicesError,
    loadDependenciesError,
    loadAppsError,
    service,
    formService,
  }
}

const mapDispatchToProps: DispatchToProps = {
  loadServices,
  addServiceDependency
};

export default connect(mapStateToProps, mapDispatchToProps)(Service);
