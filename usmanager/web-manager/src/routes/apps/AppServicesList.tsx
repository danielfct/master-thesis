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

interface StateToProps {
  isLoading: boolean;
  error?: string | null;
  appServices: string[];
  services: { [key: string]: IService };
}

interface DispatchToProps {
  loadAppServices: (appName: string) => void;
  removeAppServices: (appName: string, services: string[]) => void;
  loadServices: () => void;
}

interface ServiceAppListProps {
  app: IApp | Partial<IApp>;
  newServices: string[];
  onAddAppService: (service: string) => void;
  onRemoveAppServices: (service: string[]) => void;
}

type Props = StateToProps & DispatchToProps & ServiceAppListProps;

class ServiceAppList extends BaseComponent<Props, {}> {

  componentDidMount(): void {
    const {name} = this.props.app;
    if (name) {
      this.props.loadAppServices(name);
    }
    this.props.loadServices();
  }

  private service = (index: number, service: string, separate: boolean, checked: boolean,
                 handleCheckbox: (event: React.ChangeEvent<HTMLInputElement>) => void): JSX.Element =>
    <ListItem key={index} separate={separate}>
      <div className={`${listItemStyles.linkedItemContent}`}>
        <label>
          <input id={service}
                 type="checkbox"
                 onChange={handleCheckbox}
                 checked={checked}/>
          <span id={'checkbox'}>{service}</span>
        </label>
      </div>
      <Link to={`/services/${service}`}
            className={`${listItemStyles.link} waves-effect`}>
        <i className={`${listItemStyles.linkIcon} material-icons right`}>link</i>
      </Link>
    </ListItem>;

  private onAdd = (service: string): void => {
    this.props.onAddAppService(service);
  };

  private onRemove = (services: string[]): void =>
    this.props.onRemoveAppServices(services);

  private onDeleteSuccess = (services: string[]): void => {
    const {name} = this.props.app;
    if (name) {
      this.props.removeAppServices(name, services);
    }
  };

  private onDeleteFailure = (reason: string): void =>
    super.toast(`Unable to delete service`, 10000, reason, true);

  private getSelectableServicesNames = () => {
    const {appServices, services, newServices} = this.props;
    const nonSystemServices = Object.entries(services)
                                    .filter(([_, value]) => value.serviceType !== 'system')
                                    .map(([key, _]) => key);
    return nonSystemServices.filter(name => !appServices.includes(name) && !newServices.includes(name));
  };

  render() {
    return <ControlledList isLoading={this.props.isLoading}
                           error={this.props.error}
                           emptyMessage={`Services list is empty`}
                           data={this.props.appServices}
                           dropdown={{
                             id: 'appServices',
                             title: 'Add service',
                             empty: 'No more services to add',
                             data: this.getSelectableServicesNames(),
                           }}
                           show={this.service}
                           onAdd={this.onAdd}
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
  const appServices = app && app.services && Object.keys(app.services);
  return {
    isLoading: state.entities.apps.isLoadingServices,
    error: state.entities.apps.loadServicesError,
    appServices: appServices || [],
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