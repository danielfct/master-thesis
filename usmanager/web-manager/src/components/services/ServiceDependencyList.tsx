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
import List from "../shared/List";
import {bindActionCreators} from "redux";
import {loadServiceDependencies, loadServices} from "../../actions";
import ListItem from "../shared/ListItem";
import styles from './ServiceDependencyList.module.css';
import M from "materialize-css";
import PerfectScrollbar from "react-perfect-scrollbar";
import {deleteData, patchData} from "../../utils/api";

export interface IServiceDependency extends IService {
}

interface StateToProps {
  isLoading: boolean
  error?: string | null;
  dependencies: string[],
  services: string[];
}

interface DispatchToProps {
  loadServices: (name?: string) => any;
  loadServiceDependencies: (serviceName: string) => void;
}

interface ServiceDependencyProps {
  service: IService | Partial<IService>;
}

type Props = StateToProps & DispatchToProps & ServiceDependencyProps;

interface State {
  [key: string]: boolean;
}

const GLOBAL_CHECKBOX_ID = "GLOBAL_CHECKBOX";

class ServiceDependencyList extends React.Component<Props, State> {

  private dropdown = createRef<HTMLButtonElement>();
  private globalCheckbox = createRef<HTMLInputElement>();

  constructor(props: Props) {
    super(props);
    this.state = props.dependencies.reduce((state: any, dependency: string) => {
      state[dependency] = false;
      return state;
    }, {});
  }

  componentDidMount(): void {
    this.props.loadServices();
    const {serviceName} = this.props.service;
    if (serviceName) {
      this.props.loadServiceDependencies(serviceName);
    }
    M.Dropdown.init(this.dropdown.current as Element);
  }

  private handleCheckbox = ({target:{id, checked}}:any) => {
    if (id !== GLOBAL_CHECKBOX_ID) {
      this.setState({[id]: checked}, () => {
        if (this.globalCheckbox.current) {
          this.globalCheckbox.current.checked = Object.values(this.state).every((checked: boolean) => checked);
        }
      });
    }
    else {
      this.setState(this.props.dependencies.reduce((newState: any, dependency: string) => {
        newState[dependency] = checked;
        return newState;
      }, {}));
    }
  };

  private dependency = (dependency: string) => {
    return (
      <ListItem>
        <p>
          <label>
            <input id={dependency}
                   type="checkbox"
                   onChange={this.handleCheckbox}
                   checked={this.state[dependency]}/>
            <span>{dependency}</span>
          </label>
        </p>
      </ListItem>
    );
  };

  private onDeleteSuccess = () =>
    M.toast({html: `<div>Dependency successfully removed!</div>`});

  private onDeleteFailure = (reason: string) =>
    M.toast({html: `Failed to delete dependency: ${reason}`});

  private handleRemoveDependencies = () => {
    const toDelete = Object.entries(this.state).filter(([_, checked]) => checked).map(([name, _]) => name);
    const dependencies = this.props.dependencies.filter(dependency => toDelete.includes(dependency));
    if (toDelete.length > 1) {
      const request = dependencies.join(" ");
      patchData(`/services/${this.props.service.id}/dependencies`, request,() => {
          M.toast({ html: '<div>Dependencies removed</div>' });
        },
        "delete");
    } else {
      const dependency = dependencies[0];
      deleteData(`/services/${this.props.service.serviceName}/dependencies/${dependency}`, this.onDeleteSuccess, this.onDeleteFailure);
    }
  };

  render() {
    const {services, service, dependencies} = this.props;
    const selectableServices = services.filter(name => !service || name !== service.serviceName && !dependencies.includes(name));
    const ServiceDependenciesList = List<string>();
    return (
      <div>
        <div className={`${styles.controlsContainer}`}>
          {dependencies.length > 0 && (
            <p className={`${styles.nolabelCheckbox}`}>
              <label>
                <input id={GLOBAL_CHECKBOX_ID}
                       type="checkbox"
                       onChange={this.handleCheckbox}
                       ref={this.globalCheckbox}/>
                <span/>
              </label>
            </p>
          )}
          <button className='dropdown-trigger btn-floating btn-flat btn-small waves-effect waves-light right tooltipped'
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
                <li key={index}>
                  <a>{service}</a>
                </li>
              )}
            </PerfectScrollbar>
          </ul>
          <button className="btn-flat btn-small waves-effect waves-light red-text right"
                  style={Object.values(this.state).some((checked: boolean) => checked) ? {transform: "scale(1)"} : {transform: "scale(0)"}}
                  onClick={this.handleRemoveDependencies}>
            Remove
          </button>
        </div>
        <ServiceDependenciesList
          isLoading={this.props.isLoading}
          error={this.props.error}
          emptyMessage={`Dependencies list is empty`}
          list={dependencies}
          show={this.dependency}
          useSeparator/>
      </div>
    )
  }

}

function mapStateToProps(state: ReduxState, ownProps: ServiceDependencyProps): StateToProps {
  const serviceName = ownProps.service.serviceName;
  const service = serviceName && state.entities.services.data[serviceName];
  const dependencies = service && service.dependencies;
  return {
    isLoading: state.entities.services.isLoading,
    error: state.entities.services.error,
    dependencies: dependencies || [],
    services: Object.keys(state.entities.services.data)
  }
}

const mapDispatchToProps = (dispatch: any): DispatchToProps =>
  bindActionCreators({ loadServices, loadServiceDependencies }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ServiceDependencyList);