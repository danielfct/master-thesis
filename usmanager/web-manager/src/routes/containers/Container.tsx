import {RouteComponentProps} from "react-router";
import BaseComponent from "../../components/BaseComponent";
import Form, {IFields, required, requiredAndNumberAndMin} from "../../components/form/Form";
import Field, {getTypeFromValue} from "../../components/form/Field";
import LoadingSpinner from "../../components/list/LoadingSpinner";
import Error from "../../components/errors/Error";
import Tabs, {Tab} from "../../components/tabs/Tabs";
import MainLayout from "../../views/mainLayout/MainLayout";
import {ReduxState} from "../../reducers";
import {loadCloudHosts, loadContainers, loadEdgeHosts, loadServices} from "../../actions";
import {connect} from "react-redux";
import React from "react";
import IData from "../../components/IData";
import {ICloudHost} from "../hosts/CloudHost";
import {IEdgeHost} from "../hosts/EdgeHost";
import {IService} from "../services/Service";
import ServiceAppList from "../services/apps/ServiceAppList";
import PortsList from "./PortsList";
import LabelsList from "./LabelsList";
import LogsList from "./LogsList";
import ListItem from "../../components/list/ListItem";
import styles from "../../components/list/ListItem.module.css";

export interface IContainer extends IData {
  created: number;
  names: string[];
  image: string;
  command: string;
  state: string;
  status: string;
  hostname: string;
  ports: IContainerPort[];
  labels: IContainerLabel;
  logs: string;
}

export interface IContainerPort {
  privatePort: number;
  publicPort: number;
  type: string;
  ip: string;
}

export interface IContainerLabel {
  [key: string]: string
}

interface INewContainer {
  hostname: string,
  service: string,
  internalPort: number,
  externalPort: number,
}

const emptyContainer = (): INewContainer => ({
  hostname: '',
  service: '',
  internalPort: 0,
  externalPort: 0,
});

const isNewContainer = (name: string) =>
  name === 'new_container';

interface StateToProps {
  isLoading: boolean;
  error?: string | null;
  container: IContainer;
  formContainer: Partial<IContainer> | INewContainer;
  cloudHosts: { [key: string]: ICloudHost }
  edgeHosts: { [key: string]: IEdgeHost }
  services: { [key: string]: IService }
}

interface DispatchToProps {
  loadContainers: (id: string) => void;
  loadCloudHosts: () => void;
  loadEdgeHosts: () => void;
  loadServices: () => void;
}

interface MatchParams {
  id: string;
}

type Props = StateToProps & DispatchToProps & RouteComponentProps<MatchParams>;

interface State {
  defaultInternalPort: number,
  defaultExternalPort: number,
}

class Container extends BaseComponent<Props, State> {

  state: State = {
    defaultInternalPort: 0,
    defaultExternalPort: 0,
  };

  componentDidMount(): void {
    const containerId = this.props.match.params.id;
    if (!isNewContainer(containerId)) {
      this.props.loadContainers(containerId);
    }
    this.props.loadCloudHosts();
    this.props.loadEdgeHosts();
    this.props.loadServices();
  };

  private onPostSuccess = (reply: any, containerHostname: string): void => {
    console.log(reply); //TODO show which id it started at
    super.toast(`Container at <b>${containerHostname}</b> has now started on id ...`);
  };

  private onPostFailure = (reason: string, containerHostname: string): void =>
    super.toast(`Unable to start container at ${containerHostname}`, 10000, reason, true);

  private onPutSuccess = (nodeId: string): void => {
    super.toast(`Changes to node <b>${nodeId}</b> are now saved`);
  };
//TODO fix messages

  private onPutFailure = (reason: string, nodeId: string): void =>
    super.toast(`Unable to update ${nodeId}`, 10000, reason, true);

  private onDeleteSuccess = (nodeId: string): void => {
    super.toast(`Node <b>${nodeId}</b> successfully stopped`);
    this.props.history.push(`/nodes`)
  };

  private onDeleteFailure = (reason: string, nodeId: string): void =>
    super.toast(`Unable to stop ${nodeId}`, 10000, reason, true);

