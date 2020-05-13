import {RouteComponentProps} from "react-router";
import BaseComponent from "../../components/BaseComponent";
import Form, {IFields, required, requiredAndNumberAndMin} from "../../components/form/Form";
import Field, {getTypeFromValue} from "../../components/form/Field";
import ListLoadingSpinner from "../../components/list/ListLoadingSpinner";
import Error from "../../components/errors/Error";
import Tabs, {Tab} from "../../components/tabs/Tabs";
import MainLayout from "../../views/mainLayout/MainLayout";
import {ReduxState} from "../../reducers";
import {loadCloudHosts, loadContainers, loadEdgeHosts, loadServices} from "../../actions";
import {connect} from "react-redux";
import React, {createRef} from "react";
import IData from "../../components/IData";
import {ICloudHost} from "../hosts/cloud/CloudHost";
import {IEdgeHost} from "../hosts/edge/EdgeHost";
import {IService} from "../services/Service";
import ContainerPortsList from "./ContainerPortsList";
import ContainerLabelsList from "./ContainerLabelsList";
import ContainerLogsList from "./ContainerLogsList";
import PerfectScrollbar from "react-perfect-scrollbar";
import ScrollBar from "react-perfect-scrollbar";
import M from "materialize-css";
import styles from "../../components/list/ControlledList.module.css";
import {decodeHTML} from "../../utils/text";
import {postData} from "../../utils/api";

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
  isLoading: boolean,
}

class Container extends BaseComponent<Props, State> {

  private replicateDropdown = createRef<HTMLButtonElement>();
  private migrateDropdown = createRef<HTMLButtonElement>();
  private scrollbar: (ScrollBar | null) = null;

  state: State = {
    defaultInternalPort: 0,
    defaultExternalPort: 0,
    isLoading: false,
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

  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any): void {
    this.init();
  }

  private init = () => {
    M.Dropdown.init(this.replicateDropdown.current as Element,
      {
        onOpenEnd: this.onOpenDropdown
      });
    M.Dropdown.init(this.migrateDropdown.current as Element,
      {
        onOpenEnd: this.onOpenDropdown
      });
  };

  private onOpenDropdown = () =>
    this.scrollbar?.updateScroll();

  private onPostSuccess = (reply: any, containerHostname: string): void => {
    console.log(reply); //TODO show which id it started at
    super.toast(`Container at <b>${containerHostname}</b> has now started on id ...`);
  };

  private onPostFailure = (reason: string, containerHostname: string): void =>
    super.toast(`Unable to start container at ${containerHostname}`, 10000, reason, true);

