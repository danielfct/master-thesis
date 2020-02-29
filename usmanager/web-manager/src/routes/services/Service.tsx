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
import Form, {IFields, required, requiredAndNotAllowed, requiredAndNumberAndMin} from "../../components/form/Form"
import IData from "../../components/IData";
import ServiceDependencyList from "./ServiceDependencyList";
import {addServiceDependency, loadServices} from "../../actions";
import {connect} from "react-redux";
import MainLayout from "../../views/mainLayout/MainLayout";
import LoadingSpinner from "../../components/LoadingSpinner";
import {ReduxState} from "../../reducers";
import Field, {getTypeFromValue} from "../../components/form/Field";
import BaseComponent from "../../components/BaseComponent";
import Error from "../../components/errors/Error";
import Tabs, {Tab} from "../../components/tabs/Tabs";
import {patchData} from "../../utils/api";
import ServiceAppList from "./ServiceAppList";
import ServiceDependentList from "./ServiceDependentList";
import ServicePredictionList from "./ServicePredictionList";
import ServiceRuleList from "./ServiceRuleList";

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
  apps?: string[];
  dependencies?: string[];
  dependents?: string[];
  predictions?: string[];
  rules?: string[];
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

const isNewService = (name: string) =>
  name === 'new_service';

interface StateToProps {
  isLoadingServices: boolean;
  isLoadingApps: boolean;
  isLoadingDependencies: boolean;
  isLoadingDependentsBy: boolean;
  isLoadingPredictions: boolean;
  isLoadingRules: boolean;
  loadServicesError?: string | null;
  loadAppsError?: string | null;
  loadDependenciesError?: string | null;
  loadDependentsByError?: string | null;
  loadPredictionsError?: string | null;
  loadRulesError?: string | null;
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

type State = {
  newApps: string[],
  newDependencies: string[],
  newDependentsBy: string[],
  newPredictions: string[],
  newRules: string[],
}

class Service extends BaseComponent<Props, State> {

  state: State = {
    newDependencies: [],
    newApps: [],
    newDependentsBy: [],
    newPredictions: [],
    newRules: [],
  };

  componentDidMount(): void {
    const serviceName = this.props.match.params.name;
    if (serviceName && !isNewService(serviceName)) {
      this.props.loadServices(serviceName);
    }
  };

  private onAddServiceDependency = (dependency: string): void => {
    this.setState({
      newDependencies: this.state.newDependencies.concat(dependency)
    });
  };

  private onRemoveServiceDependencies = (dependencies: string[]): void => {
    this.setState({
      newDependencies: this.state.newDependencies.filter(dependency => !dependencies.includes(dependency))
    });
  };

  private saveServiceDependencies = (serviceName: string, successCallback: () => void): void => {
    const {newDependencies} = this.state;
    if (newDependencies.length) {
      patchData(`services/${serviceName}/dependencies`, newDependencies,
        () => this.onSaveDependenciesSuccess(serviceName, successCallback),
        (reason) => this.onSaveDependenciesFailure(serviceName, reason), 'post');
    }
    else {
      successCallback();
    }
  };

  private onSaveDependenciesSuccess = (serviceName: string, successCallback: () => void): void => {
    successCallback();
    if (!isNewService(this.props.match.params.name)) {
      this.state.newDependencies.forEach(dependencyName =>
        this.props.addServiceDependency(serviceName, dependencyName)
      );
    }
    this.setState({ newDependencies: [] });
  };

  private onSaveDependenciesFailure = (serviceName: string, reason: string): void =>
    super.toast(`Service <b>${serviceName}</b> saved, but unable to save dependencies`, 10000, reason, true);


  private onAddServiceApp = (app: string): void => {
    this.setState({
      newApps: this.state.newApps.concat(app)
    });
  };

  private onRemoveServiceApps = (apps: string[]): void => {
    this.setState({
      newDependencies: this.state.newApps.filter(app => !apps.includes(app))
    });
  };

  private onAddServiceDependentBy = (dependentBy: string): void => {
    this.setState({
      newDependentsBy: this.state.newDependentsBy.concat(dependentBy)
    });
  };

  private onRemoveServiceDependentsBy = (dependentsBy: string[]): void => {
    this.setState({
      newDependentsBy: this.state.newDependentsBy.filter(dependentBy => !dependentsBy.includes(dependentBy))
    });
  };

  private onAddServicePrediction = (prediction: string): void => {
    this.setState({
      newPredictions: this.state.newPredictions.concat(prediction)
    });
  };

  private onRemoveServicePredictions = (predictions: string[]): void => {
    this.setState({
      newPredictions: this.state.newPredictions.filter(prediction => !predictions.includes(prediction))
    });
  };

  private onAddServiceRule = (rule: string): void => {
    this.setState({
      newRules: this.state.newRules.concat(rule)
    });
  };

  private onRemoveServiceRules = (rules: string[]): void => {
    this.setState({
      newRules: this.state.newRules.filter(rule => !rules.includes(rule))
    });
  };

