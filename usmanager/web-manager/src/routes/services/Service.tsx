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

const isServiceNew = (search: string): boolean =>
  !!queryString.parse(search)['?new'];

interface StateToProps {
  isLoading: boolean;
  error?: string | null;
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
}


class Service extends BaseComponent<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = { newDependencies: [] };
  }

  componentDidMount(): void {
    const serviceName = getServiceNameFromPathname(this.props);
    if (serviceName && !isServiceNew(this.props.location.search)) {
      this.props.loadServices(serviceName);
    }
  };

  private addServiceDependency = (dependencyName: string): void => {
    this.setState({ newDependencies: this.state.newDependencies.concat(dependencyName) });
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
    if (!isServiceNew(this.props.location.search)) {
      this.state.newDependencies.forEach(dependencyName =>
        this.props.addServiceDependency(serviceName, dependencyName)
      );
    }
    this.setState({ newDependencies: [] });
  };

  private onSaveDependenciesFailure = (serviceName: string, reason: string): void =>
    super.toast(`Service <b>${serviceName}</b> saved, but unable to save dependencies`, 10000, reason, true);

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
    const {isLoading, error, formService, service} = this.props;
    // @ts-ignore
    const serviceKey: (keyof IService) = this.props.formService && Object.keys(this.props.formService)[0];
    return (
      <>
        {isLoading && <LoadingSpinner/>}
        {error && <Error message={error}/>}
        {!error && formService && (
          <Form id={serviceKey}
                fields={this.getFields(formService)}
                values={service}
                isNew={isServiceNew(this.props.location.search)}
                showSaveButton={!!this.state.newDependencies.length}
                post={{url: 'services', successCallback: this.onPostSuccess, failureCallback: this.onPostFailure}}
                put={{url: `services/${service[serviceKey]}`, successCallback: this.onPutSuccess, failureCallback: this.onPutFailure}}
                delete={{url: `services/${service[serviceKey]}`, successCallback: this.onDeleteSuccess, failureCallback: this.onDeleteFailure}}
          >
            {Object.keys(formService).map((key, index) =>
              key === 'serviceType'
                ? <Field key={index}
                         id={key}
                         type="dropdown"
                         label={key}
                         options={{defaultValue: "Choose service type", values: ["Frontend", "Backend", "Database", "System"]}}
                />
                : <Field key={index}
                         id={key}
                         label={key}
                />
            )}
          </Form>
        )}
      </>
    )
  };

  private dependencies = () => {
    const {isLoading, error, service} = this.props;
    return (
      <>
        {isLoading && <LoadingSpinner/>}
        {error && <Error message={error}/>}
        {!error && service && <ServiceDependencyList service={service} addServiceDependencyCallback={this.addServiceDependency}/>}
      </>
    )
  };

  private tabs: Tab[] = [
    {
      title: 'Details',
      id: 'details',
      content: () => this.details()
    },
    {
      title: 'Dependencies',
      id: 'dependencies',
      content: () => this.dependencies()
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
  const service = isServiceNew(props.location.search) ? emptyService() : state.entities.services.data[name];
  let formService;
  if (service) {
    formService = { ...service };
    delete formService["id"];
    delete formService["dependencies"];
  }
  const isLoading = state.entities.services.isLoadingServices;
  const error = state.entities.services.loadServicesError;
  return  {
    isLoading,
    error,
    service,
    formService,
  }
}

const mapDispatchToProps: DispatchToProps = {
  loadServices,
  addServiceDependency
};

export default connect(mapStateToProps, mapDispatchToProps)(Service);
