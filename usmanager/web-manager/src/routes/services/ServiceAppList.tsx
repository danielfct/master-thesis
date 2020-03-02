import BaseComponent from "../../components/BaseComponent";
import React from "react";
import {IService} from "./Service";
import ListItem from "../../components/list/ListItem";
import styles from "../../components/list/ListItem.module.css";
import {Link} from "react-router-dom";
import ControlledList from "../../components/list/ControlledList";
import {ReduxState} from "../../reducers";
import {bindActionCreators} from "redux";
import {
  addServiceApp,
  loadApps,
  loadServiceApps,
  removeServiceApps
} from "../../actions";
import {connect} from "react-redux";
import Data from "../../components/IData";

export interface IApp extends Data {
  name: string;
}

interface StateToProps {
  isLoading: boolean;
  error?: string | null;
  apps: { [key: string]: IApp },
  serviceApps: string[];
}

interface DispatchToProps {
  loadApps: (name?: string) => any;
  loadServiceApps: (serviceName: string) => void;
  removeServiceApps: (serviceName: string, apps: string[]) => void;
  addServiceApp: (serviceName: string, app: string) => void;
}

interface ServiceAppListProps {
  service: IService | Partial<IService>;
  newApps: string[];
  onAddServiceApp: (app: string) => void;
  onRemoveServiceApps: (apps: string[]) => void;
}

type Props = StateToProps & DispatchToProps & ServiceAppListProps;

class ServiceAppList extends BaseComponent<Props, {}> {

  componentDidMount(): void {
    this.props.loadApps();
    const {serviceName} = this.props.service;
    if (serviceName) {
      this.props.loadServiceApps(serviceName);
    }
  }

  private app = (index: number, app: string, separate: boolean, checked: boolean,
                 handleCheckbox: (event: React.ChangeEvent<HTMLInputElement>) => void): JSX.Element =>
    <ListItem key={index} separate={separate}>
      <div className={`${styles.itemContent}`}>
        <label>
          <input id={app}
                 type="checkbox"
                 onChange={handleCheckbox}
                 checked={checked}/>
          <span id={'checkbox'}>{app}</span>
        </label>
      </div>
      <Link to={`/apps/${app}`}
            className={`${styles.link}`}/>
    </ListItem>;

  private onAdd = (app: string): void =>
    this.props.onAddServiceApp(app);

  private onRemove = (apps: string[]) =>
    this.props.onRemoveServiceApps(apps);

  private onDeleteSuccess = (apps: string[]): void => {
    const {serviceName} = this.props.service;
    if (serviceName) {
      this.props.removeServiceApps(serviceName, apps);
    }
  };

  private onDeleteFailure = (reason: string): void =>
    super.toast(`Unable to delete app`, 10000, reason, true);

  private getSelectableAppsNames = () => {
    const {apps, serviceApps} = this.props;
    const {newApps} = this.props;
    return Object.keys(apps).filter(name => !serviceApps.includes(name) && !newApps.includes(name));
  };

  render() {
    return <ControlledList isLoading={this.props.isLoading}
                           error={this.props.error}
                           emptyMessage={`Apps list is empty`}
                           data={this.props.serviceApps}
                           dropdown={{
                             id: 'apps',
                             title: 'Add app',
                             empty: 'No more apps to add',
                             data: this.getSelectableAppsNames()
                           }}
                           show={this.app}
                           onAdd={this.onAdd}
                           onRemove={this.onRemove}
                           onDelete={{
                             url: `services/${this.props.service.serviceName}/dependencies`,
                             successCallback: this.onDeleteSuccess,
                             failureCallback: this.onDeleteFailure
                           }}/>;

  }

}

function mapStateToProps(state: ReduxState, ownProps: ServiceAppListProps): StateToProps {
  const serviceName = ownProps.service.serviceName;
  const service = serviceName && state.entities.services.data[serviceName];
  const serviceApps = service && service.apps;
  return {
    isLoading: state.entities.services.isLoadingApps,
    error: state.entities.services.loadAppsError,
    apps: state.entities.apps.data,
    serviceApps: serviceApps || [],
  }
}

const mapDispatchToProps = (dispatch: any): DispatchToProps =>
  bindActionCreators({
    loadApps,
    loadServiceApps,
    removeServiceApps,
    addServiceApp
  }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ServiceAppList);