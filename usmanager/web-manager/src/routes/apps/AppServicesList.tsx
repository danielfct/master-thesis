import BaseComponent from "../../components/BaseComponent";
import React from "react";
import ListItem from "../../components/list/ListItem";
import listItemStyles from "../../components/list/ListItem.module.css";
import {Link} from "react-router-dom";
import ControlledList from "../../components/list/ControlledList";
import {ReduxState} from "../../reducers";
import {bindActionCreators} from "redux";
import {
  loadAppServices, loadServices, removeAppServices,
} from "../../actions";
import {connect} from "react-redux";
import {IApp} from "./App";
import {IService} from "../services/Service";
import Field from "../../components/form/Field";
import {
  IFields,
  IValues,
  requiredAndNumberAndMinAndMax
} from "../../components/form/Form";
import Data from "../../components/IData";

export interface IAppService extends Data {
  service: IService;
  launchOrder: number;
}

export interface IAddAppService {
  service: string;
  launchOrder: number;
}

interface StateToProps {
  isLoading: boolean;
  error?: string | null;
  appServices: IAppService[];
  services: { [key: string]: IService };
}

interface DispatchToProps {
  loadAppServices: (appName: string) => void;
  removeAppServices: (appName: string, services: string[]) => void;
  loadServices: () => void;
}

interface ServiceAppListProps {
  app: IApp | Partial<IApp>;
  unsavedServices: IAddAppService[];
  onAddAppService: (service: IAddAppService) => void;
  onRemoveAppServices: (services: string[]) => void;
}

type Props = StateToProps & DispatchToProps & ServiceAppListProps;

type State = {
  selectedService?: string,
  newServices: IAddAppService[],
}

class ServiceAppList extends BaseComponent<Props, State> {

  state: State = {
    newServices: [],
  };

  componentDidMount(): void {
    const {name} = this.props.app;
    if (name) {
      this.props.loadAppServices(name);
    }
    this.props.loadServices();
  }

  private service = (index: number, service: IAppService | IAddAppService, separate: boolean, checked: boolean,
                     handleCheckbox: (event: React.ChangeEvent<HTMLInputElement>) => void): JSX.Element => {
    const serviceName = typeof service.service === 'string' ? service.service : service.service.serviceName;
    const unsaved = this.props.unsavedServices.map(service => service.service).includes(service.service.toString());
    return (
      <ListItem key={index} separate={separate}>
        <div className={`${listItemStyles.linkedItemContent}`}>
          <label>
            <input id={serviceName}
                   type="checkbox"
                   onChange={handleCheckbox}
                   checked={checked}/>
            <span id={'checkbox'}>
              <div className={unsaved ? listItemStyles.unsavedItem : undefined}>
                {service.launchOrder}. {serviceName}
              </div>
            </span>
          </label>
        </div>
        <Link to={`/services/${serviceName}`}
              className={`${listItemStyles.link} waves-effect`}>
          <i className={`${listItemStyles.linkIcon} material-icons right`}>link</i>
        </Link>
      </ListItem>
    );
  };

  private onAdd = (service: IValues): void => {
    this.props.onAddAppService(service as IAddAppService);
    this.setState({
      newServices: this.state.newServices.concat(service as IAddAppService)
    });
    this.setState({selectedService: undefined});
  };

  private onRemove = (services: string[]): void => {
    this.props.onRemoveAppServices(services);
    this.setState({
      newServices: this.state.newServices.filter(service => !services.includes(service.service))
    });
  };


  private onDeleteSuccess = (services: string[]): void => {
    const {name} = this.props.app;
    if (name) {
      this.props.removeAppServices(name, services);
    }
  };

  private onDeleteFailure = (reason: string): void =>
    super.toast(`Unable to delete service`, 10000, reason, true);

  private getSelectableServicesNames = () => {
    const {appServices, services} = this.props;
    const {newServices} = this.state;
    const nonSystemServices = Object.entries(services)
                                    .filter(([_, value]) => value.serviceType !== 'system')
                                    .map(([key, _]) => key);
    const serviceNames = appServices.map(appService => appService.service.serviceName);
    const newServicesNames = newServices.map(service => service.service);
    return nonSystemServices.filter(name => !serviceNames.includes(name) && !newServicesNames.includes(name));
  };

  private addModal = () =>
    <>
      <Field key='launchOrder' id={'launchOrder'} label='launchOrder' type={'numberbox'} number={{min: 0, max: 2147483647}}/>
    </>;

  private getModalFields = (): IFields => (
    {
      launchOrder: {
        id: 'launchOrder',
        label: 'launchOrder',
        validation: { rule: requiredAndNumberAndMinAndMax, args: [0, 2147483647] }
      }
    }
  );

  private getModalValues = (): IValues => (
    {
      launchOrder: 0
    }
  );

  private onModalOpen = (selectedService: string): void => {
    this.setState({selectedService: selectedService});
  };

  render() {
    return <ControlledList<IAppService>
      isLoading={this.props.isLoading}
      error={this.props.error}
      emptyMessage={`Services list is empty`}
      data={this.props.appServices}
      dataKey={['service', 'serviceName']}
      dropdown={{
        id: 'appServices',
        title: 'Add service',
        empty: 'No more services to add',
        data: this.getSelectableServicesNames(),
        formModal: {
          id: 'appService',
          fields: this.getModalFields(),
          values: this.getModalValues(),
          content: this.addModal,
          position: '20%',
          onOpen: this.onModalOpen,
          open: this.state.selectedService !== undefined,
        }
      }}
      show={this.service}
      onAddInput={this.onAdd}
      onRemove={this.onRemove}
      onDelete={{
        url: `apps/${this.props.app.name}/services`,
        successCallback: this.onDeleteSuccess,
        failureCallback: this.onDeleteFailure
      }}/>;
  }

}

function mapStateToProps(state: ReduxState, ownProps: ServiceAppListProps): StateToProps {
  const appName = ownProps.app.name;
  const app = appName && state.entities.apps.data[appName];
  const appServices = app && app.services;
  return {
    isLoading: state.entities.apps.isLoadingServices,
    error: state.entities.apps.loadServicesError,
    appServices: appServices && Object.values(appServices).sort((a, b) => a.launchOrder - b.launchOrder) || [],
    services: state.entities.services.data,
  }
}

const mapDispatchToProps = (dispatch: any): DispatchToProps =>
  bindActionCreators({
    loadServices,
    loadAppServices,
    removeAppServices,
  }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ServiceAppList);