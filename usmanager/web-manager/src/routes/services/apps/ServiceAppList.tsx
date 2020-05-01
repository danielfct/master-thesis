/*
 * Copyright (c) 2020 usmanager
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import BaseComponent from "../../../components/BaseComponent";
import React, {createRef} from "react";
import {IService} from "../Service";
import ListItem from "../../../components/list/ListItem";
import listItemStyles from "../../../components/list/ListItem.module.css";
import appServiceStyles from "./ServiceAppList.module.css";
import {Link} from "react-router-dom";
import ControlledList from "../../../components/list/ControlledList";
import {ReduxState} from "../../../reducers";
import {bindActionCreators} from "redux";
import {
  addServiceApp,
  loadApps, loadAppServices,
  loadServiceApps,
  removeServiceApps
} from "../../../actions";
import {connect} from "react-redux";
import Field from "../../../components/form/Field";
import {IFields, IValues, required, requiredAndNumberAndMin} from "../../../components/form/Form";
import List from "../../../components/list/List";
import M from "materialize-css";
import Collapsible from "../../../components/collapsible/Collapsible";
import {IApp} from "../../apps/App";
import {IAppService} from "../../apps/AppServicesList";

export interface IAddServiceApp {
  name: string;
  launchOrder: number;
}

interface StateToProps {
  isLoading: boolean;
  error?: string | null;
  apps: { [key: string]: IApp },
  serviceApps: string[];
  isLoadingAppServices: boolean;
}

interface DispatchToProps {
  loadApps: (name?: string) => any;
  loadServiceApps: (serviceName: string) => void;
  loadAppServices: (appName: string) => void;
  removeServiceApps: (serviceName: string, apps: string[]) => void;
  addServiceApp: (serviceName: string, app: string) => void;
}

interface ServiceAppListProps {
  service: IService | Partial<IService>;
  newApps: IAddServiceApp[];
  onAddServiceApp: (app: IAddServiceApp) => void;
  onRemoveServiceApps: (apps: string[]) => void;
}

type Props = StateToProps & DispatchToProps & ServiceAppListProps;

type State = {
  selectedApp?: string,
}

class ServiceAppList extends BaseComponent<Props, State> {

  private collapsible = createRef<HTMLUListElement>();

  state: State = {};

  componentDidMount(): void {
    this.props.loadApps();
    const {serviceName} = this.props.service;
    if (serviceName) {
      this.props.loadServiceApps(serviceName);
    }
  }

  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<{}>, snapshot?: any): void {
    M.Collapsible.init(this.collapsible.current as Element);
  }

  private app = (index: number, app: string, separate: boolean, checked: boolean,
                 handleCheckbox: (event: React.ChangeEvent<HTMLInputElement>) => void): JSX.Element =>
    <ListItem key={index} separate={separate}>
      <div className={`${listItemStyles.linkedItemContent}`}>
        <label>
          <input id={app}
                 type="checkbox"
                 onChange={handleCheckbox}
                 checked={checked}/>
          <span id={'checkbox'}>{app}</span>
        </label>
      </div>
      <Link to={`/apps/${app}`}
            className={`${listItemStyles.link} waves-effect`}>
        <i className={`${listItemStyles.linkIcon} material-icons right`}>link</i>
      </Link>
    </ListItem>;

  private onAdd = (app: IValues): void => {
    this.props.onAddServiceApp(app as IAddServiceApp);
    this.setState({selectedApp: undefined});
  };

  private onRemove = (apps: string[]): void =>
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
    const {apps, serviceApps, newApps} = this.props;
    const newAppsNames = newApps.map(app => app.name);
    return Object.keys(apps).filter(name => !serviceApps.includes(name) && !newAppsNames.includes(name));
  };

  private appServicesLaunchOrder = (service: IAppService, index: number) =>
    <ListItem key={index}>
      <div className={`${appServiceStyles.appServiceItem}`}>
        <span>{service.launchOrder} - {service.service.serviceName}</span>
      </div>
    </ListItem>;

  private appServicesList = (): IAppService[] | undefined => {
    if (this.state.selectedApp) {
      return this.props.apps[this.state.selectedApp] && Object.values(this.props.apps[this.state.selectedApp].services)
                                                              .filter(service => service.service.serviceName !== this.props.service.serviceName)
                                                              .sort((a,b) => a.launchOrder - b.launchOrder);
    }
  };

  private addModal = () => {
    const OtherServicesList = List<IAppService>();
    const list = this.appServicesList();
    return (
      <>
        <Field key='launchOrder' id={'launchOrder'} label='launchOrder'/>
        <Collapsible id={'otherServicesList'}
                     title={'Other services\' launch order'}>
          {list && <OtherServicesList list={list} show={this.appServicesLaunchOrder}/>}
        </Collapsible>
      </>
    )};


  private getModalFields = (): IFields => (
    {
      launchOrder: {
        id: 'launchOrder',
        label: 'launchOrder',
        validation: { rule: requiredAndNumberAndMin, args: 0 }
      }
    }
  );

  private getModalValues = (): IValues => (
    {
      launchOrder: 0
    }
  );

  private onModalOpen = (selectedApp: string): void => {
    this.setState({selectedApp: selectedApp});
    this.props.loadAppServices(selectedApp);
  };

  render() {
    console.log(this.props.serviceApps)
    return <ControlledList<string> isLoading={this.props.isLoading}
                           error={this.props.error}
                           emptyMessage='Apps list is empty'
                           data={this.props.serviceApps}
                           dataKey={[]} //TODO
                           dropdown={{
                             id: 'apps',
                             title: 'Add app',
                             empty: 'No more apps to add',
                             data: this.getSelectableAppsNames(),
                             formModal: {
                               id: 'serviceApp',
                               fields: this.getModalFields(),
                               values: this.getModalValues(),
                               content: this.addModal,
                               position: '20%',
                               onOpen: this.onModalOpen,
                               open: this.state.selectedApp !== undefined && !this.props.isLoadingAppServices,
                             }
                           }}
                           show={this.app}
                           onAddInput={this.onAdd}
                           onRemove={this.onRemove}
                           onDelete={{
                             url: `services/${this.props.service.serviceName}/apps`,
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
    isLoadingAppServices: state.entities.apps.isLoadingServices,
  }
}

const mapDispatchToProps = (dispatch: any): DispatchToProps =>
  bindActionCreators({
    loadApps,
    loadServiceApps,
    loadAppServices,
    removeServiceApps,
    addServiceApp
  }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ServiceAppList);