  //TODO save other entities too
  private saveEntities = (serviceName: string, successCallback: () => void) =>
    this.saveServiceDependencies(serviceName, successCallback);

  private onPostSuccess = (serviceName: string): void => {
    this.saveEntities(serviceName, () => super.toast(`Service <b>${serviceName}</b> is now created`));
  };

  private onPostFailure = (reason: string, serviceName: string): void =>
    super.toast(`Unable to save ${serviceName}`, 10000, reason, true);

  private onPutSuccess = (serviceName: string): void => {
    this.saveEntities(serviceName, () => super.toast(`Changes to service <b>${serviceName}</b> are now saved`));
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
            : key === 'serviceName' ? { rule: requiredAndNotAllowed, args: ['new_service'] } : { rule: required }
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
                isNew={isNewService(this.props.match.params.name)}
                showSaveButton={!!this.state['newDependencies'].length}
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
    const {newApps} = this.state;
    const {isLoadingApps, loadAppsError, service} = this.props;
    return (
      <>
        {isLoadingApps &&
        <LoadingSpinner/>}
        {loadAppsError &&
        <Error message={loadAppsError}/>}
        {!loadAppsError && service &&
        <ServiceAppList service={service}
                        newApps={newApps}
                        onAddServiceApp={this.onAddServiceApp}
                        onRemoveServiceApps={this.onRemoveServiceApps}/>}
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
    const {newDependentsBy} = this.state;
    const {isLoadingDependentsBy, loadDependentsByError, service} = this.props;
    return (
      <>
        {isLoadingDependentsBy &&
        <LoadingSpinner/>}
        {loadDependentsByError &&
        <Error message={loadDependentsByError}/>}
        {!loadDependentsByError && service &&
        <ServiceDependentList service={service}
                              newDependentsBy={newDependentsBy}
                              onAddServiceDependentBy={this.onAddServiceDependentBy}
                              onRemoveServiceDependentsBy={this.onRemoveServiceDependentsBy}/>}
      </>
    )
  };

  private predictions = () => {
    const {newPredictions} = this.state;
    const {isLoadingPredictions, loadPredictionsError, service} = this.props;
    return (
      <>
        {isLoadingPredictions &&
        <LoadingSpinner/>}
        {loadPredictionsError &&
        <Error message={loadPredictionsError}/>}
        {!loadPredictionsError && service &&
        <ServicePredictionList service={service}
                               newPredictions={newPredictions}
                               onAddServicePrediction={this.onAddServicePrediction}
                               onRemoveServicePredictions={this.onRemoveServicePredictions}/>}
      </>
    )
  };

  private rules = () => {
    const {newRules} = this.state;
    const {isLoadingRules, loadRulesError, service} = this.props;
    return (
      <>
        {isLoadingRules &&
        <LoadingSpinner/>}
        {loadRulesError &&
        <Error message={loadRulesError}/>}
        {!loadRulesError && service &&
        <ServiceRuleList service={service}
                         newRules={newRules}
                         onAddServiceRule={this.onAddServiceRule}
                         onRemoveServiceRules={this.onRemoveServiceRules}/>}
      </>
    )
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
  const name = props.match.params.name;
  const service = isNewService(name) ? emptyService() : state.entities.services.data[name];
  let formService;
  if (service) {
    formService = { ...service };
    delete formService["id"];
    delete formService["apps"];
    delete formService["dependencies"];
    delete formService["dependents"];
    delete formService["predictions"];
    delete formService["rules"];
  }
  const isLoadingServices = state.entities.services?.isLoadingServices;
  const isLoadingApps = state.entities.services?.isLoadingApps;
  const isLoadingDependencies = state.entities.services?.isLoadingDependencies;
  const isLoadingDependentsBy = state.entities.services?.isLoadingDependentsBy;
  const isLoadingPredictions = state.entities.services?.isLoadingPredictions;
  const isLoadingRules = state.entities.services?.isLoadingRules;
  const loadServicesError = state.entities.services?.loadServicesError;
  const loadAppsError = state.entities.services?.loadAppsError;
  const loadDependenciesError = state.entities.services?.loadDependenciesError;
  const loadDependentsByError = state.entities.services?.loadDependentsByError;
  const loadPredictionsError = state.entities.services?.loadPredictionsError;
  const loadRulesError = state.entities.services?.loadRulesError;
  return  {
    isLoadingServices,
    isLoadingApps,
    isLoadingDependencies,
    isLoadingDependentsBy,
    isLoadingPredictions,
    isLoadingRules,
    loadServicesError,
    loadAppsError,
    loadDependenciesError,
    loadDependentsByError,
    loadPredictionsError,
    loadRulesError,
    service,
    formService,
  }
}

const mapDispatchToProps: DispatchToProps = {
  loadServices,
  addServiceDependency
};

export default connect(mapStateToProps, mapDispatchToProps)(Service);
