import React from 'react';
import MainLayout from '../../views/mainLayout/MainLayout';
import ContainerCard from './ContainerCard';
import AddButton from "../../components/form/AddButton";
import {connect} from "react-redux";
import {ReduxState} from "../../reducers";
import CardList from "../../components/list/CardList";
import {IContainer} from "./Container";
import styles from './Containers.module.css'
import BaseComponent from "../../components/BaseComponent";
import {loadContainers} from "../../actions";

interface StateToProps {
  isLoading: boolean
  error?: string | null;
  containers: IContainer[];
}

interface DispatchToProps {
  loadContainers: (id?: string) => any;
}

type Props = StateToProps & DispatchToProps;

class Containers extends BaseComponent<Props, {}> {

  componentDidMount(): void {
    this.props.loadContainers();
  }

  private container = (container: IContainer): JSX.Element =>
    <ContainerCard key={container.id} container={container}/>;

  private predicate = (container: IContainer, search: string): boolean =>
    container.id.toString().toLowerCase().includes(search)
    || container.image.toLowerCase().includes(search)
    || container.state.toLowerCase().includes(search)
    || container.status.toLowerCase().includes(search)
    || container.hostname.toLowerCase().includes(search);

  render = () =>
    <MainLayout>
      <AddButton tooltip={'Add container'} pathname={'/containers/new_container'}/>
      <div className={`${styles.container}`}>
        <CardList<IContainer>
          isLoading={this.props.isLoading}
          error={this.props.error}
          emptyMessage={"No containers to display"}
          list={this.props.containers}
          card={this.container}
          predicate={this.predicate}/>
      </div>
    </MainLayout>

}

const mapStateToProps = (state: ReduxState): StateToProps => (
  {
    isLoading: state.entities.containers.isLoading,
    error: state.entities.containers.error,
    containers: (state.entities.containers.data && Object.values(state.entities.containers.data)) || [],
  }
);

const mapDispatchToProps: DispatchToProps = {
  loadContainers,
};

export default connect(mapStateToProps, mapDispatchToProps)(Containers);
