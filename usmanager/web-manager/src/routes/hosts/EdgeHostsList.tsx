import React from 'react';
import {connect} from "react-redux";
import {ReduxState} from "../../reducers";
import CardList from "../../components/list/CardList";
import {IEdgeHost} from "./EdgeHost";
import BaseComponent from "../../components/BaseComponent";
import {loadEdgeHosts} from "../../actions";
import EdgeHostCard from "./EdgeHostCard";

interface StateToProps {
  isLoading: boolean
  error?: string | null;
  edgeHosts: IEdgeHost[];
}

interface DispatchToProps {
  loadEdgeHosts: (hostname?: string) => any;
}

type Props = StateToProps & DispatchToProps;

class EdgeHostsList extends BaseComponent<Props, {}> {

  componentDidMount(): void {
    this.props.loadEdgeHosts();
  }

  private edgeHost = (host: IEdgeHost): JSX.Element =>
    <EdgeHostCard key={host.id} edgeHost={host}/>;

  private predicate = (host: IEdgeHost, search: string): boolean =>
    host.hostname.toLowerCase().includes(search);

  render = () =>
    <CardList<IEdgeHost>
      isLoading={this.props.isLoading}
      error={this.props.error}
      emptyMessage={"No edge hosts to display"}
      list={this.props.edgeHosts}
      card={this.edgeHost}
      predicate={this.predicate}/>

}

const mapStateToProps = (state: ReduxState): StateToProps => (
  {
    isLoading: state.entities.hosts.edge.isLoading,
    error: state.entities.hosts.edge.error,
    edgeHosts: (state.entities.hosts.edge.data && Object.values(state.entities.hosts.edge.data)) || [],
  }
);

const mapDispatchToProps: DispatchToProps = {
  loadEdgeHosts,
};

export default connect(mapStateToProps, mapDispatchToProps)(EdgeHostsList);
