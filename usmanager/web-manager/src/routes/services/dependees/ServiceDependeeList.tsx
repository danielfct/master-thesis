/*
 * Copyright (c) 2020 usmanager
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import {IService} from "../Service";
import React from "react";
import ListItem from "../../../components/list/ListItem";
import styles from "../../../components/list/ListItem.module.css";
import {Link} from "react-router-dom";
import BaseComponent from "../../../components/BaseComponent";
import {ReduxState} from "../../../reducers";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import List from "../../../components/list/List";
import {loadServiceDependees} from "../../../actions";

export interface IDependee extends IService {
}

interface StateToProps {
  isLoading: boolean;
  error?: string | null;
  dependeeNames: string[];
}

interface DispatchToProps {
  loadServiceDependees: (serviceName: string) => void;
}

interface ServiceDependeeListProps {
  service: IService | Partial<IService>;
  newDependees: string[];
}

type Props = StateToProps & DispatchToProps & ServiceDependeeListProps;

class ServiceDependeeList extends BaseComponent<Props, {}> {

  componentDidMount(): void {
    const {serviceName} = this.props.service;
    if (serviceName) {
      this.props.loadServiceDependees(serviceName);
    }
  }

  private dependee = (dependee: string, index: number): JSX.Element =>
    <ListItem key={index} separate>
      <div className={`${styles.linkedItemContent}`}>
        <span>{dependee}</span>
      </div>
      <Link to={`/services/${dependee}`}
            className={`${styles.link}`}/>
    </ListItem>;

  render() {
    const DependeesList = List<string>();
    return (
      <DependeesList isLoading={this.props.isLoading}
                     error={this.props.error}
                     emptyMessage={`Dependees list is empty`}
                     list={this.props.dependeeNames}
                     show={this.dependee}/>
    );
  }

}

function mapStateToProps(state: ReduxState, ownProps: ServiceDependeeListProps): StateToProps {
  const serviceName = ownProps.service.serviceName;
  const service = serviceName && state.entities.services.data[serviceName];
  const serviceDependees = service && service.dependees;
  return {
    isLoading: state.entities.services.isLoadingDependees,
    error: state.entities.services.loadDependeesError,
    dependeeNames: serviceDependees || [],
  }
}

const mapDispatchToProps = (dispatch: any): DispatchToProps =>
  bindActionCreators({
    loadServiceDependees,
  }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ServiceDependeeList);