  private onDeleteSuccess = (containerId: string): void => {
    super.toast(`Container <b>${containerId}</b> successfully stopped`);
    this.props.history.push(`/containers`);
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

  private replicate = (event: any) => {
    const hostname = decodeHTML((event.target as HTMLLIElement).innerHTML);
    this.setState({isLoading: true});
    postData(`containers/${this.props.container.id}/replicate`, {hostname: hostname},
      (reply) => this.onReplicateSuccess(reply),
      (reply) => this.onReplicateFailure(reply));
  };

  private onReplicateSuccess = (reply: any) => {
    super.toast(`Replicated ${this.props.container.image.split('/').splice(1)} to container <a href=/containers/${reply.data.id}>${reply.data.id}</a>`, 15000);
    this.setState({isLoading: false});
  };

  private onReplicateFailure = (reply: any) => {
    super.toast(`Unable to replicate container`, 10000, reply, true);
    this.setState({isLoading: false});
  };

  private migrate = (event: any) => {
    const hostname = decodeHTML((event.target as HTMLLIElement).innerHTML);
    this.setState({isLoading: true});
    postData(`containers/${this.props.container.id}/migrate`, { hostname: hostname },
      (reply) => this.onMigrateSuccess(reply),
      (reply) => this.onMigrateFailure(reply));
  };

  private onMigrateSuccess = (reply: any) => {
    super.toast(`Migrated ${this.props.container.id} to container <a href=/containers/${reply.data.id}>${reply.data.id}</a>`, 15000);
    this.setState({isLoading: false});
  };

  private onMigrateFailure = (reply: any) => {
    super.toast(`Unable to migrate container`, 10000, reply, true);
    this.setState({isLoading: false});
  };

  private chooseHostnameDropdown = (id: string, onClick: (event: any) => void) =>
    <ul id={id}
        className={`dropdown-content ${styles.dropdown}`}>
      <li className={`${styles.disabled}`}>
        <a>
          Choose hostname
        </a>
      </li>
      <PerfectScrollbar ref={(ref) => { this.scrollbar = ref; }}>
        {Object.values(this.props.cloudHosts).map((data, index) =>
          <li key={index} onClick={onClick}>
            <a>
              {data.publicIpAddress}
            </a>
          </li>
        )}
        {Object.values(this.props.edgeHosts).map((data, index) =>
          <li key={index} onClick={onClick}>
            <a>
              {data.hostname}
            </a>
          </li>
        )}
      </PerfectScrollbar>
    </ul>;

  private replicateMigrateButtons = (): JSX.Element =>
    <>
      <button className={`btn-flat btn-small waves-effect waves-light blue-text dropdown-trigger`}
              data-target={`replicate-dropdown-hostname`}
              ref={this.replicateDropdown}>
        Replicate
      </button>
      {this.chooseHostnameDropdown('replicate-dropdown-hostname', this.replicate)}
      <button className={`btn-flat btn-small waves-effect waves-light blue-text dropdown-trigger`}
              data-target={`migrate-dropdown-hostname`}
              ref={this.migrateDropdown}>
        Migrate
      </button>
      {this.chooseHostnameDropdown('migrate-dropdown-hostname', this.migrate)}
    </>;

  private container = () => {
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
        {isLoading && <ListLoadingSpinner/>}
        {!isLoading && error && <Error message={error}/>}
        {!isLoading && !error && formContainer && (
          <Form id={containerKey}
                fields={this.getFields()}
                values={values}
                isNew={isNew}
                post={{
                  textButton: 'Launch',
                  url: 'containers',
                  successCallback: this.onPostSuccess,
                  failureCallback: this.onPostFailure}}
                delete={container && {
                  textButton: 'Stop',
                  url: `containers/${container[containerKey]}`,
                  successCallback: this.onDeleteSuccess,
                  failureCallback: this.onDeleteFailure}}
                editable={false}
                customButtons={container && (!container.labels['isReplicable'] || container.labels['isReplicable'] === 'true')
                  ? this.replicateMigrateButtons()
                  : undefined}
                loading={this.state.isLoading}
                deletable={container && (!container.labels['isStoppable'] || container.labels['isStoppable'] === 'true')}>
            {this.formFields(formContainer, isNew)}
          </Form>
        )}
      </>
    )
  };

  private ports = (): JSX.Element => {
    const {isLoading, error, container} = this.props;
    if (isLoading) {
      return <ListLoadingSpinner/>;
    }
    if (error) {
      return <Error message={error}/>;
    }
    if (container) {
      return <ContainerPortsList ports={container.ports}/>
    }
    return <></>;
  };

  private labels = (): JSX.Element => {
    const {isLoading, error, container} = this.props;
    if (isLoading) {
      return <ListLoadingSpinner/>;
    }
    if (error) {
      return <Error message={error}/>;
    }
    if (container) {
      return <ContainerLabelsList labels={Object.entries(container.labels).map(([key, value]) => `${key} = ${value}`)}/>;
    }
    return <></>;
  };


  private logs = (): JSX.Element => {
    const {isLoading, error, container} = this.props;
    if (isLoading) {
      return <ListLoadingSpinner/>;
    }
    if (error) {
      return <Error message={error}/>;
    }
    if (container) {
      const logs = container.logs.split("\n");
      logs.pop();
      return <ContainerLogsList logs={logs}/>;
    }
    return <></>;
  };

  private tabs: Tab[] =
    isNewContainer(this.props.match.params.id)
      ? [
        {
          title: 'Container',
          id: 'container',
          content: () => this.container()
        },
      ]
      : [
        {
          title: 'Container',
          id: 'container',
          content: () => this.container()
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
  const isLoading = state.entities.containers.isLoadingContainers;
  const error = state.entities.containers.loadContainersError;
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