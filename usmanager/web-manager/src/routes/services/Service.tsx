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
import Form, {
  IFields,
  required,
  requiredAndNotAllowed,
  requiredAndNumberAndMin
} from "../../components/form/Form"
import IData from "../../components/IData";
import {addServiceApps, addServiceDependencies, addServicePredictions, addServiceRules, loadServices} from "../../actions";
import {connect} from "react-redux";
import MainLayout from "../../views/mainLayout/MainLayout";
import ListLoadingSpinner from "../../components/list/ListLoadingSpinner";
import {ReduxState} from "../../reducers";
import Field, {getTypeFromValue} from "../../components/form/Field";
import BaseComponent from "../../components/BaseComponent";
import Error from "../../components/errors/Error";
import Tabs, {Tab} from "../../components/tabs/Tabs";
import {postData} from "../../utils/api";
import ServiceAppList, {IAddServiceApp} from "./apps/ServiceAppList";
import ServiceDependencyList from "./dependencies/ServiceDependencyList";
import ServiceDependeeList from "./dependees/ServiceDependeeList";
import ServicePredictionList, {IPrediction} from "./predictions/ServicePredictionList";
import ServiceRuleList from "./rules/ServiceRuleList";
import UnsavedChanged from "../../components/form/UnsavedChanges";
import GenericServiceRuleList from "./rules/GenericServiceRuleList";

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
  apps: string[];
  dependencies: string[];
  dependees: string[];
  predictions: { [key: string]: IPrediction };
  rules: string[];
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
  loadServicesError?: string | null;
  service: Partial<IService>;
  formService?: Partial<IService>,
}

interface DispatchToProps {
  loadServices: (name: string) => any;
  addServiceApps: (serviceName: string, apps: string[]) => void;
  addServiceDependencies: (serviceName: string, dependencies: string[]) => void;
  addServicePredictions: (serviceName: string, predictions: IPrediction[]) => void;
  addServiceRules: (serviceName: string, rules: string[]) => void;
}

interface MatchParams {
  name: string;
}

type Props = StateToProps & DispatchToProps & RouteComponentProps<MatchParams>;

type State = {
  newApps: IAddServiceApp[],
  newDependencies: string[],
  newDependees: string[],
  newPredictions: IPrediction[],
  newRules: string[],
  serviceName?: string,
}

class Service extends BaseComponent<Props, State> {

  state: State = {
    newApps: [],
    newDependencies: [],
    newDependees: [],
    newPredictions: [],
    newRules: [],
  };

  componentDidMount(): void {
    const serviceName = this.props.match.params.name;
    if (serviceName && !isNewService(serviceName)) {
      this.props.loadServices(serviceName);
    }
  };

  private onAddServiceApp = (app: IAddServiceApp): void => {
    this.setState({
      newApps: this.state.newApps.concat(app)
    });
  };

  private onRemoveServiceApps = (apps: string[]): void => {
    this.setState({
      newApps: this.state.newApps.filter(app => !apps.includes(app.name))
    });
  };

  private saveServiceApps = (serviceName: string): void => {
    const {newApps} = this.state;
    if (newApps.length) {
      postData(`services/${serviceName}/apps`, newApps,
        () => this.onSaveAppsSuccess(serviceName),
        (reason) => this.onSaveAppsFailure(serviceName, reason));
    }
  };

  private onSaveAppsSuccess = (serviceName: string): void => {
    if (!isNewService(this.props.match.params.name)) {
      this.props.addServiceApps(serviceName, this.state.newApps.map(app => app.name));
    }
    this.setState({ newApps: [] });
  };

  private onSaveAppsFailure = (serviceName: string, reason: string): void =>
    super.toast(`Unable to save apps of service ${serviceName}`, 10000, reason, true);

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

  private saveServiceDependencies = (serviceName: string): void => {
    const {newDependencies} = this.state;
    if (newDependencies.length) {
      postData(`services/${serviceName}/dependencies`, newDependencies,
        () => this.onSaveDependenciesSuccess(serviceName),
        (reason) => this.onSaveDependenciesFailure(serviceName, reason));
    }
  };

  private onSaveDependenciesSuccess = (serviceName: string): void => {
    if (!isNewService(this.props.match.params.name)) {
      this.props.addServiceDependencies(serviceName, this.state.newDependencies)
    }
    this.setState({ newDependencies: [] });
  };

  private onSaveDependenciesFailure = (serviceName: string, reason: string): void =>
    super.toast(`Unable to save dependencies of service ${serviceName}`, 10000, reason, true);

  private onAddServicePrediction = (prediction: IPrediction): void => {
    this.setState({
      newPredictions: this.state.newPredictions.concat(prediction)
    });
  };

  private onRemoveServicePredictions = (predictions: string[]): void => {
    this.setState({
      newPredictions: this.state.newPredictions.filter(prediction => !predictions.includes(prediction.name))
    });
  };

  private saveServicePredictions = (serviceName: string): void => {
    const {newPredictions} = this.state;
    if (newPredictions.length) {
      postData(`services/${serviceName}/predictions`, newPredictions,
        () => this.onSavePredictionsSuccess(serviceName),
        (reason) => this.onSavePredictionsFailure(serviceName, reason));
    }
  };

  private onSavePredictionsSuccess = (serviceName: string): void => {
    if (!isNewService(this.props.match.params.name)) {
      this.props.addServicePredictions(serviceName, this.state.newPredictions);
    }
    this.setState({ newPredictions: [] });
  };

  private onSavePredictionsFailure = (serviceName: string, reason: string): void =>
    super.toast(`Unable to save predictions of service ${serviceName}`, 10000, reason, true);

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

