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

import React, {createRef} from "react";
import {ReduxState} from "../../reducers";
import {IService} from "./Service";
import {connect} from "react-redux";
import List from "../../components/list/List";
import {bindActionCreators} from "redux";
import {addServiceDependency, loadServiceDependencies, loadServices, removeServiceDependencies} from "../../actions";
import ListItem from "../../components/list/ListItem";
import styles from './ServiceDependencyList.module.css';
import M from "materialize-css";
import PerfectScrollbar from "react-perfect-scrollbar";
import {deleteData, patchData} from "../../utils/api";
import BaseComponent from "../../components/BaseComponent";

export interface IServiceDependency extends IService {
}

interface StateToProps {
  isLoading: boolean;
  error?: string | null;
  dependenciesNames: string[];
  servicesNames: string[];
}

interface DispatchToProps {
  loadServices: (name?: string) => any;
  loadServiceDependencies: (serviceName: string) => void;
  removeServiceDependencies: (serviceName: string, dependencies: string[]) => void;
  addServiceDependency: (serviceName: string, dependencyName: string) => void;
}

interface ServiceDependencyProps {
  service: IService | Partial<IService>;
  addServiceDependencyCallback: (dependency: string) => void;
}

type Props = StateToProps & DispatchToProps & ServiceDependencyProps;

interface State {
  [key: string]: { isChecked: boolean, isNew: boolean } | undefined;
}

class ServiceDependencyList extends BaseComponent<Props, State> {

  private dropdown = createRef<HTMLButtonElement>();
  private globalCheckbox = createRef<HTMLInputElement>();

  state: State = {};

