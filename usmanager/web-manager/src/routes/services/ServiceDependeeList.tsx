import {IService} from "./Service";
import React from "react";
import ListItem from "../../components/list/ListItem";
import styles from "../../components/list/ListItem.module.css";
import {Link} from "react-router-dom";
import BaseComponent from "../../components/BaseComponent";
import {ReduxState} from "../../reducers";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import List from "../../components/list/List";
import {loadServiceDependees} from "../../actions";

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
      <div className={`${styles.itemContent}`}>
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