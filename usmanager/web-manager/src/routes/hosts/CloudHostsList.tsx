import React from 'react';
import {connect} from "react-redux";
import {ReduxState} from "../../reducers";
import CardList from "../../components/list/CardList";
import BaseComponent from "../../components/BaseComponent";
import {loadCloudHosts, loadEdgeHosts} from "../../actions";
import {ICloudHost} from "./CloudHost";
import CloudHostCard from "./CloudHostCard";

interface StateToProps {
  isLoading: boolean
  error?: string | null;
  cloudHosts: ICloudHost[];
}

interface DispatchToProps {
  loadCloudHosts: (instanceId?: string) => any;
}

type Props = StateToProps & DispatchToProps;

class CloudHostsList extends BaseComponent<Props, {}> {

  componentDidMount(): void {
    this.props.loadCloudHosts();
  }

  private cloudHost = (host: ICloudHost): JSX.Element =>
    <CloudHostCard key={host.instanceId} cloudHost={host}/>;

  private predicate = (host: ICloudHost, search: string): boolean =>
    host.publicIpAddress.toLowerCase().includes(search);

  render = () =>
    <CardList<ICloudHost>
      isLoading={this.props.isLoading}
      error={this.props.error}
      emptyMessage={"No cloud hosts to display"}
      list={this.props.cloudHosts}
      card={this.cloudHost}
      predicate={this.predicate}/>

}

const mapStateToProps = (state: ReduxState): StateToProps => (
  {
    isLoading: state.entities.hosts.cloud.isLoading,
    error: state.entities.hosts.cloud.error,
    cloudHosts: (state.entities.hosts.cloud.data && Object.values(state.entities.hosts.cloud.data)) || [],
  }
);

const mapDispatchToProps: DispatchToProps = {
  loadCloudHosts,
};

export default connect(mapStateToProps, mapDispatchToProps)(CloudHostsList);