  private saveServiceRules = (serviceName: string): void => {
    const {newRules} = this.state;
    if (newRules.length) {
      postData(`services/${serviceName}/rules`, newRules,
        () => this.onSaveRulesSuccess(serviceName),
        (reason) => this.onSaveRulesFailure(serviceName, reason));
    }
  };

  private onSaveRulesSuccess = (serviceName: string): void => {
    if (!isNewService(this.props.match.params.name)) {
      this.props.addServiceRules(serviceName, this.state.newRules)
    }
    this.setState({ newRules: [] });
  };

  private onSaveRulesFailure = (serviceName: string, reason: string): void =>
    super.toast(`Unable to save rules of service ${serviceName}`, 10000, reason, true);

  private saveEntities = (serviceName: string) => {
    this.saveServiceApps(serviceName);
    this.saveServiceDependencies(serviceName);
    this.saveServicePredictions(serviceName);
    this.saveServiceRules(serviceName);
  };

  private onPostSuccess = (reply: any, serviceName: string): void => {
    super.toast(`Service <b>${serviceName}</b> saved`);
    this.saveEntities(serviceName);
  };

  private onPostFailure = (reason: string, serviceName: string): void =>
    super.toast(`Unable to save ${serviceName}`, 10000, reason, true);

  private onPutSuccess = (serviceName: string): void => {
    super.toast(`Changes to service <b>${serviceName}</b> are now saved`);
    this.setState({serviceName: serviceName});
    this.saveEntities(serviceName);
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

  private shouldShowSaveButton = () =>
    !!this.state.newApps.length
    || !!this.state.newDependencies.length
    || !!this.state.newDependees.length
    || !!this.state.newPredictions.length
    || !!this.state.newRules.length;

  private serviceTypeOption = (serviceType: string): string =>
    serviceType;

  private details = () => {
    const {isLoadingServices, loadServicesError, formService, service} = this.props;
    // @ts-ignore
    const serviceKey: (keyof IService) = formService && Object.keys(formService)[0];
    return (
      <>
        {isLoadingServices && <ListLoadingSpinner/>}
        {!isLoadingServices && loadServicesError && <Error message={loadServicesError}/>}
        {!isLoadingServices && !loadServicesError && formService && (
          <Form id={serviceKey}
                fields={this.getFields(formService)}
                values={service}
                isNew={isNewService(this.props.match.params.name)}
                showSaveButton={this.shouldShowSaveButton()}
                post={{url: 'services', successCallback: this.onPostSuccess, failureCallback: this.onPostFailure}}
                put={{url: `services/${this.state.serviceName || service[serviceKey]}`, successCallback: this.onPutSuccess, failureCallback: this.onPutFailure}}
                delete={{url: `services/${this.state.serviceName || service[serviceKey]}`, successCallback: this.onDeleteSuccess, failureCallback: this.onDeleteFailure}}
                saveEntities={this.saveEntities}>
            {Object.keys(formService).map((key, index) =>
              key === 'serviceType'
                ? <Field key={index}
                         id={key}
                         type="dropdown"
                         label={key}
                         dropdown={{
                           defaultValue: "Choose service type",
                           values: ["Frontend", "Backend", "Database", "System"],
                           optionToString: this.serviceTypeOption}}/>
                : <Field key={index}
                         id={key}
                         label={key}/>
            )}
          </Form>
        )}
      </>
    )
  };

  private apps = (): JSX.Element =>
    <ServiceAppList service={this.props.service}
                    newApps={this.state.newApps}
                    onAddServiceApp={this.onAddServiceApp}
                    onRemoveServiceApps={this.onRemoveServiceApps}/>;

  private dependencies = (): JSX.Element =>
    <ServiceDependencyList service={this.props.service}
                           newDependencies={this.state.newDependencies}
                           onAddServiceDependency={this.onAddServiceDependency}
                           onRemoveServiceDependencies={this.onRemoveServiceDependencies}/>;

  private dependees = (): JSX.Element =>
    <ServiceDependeeList service={this.props.service}
                         newDependees={this.state.newDependees}/>;

  private predictions = (): JSX.Element =>
    <ServicePredictionList service={this.props.service}
                           newPredictions={this.state.newPredictions}
                           onAddServicePrediction={this.onAddServicePrediction}
                           onRemoveServicePredictions={this.onRemoveServicePredictions}/>;

  private rules = (): JSX.Element =>
    <ServiceRuleList service={this.props.service}
                     newRules={this.state.newRules}
                     onAddServiceRule={this.onAddServiceRule}
                     onRemoveServiceRules={this.onRemoveServiceRules}/>;

  private genericRules = (): JSX.Element =>
    <GenericServiceRuleList/>;

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
      title: 'Dependees',
      id: 'dependees',
      content: () => this.dependees()
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
    },
    {
      title: 'Generic rules',
      id: 'genericServiceRules',
      content: () => this.genericRules()
    }
  ];

  render() {
    return (
      <MainLayout>
        {this.shouldShowSaveButton() && !isNewService(this.props.match.params.name) && <UnsavedChanged/>}
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
    delete formService["dependees"];
    delete formService["predictions"];
    delete formService["rules"];
  }
  const isLoadingServices = state.entities.services?.isLoadingServices;
  const loadServicesError = state.entities.services?.loadServicesError;
  return  {
    isLoadingServices,
    loadServicesError,
    service,
    formService,
  }
}

const mapDispatchToProps: DispatchToProps = {
  loadServices,
  addServiceApps,
  addServiceDependencies,
  addServicePredictions,
  addServiceRules,
};

export default connect(mapStateToProps, mapDispatchToProps)(Service);
