import React, {createRef} from 'react';
import MainLayout from '../../views/mainLayout/MainLayout';
import AddButton from "../../components/form/AddButton";
import styles from './Hosts.module.css'
import BaseComponent from "../../components/BaseComponent";
import M from "materialize-css";
import CloudHostsList from "./cloud/CloudHostsList";
import EdgeHostsList from "./edge/EdgeHostsList";
import Collapsible from "../../components/collapsible/Collapsible";

export default class Hosts extends BaseComponent<{}, {}> {

  private cloudHostsCollapsible = createRef<HTMLUListElement>();
  private edgeHostsCollapsible = createRef<HTMLUListElement>();

  public componentDidMount(): void {
    this.init();
  }

  private init = () => {
    M.Collapsible.init(this.cloudHostsCollapsible.current as Element);
    M.Collapsible.init(this.edgeHostsCollapsible.current as Element);
  };

  public render() {
    return (
      <MainLayout>
        <AddButton tooltip={{text: 'Add host', position: 'left'}}
                   dropdown={{
                     id: 'hosts',
                     title: 'Host type',
                     data: [
                       {text: 'Cloud', pathname: '/hosts/cloud/new_instance?new=true'},
                       {text: 'Edge', pathname: '/hosts/edge/add_machine?new=true'}
                     ],
                   }}/>
        <div className={`${styles.container}`}>
          <Collapsible id={"cloudHostsCollapsible"}
                       title={'Cloud'}
                       active
                       headerClassname={styles.collapsibleSubtitle}
                       bodyClassname={styles.collapsibleCardList}>
            <CloudHostsList/>
          </Collapsible>
        </div>
        <div className={`${styles.container}`}>
          <Collapsible id={"edgeHostsCollapsible"}
                       title={'Edge'}
                       active
                       headerClassname={styles.collapsibleSubtitle}
                       bodyClassname={styles.collapsibleCardList}>
            <EdgeHostsList/>
          </Collapsible>
        </div>
      </MainLayout>
    );
  }


}
