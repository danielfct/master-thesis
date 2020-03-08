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

import React from "react";
import {ReduxState} from "../../reducers";
import {IService} from "./Service";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {addServiceDependency, loadServiceDependencies, loadServices, removeServiceDependencies} from "../../actions";
import BaseComponent from "../../components/BaseComponent";
import {Link, withRouter} from "react-router-dom";
import ControlledList from "../../components/list/ControlledList";
import ListItem from "../../components/list/ListItem";
import styles from "../../components/list/ListItem.module.css";

export interface IServiceDependency extends IService {
}

interface StateToProps {
  isLoading: boolean;
  error?: string | null;
  services: { [key: string]: IService },
  dependencies: string[];
}

interface DispatchToProps {
  loadServices: (name?: string) => any;
  loadServiceDependencies: (serviceName: string) => void;
  removeServiceDependencies: (serviceName: string, dependencies: string[]) => void;
  addServiceDependency: (serviceName: string, dependencyName: string) => void;
}

interface ServiceDependencyProps {
  service: IService | Partial<IService>;
  newDependencies: string[];
  onAddServiceDependency: (dependency: string) => void;
  onRemoveServiceDependencies: (dependencies: string[]) => void;
}

type Props = StateToProps & DispatchToProps & ServiceDependencyProps;

class ServiceDependencyList extends BaseComponent<Props, {}> {

  componentDidMount(): void {
    this.props.loadServices();
    const {serviceName} = this.props.service;
    if (serviceName) {
      this.props.loadServiceDependencies(serviceName);
    }
  }

  private dependency = (index: number, dependency: string, separate: boolean, checked: boolean,
                        handleCheckbox: (event: React.ChangeEvent<HTMLInputElement>) => void): JSX.Element =>
    <ListItem key={index} separate={separate}>
      <div className={`${styles.itemContent}`}>
        <label>
          <input id={dependency}
                 type="checkbox"
                 onChange={handleCheckbox}
                 checked={checked}/>
          <span id={'checkbox'}>{dependency}</span>
        </label>
      </div>
      <Link to={`/services/${dependency}`}
            className={`${styles.link}`}/>
    </ListItem>;

  private onAdd = (dependency: string): void =>
    this.props.onAddServiceDependency(dependency);

  private onRemove = (dependencies: string[]) =>
    this.props.onRemoveServiceDependencies(dependencies);

  private onDeleteSuccess = (dependencies: string[]): void => {
    const {serviceName} = this.props.service;
    if (serviceName) {
      this.props.removeServiceDependencies(serviceName, dependencies);
    }
  };

  private onDeleteFailure = (reason: string): void =>
    super.toast(`Unable to delete dependency`, 10000, reason, true);

  private getSelectableServicesNames = () => {
    const {services, service, dependencies, newDependencies} = this.props;
    return Object.keys(services)
                 .filter(name => !service || name !== service.serviceName && !dependencies.includes(name) && !newDependencies.includes(name));
  };

  render() {
    return <ControlledList isLoading={this.props.isLoading}
                           error={this.props.error}
                           emptyMessage={`Dependencies list is empty`}
                           data={this.props.dependencies}
                           dropdown={{
                             id: 'dependencies',
                             title: 'Add dependency',
                             empty: 'No more dependencies to add',
                             data: this.getSelectableServicesNames()
                           }}
                           show={this.dependency}
                           onAdd={this.onAdd}
                           onRemove={this.onRemove}
                           onDelete={{
                             url: `services/${this.props.service.serviceName}/dependencies`,
                             successCallback: this.onDeleteSuccess,
                             failureCallback: this.onDeleteFailure
                           }}/>;

  }

}

function mapStateToProps(state: ReduxState, ownProps: ServiceDependencyProps): StateToProps {
  //FIXME: crashes when not loading from services page
  const serviceName = ownProps.service.serviceName;
  const service = serviceName && state.entities.services.data[serviceName];
  const dependencies = service && service.dependencies;
  return {
    isLoading: state.entities.services.isLoadingDependencies,
    error: state.entities.services.loadDependenciesError,
    services: state.entities.services.data,
    dependencies: dependencies || [],
  }
}

const mapDispatchToProps = (dispatch: any): DispatchToProps =>
  bindActionCreators({
    loadServices,
    loadServiceDependencies,
    addServiceDependency,
    removeServiceDependencies,
  }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ServiceDependencyList);