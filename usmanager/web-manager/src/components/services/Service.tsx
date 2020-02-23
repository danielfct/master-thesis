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

import React, {createRef} from 'react';
import M from 'materialize-css';
import {Redirect, RouteComponentProps} from 'react-router';
import {camelCaseToSentenceCase} from "../../utils/text";
import Form, {IFields, IValues, min, required, requiredAndNumberAndMin} from "../shared/form/Form";
import {mapLabelToIcon} from "../../utils/image";
import IData from "../shared/IData";
import ServiceDependencyList from "./ServiceDependencyList";
import {loadServices} from "../../actions";
import {connect, MapStateToProps} from "react-redux";
import MainLayout from "../shared/MainLayout";
import LoadingSpinner from "../shared/LoadingSpinner";
import * as queryString from "querystring";
import {ReduxState} from "../../reducers";
import Field, {getTypeFromValue} from "../shared/form/Field";
import BaseComponent from "../shared/BaseComponent";
import entities from "../../reducers/entities";
import Error from "../shared/Error";

export interface IService extends IData {
  serviceName: string;
  dockerRepository: string;
  defaultExternalPort: number;
  defaultInternalPort: number;
  defaultDb: string;
  launchCommand: string;
  minReplics: number;
  maxReplics: number;
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
  minReplics: 0,
  maxReplics: 0,
  outputLabel: '',
  serviceType: '',
  expectedMemoryConsumption: 0,
});

interface StateToProps {
  isLoading: boolean;
  error?: string | null;
  service: Partial<IService>;
  formService?: Partial<IService>,
}

interface DispatchToProps {
  loadServices: (name: string) => any;
}

interface MatchParams {
  name: string;
}

type Props = StateToProps & DispatchToProps & RouteComponentProps<MatchParams>;

const getServiceNameFromPathname = (props: Props) =>
  props.match.params.name.split('#')[0];

class Service extends BaseComponent<Props, {}> {

  private tabs = createRef<HTMLUListElement>();

  componentDidMount(): void {
    const serviceName = getServiceNameFromPathname(this.props);
    if (serviceName && serviceName !== 'service') {
      this.props.loadServices(serviceName);
    }
    M.Tabs.init(this.tabs.current as Element);
  };

  componentWillUnmount(): void {
    super.componentWillUnmount();
    //TODO cancel axios loadServices
  }

  private isServiceNew = (): boolean =>
    !!queryString.parse(this.props.location.search)['?new'];

  private onPostSuccess = () => {
    super.toast(`Service ${getServiceNameFromPathname(this.props)} successfully created`);
    //TODO save dependencies
  };

  private onPostFailure = (reason: string) =>
    super.toast(`Unable to save ${getServiceNameFromPathname(this.props)}`, 10000, reason, true);

  private onPutSuccess = () => {
    super.toast(`Changes to ${getServiceNameFromPathname(this.props)} successfully saved`);
    //TODO save dependencies
  };

  private onPutFailure = (reason: string) =>
    super.toast(`Unable to update ${getServiceNameFromPathname(this.props)}`, 10000, reason, true);

  private onDeleteSuccess = () => {
    super.toast(`Service <b>${getServiceNameFromPathname(this.props)}</b> successfully removed`);
    this.props.history.push(`/services`)
  };

  private onDeleteFailure = (reason: string) =>
    super.toast(`Unable to delete ${getServiceNameFromPathname(this.props)}`, 10000, reason, true);

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

  render() {
    const {isLoading, error, formService, service} = this.props;
    // @ts-ignore
    const serviceKey: (keyof IService) = this.props.formService && Object.keys(this.props.formService)[0];
    return (
      <MainLayout>
        <div className="container">
          <ul className="tabs" ref={this.tabs}>
            <li className="tab col s6"><a href="#details">Details</a></li>
            <li className="tab col s6"><a href="#dependencies">Dependencies</a></li>
          </ul>
          <div className="tab-content col s12" id="details">
            {isLoading && <LoadingSpinner/>}
            {error && <Error message={error}/>}
            {formService && (
              <Form fields={this.getFields(formService)}
                    values={service}
                    new={this.isServiceNew()}
                    post={{url: 'services', successCallback: this.onPostSuccess, failureCallback: this.onPostFailure}}
                    put={{url: `services/${service[serviceKey]}`, successCallback: this.onPutSuccess, failureCallback: this.onPutFailure}}
                    delete={{url: `services/${service[serviceKey]}`, successCallback: this.onDeleteSuccess, failureCallback: this.onDeleteFailure}}
                    id={serviceKey}>
                {Object.keys(formService).map(key =>
                  key === 'serviceType'
                    ? <Field id={key}
                             type="dropdown"
                             label={key}
                             options={{defaultValue: "Choose service type", values: ["Frontend", "Backend", "Database", "System"]}}
                    />
                    : <Field id={key}
                             label={key}
                    />
                )}
              </Form>
            )}
          </div>
          <div className="tab-content" id="dependencies">
            {isLoading && <LoadingSpinner/>}
            {error && <Error message={error}/>}
            {service && <ServiceDependencyList service={service}/>}
          </div>
        </div>
      </MainLayout>)
  }
}

function mapStateToProps(state: ReduxState, props: Props): StateToProps {
  const name = getServiceNameFromPathname(props);
  const service = name === 'service' ? emptyService() : state.entities.services.data[name];
  let formService;
  if (service) {
    formService = { ...service };
    delete formService["id"];
    delete formService["dependencies"];
  }
  const isLoading = state.entities.services.isLoading;
  const error = state.entities.services.error;
  return  {
    isLoading,
    error,
    service,
    formService,

  }
}

const mapDispatchToProps: DispatchToProps = {
  loadServices,
};

export default connect(mapStateToProps, mapDispatchToProps)(Service);