  componentDidMount(): void {
    const {serviceName} = this.props.service;
    if (serviceName) {
      this.props.loadServiceDependencies(serviceName);
    }
    else {
      this.props.loadServices();
    }
    M.Dropdown.init(this.dropdown.current as Element);
  }

  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any): void {
    if (this.globalCheckbox.current) {
      this.globalCheckbox.current.checked = Object.values(this.state)
                                                  .map(dependency => !!dependency?.isChecked)
                                                  .every(checked => checked);
    }
    if (prevProps.dependenciesNames !== this.props.dependenciesNames)
      this.setState(this.props.dependenciesNames.reduce((state: State, dependency: string) => {
        state[dependency] = { isChecked: false, isNew: false };
        return state;
      }, {}));
  }

  private handleGlobalCheckbox = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {checked} = event.target;
    this.setState(state => Object.entries(state).reduce((newState: State, [dependencyName, dependency]) => {
      newState[dependencyName] = { isChecked: checked, isNew: dependency?.isNew || false };
      return newState;
    }, {}));
  };


  private handleCheckbox = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {id: dependencyName, checked} = event.target;
    this.setState(state => ({[dependencyName]: { isChecked: checked, isNew: state[dependencyName]?.isNew || false } }));
  };

  private dependency = (dependency: string, index: number): JSX.Element =>
    <ListItem separate={index != Object.entries(this.state).filter(([_, dependency]) => dependency).length - 1}>
      <p>
        <label>
          <input id={dependency}
                 type="checkbox"
                 onChange={this.handleCheckbox}
                 checked={this.state[dependency]?.isChecked}/>
          <span>{dependency}</span>
        </label>
      </p>
    </ListItem>;

  private onDeleteSuccess = (): void => {
    const dependencies = Object.entries(this.state).filter(([_, dependency]) => dependency?.isChecked).map(([key, value]) => key);
    const serviceName = this.props.service.serviceName;
    if (serviceName) {
      this.props.removeServiceDependencies(serviceName, dependencies);
      dependencies.forEach(dependency => this.setState({[dependency]: undefined}));
    }
  };

  private onDeleteFailure = (reason: string): void =>
    super.toast(`Unable to delete dependency`, 10000, reason, true);

  private handleRemoveDependencies = (): void => {
    const checkedDependencies = Object.entries(this.state).filter(([_, dependency]) => dependency?.isChecked);
    checkedDependencies
      .filter(([_, dependency]) => dependency?.isNew)
      .map(([name, _]) => name)
      .forEach(dependencyName => this.setState({[dependencyName]: undefined}));
    const existingDependenciesNames = checkedDependencies
      .filter(([_, dependency]) => !dependency?.isNew)
      .map(([name, _]) => name);
    if (existingDependenciesNames.length) {
      if (existingDependenciesNames.length > 1) {
        patchData(`services/${this.props.service.serviceName}/dependencies`, existingDependenciesNames,
          this.onDeleteSuccess, this.onDeleteFailure, "delete");
      }
      else {
        const dependencyName = existingDependenciesNames[0];
        deleteData(`services/${this.props.service.serviceName}/dependencies/${dependencyName}`,
          this.onDeleteSuccess, this.onDeleteFailure);
      }
    }

  };

  private handleAddDependency = (event: React.MouseEvent<HTMLLIElement>): void => {
    const dependencyName = (event.target as HTMLLIElement).innerHTML;
    this.props.addServiceDependencyCallback(dependencyName);
    this.setState({ [dependencyName]: { isChecked: false, isNew: true } });
  };

  private getDependencyNames = (): string[] =>
    Object.entries(this.state)
          .filter(([_, dependency]) => dependency)
          .map(([name, _]) => name);

  private getSelectableServicesNames = (dependenciesNames: string[]) => {
    const {servicesNames, service} = this.props;
    return servicesNames.filter(name => !service || name !== service.serviceName && !dependenciesNames.includes(name));
  };

  render() {
    const dependenciesNames = this.getDependencyNames();
    const selectableServices = this.getSelectableServicesNames(dependenciesNames);
    const ServiceDependenciesList = List<string>();
    return (
      <div>
        <div className={`controlsContainer`}>
          {dependenciesNames.length > 0 && (
            <p className={`${styles.nolabelCheckbox}`}>
              <label>
                <input type="checkbox"
                       onChange={this.handleGlobalCheckbox}
                       ref={this.globalCheckbox}/>
                <span/>
              </label>
            </p>
          )}
          <button className={`dropdown-trigger btn-floating btn-flat btn-small waves-effect waves-light right tooltipped`}
                  data-position="bottom" data-tooltip="New dependency"
                  data-target='servicesDropdown'
                  ref={this.dropdown}>
            <i className="material-icons">add</i>
          </button>
          <ul id='servicesDropdown' className={`dropdown-content ${styles.dropdown}`}>
            <li className={`${styles.disabled}`}>
              <a>Add dependency</a>
            </li>
            <PerfectScrollbar>
              {selectableServices.map((service, index) =>
                <li key={index} onClick={this.handleAddDependency}>
                  <a>{service}</a>
                </li>
              )}
            </PerfectScrollbar>
          </ul>
          <button className="btn-flat btn-small waves-effect waves-light red-text right"
                  style={Object.values(this.state)
                               .map(dependency => dependency?.isChecked || false)
                               .some(checked => checked)
                    ? {transform: "scale(1)"}
                    : {transform: "scale(0)"}}
                  onClick={this.handleRemoveDependencies}>
            Remove
          </button>
        </div>
        <ServiceDependenciesList
          isLoading={this.props.isLoading}
          error={this.props.error}
          emptyMessage={`Dependencies list is empty`}
          list={dependenciesNames}
          show={this.dependency}/>
      </div>
    )
  }

}

function mapStateToProps(state: ReduxState, ownProps: ServiceDependencyProps): StateToProps {
  const serviceName = ownProps.service.serviceName;
  const service = serviceName && state.entities.services.data[serviceName];
  const dependencies = service && service.dependencies;
  return {
    isLoading: state.entities.services.isLoadingDependencies,
    error: state.entities.services.loadDependenciesError,
    dependenciesNames: dependencies || [],
    servicesNames: Object.keys(state.entities.services.data)
  }
}

const mapDispatchToProps = (dispatch: any): DispatchToProps =>
  bindActionCreators({
    loadServices,
    loadServiceDependencies,
    removeServiceDependencies,
    addServiceDependency
  }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ServiceDependencyList);