  private getFields = (): IFields =>
    Object.entries(emptyContainer()).map(([key, value]) => {
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

  private getSelectableHostnames = () => {
    const cloudHosts = this.props.cloudHosts && Object.keys(this.props.cloudHosts);
    const edgeHosts = this.props.edgeHosts && Object.keys(this.props.edgeHosts);
    return cloudHosts.concat(edgeHosts);
  };

  //TODO get apps' services instead (in case a service is associated to more than 1 app)
  private getSelectableServices = () =>
    this.props.services && Object.keys(this.props.services);

  private setDefaultPorts = (serviceName: string) => {
    const service = this.props.services[serviceName];
    this.setState({
      defaultExternalPort: service.defaultExternalPort,
      defaultInternalPort: service.defaultInternalPort});
  };

  private hostnameOption = (hostname: string) =>
    hostname;

  private serviceOption = (service: string) =>
    service;

  private formFields = (formContainer: Partial<IContainer>, isNew: boolean): JSX.Element => {
    return (
      isNew ?
        <>
          <Field key={'hostname'}
                 id={'hostname'}
                 label={'hostname'}
                 type={'dropdown'}
                 dropdown={{
                   defaultValue: "Select hostname",
                   values: this.getSelectableHostnames(),
                   optionToString: this.hostnameOption}}/>
          <Field key={'service'}
                 id={'service'}
                 label={'service'}
                 type={'dropdown'}
                 dropdown={{
                   defaultValue: "Select service",
                   values: this.getSelectableServices(),
                   selectCallback: this.setDefaultPorts,
                   optionToString: this.serviceOption}}/>
          <Field key={'internalPort'}
                 id={'internalPort'}
                 label={'internalPort'}
                 type={'numberbox'}/>
          <Field key={'externalPort'}
                 id={'externalPort'}
                 label={'externalPort'}
                 type={'numberbox'}/>
        </>
        :
        <>
          {Object.entries(formContainer).map(([key, value], index) => {
            return key == 'created'
              ? <Field key={index}
                       id={key}
                       label={key}
                       type={"datebox"}/>
              : <Field key={index}
                       id={key}
                       label={key}/>
          })}
        </>
    )
  };

  private details = () => {
    const {isLoading, error, container, formContainer} = this.props;
    // @ts-ignore
    const containerKey: (keyof IContainer) = container && Object.keys(container)[0];
    const isNew = isNewContainer(this.props.match.params.id);
    const values = isNew
      ? {
        ...formContainer,
        internalPort: this.state.defaultInternalPort,
        externalPort: this.state.defaultExternalPort
      }
      : formContainer;
    return (
      <>
        {isLoading && <LoadingSpinner/>}
        {!isLoading && error && <Error message={error}/>}
        {!isLoading && !error && formContainer && (
          <Form id={containerKey}
                fields={this.getFields()}
                values={values}
                isNew={isNew}
                post={{url: 'containers', successCallback: this.onPostSuccess, failureCallback: this.onPostFailure}}
                put={container && {url: `containers/${container[containerKey]}`, successCallback: this.onPutSuccess, failureCallback: this.onPutFailure}}
                delete={container && {url: `containers/${container[containerKey]}`, successCallback: this.onDeleteSuccess, failureCallback: this.onDeleteFailure}}
                editable={false}>
            {this.formFields(formContainer, isNew)}
          </Form>
        )}
      </>
    )
  };

  private ports = (): JSX.Element =>
    <PortsList ports={this.props.container.ports}/>;

  private labels = (): JSX.Element =>
    <LabelsList labels={Object.entries(this.props.container.labels).map(([key, value]) => `${key} = ${value}`)}/>;

  private logs = (): JSX.Element => {
    const logs = this.props.container.logs.split("\n");
    logs.pop();
    return <LogsList logs={logs}/>;
  };

  private tabs: Tab[] =
    isNewContainer(this.props.match.params.id)
      ? [
        {
          title: 'Container',
          id: 'container',
          content: () => this.details()
        },
      ]
      : [
        {
          title: 'Container',
          id: 'container',
          content: () => this.details()
        },
        {
          title: 'Ports',
          id: 'ports',
          content: () => this.ports()
        },
        {
          title: 'Labels',
          id: 'labels',
          content: () => this.labels()
        },
        {
          title: 'Logs',
          id: 'logs',
          content: () => this.logs()
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
  const isLoading = state.entities.containers.isLoading;
  const error = state.entities.containers.error;
  const id = props.match.params.id;
  const container = state.entities.containers.data[id];
  let formContainer;
  if (isNewContainer(id)) {
    formContainer = emptyContainer();
  }
  else {
    formContainer = { ...container };
    delete formContainer["ports"];
    delete formContainer["labels"];
    delete formContainer["logs"];
  }
  const cloudHosts = state.entities.hosts.cloud.data;
  const edgeHosts = state.entities.hosts.edge.data;
  const services = state.entities.services.data;
  return  {
    isLoading,
    error,
    container,
    formContainer,
    cloudHosts,
    edgeHosts,
    services
  }
}

const mapDispatchToProps: DispatchToProps = {
  loadContainers,
  loadCloudHosts,
  loadEdgeHosts,
  loadServices
};

export default connect(mapStateToProps, mapDispatchToProps)(Container);