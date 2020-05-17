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

  componentDidMount(): void {
    this.init();
  }

  private init = () => {
    M.Collapsible.init(this.cloudHostsCollapsible.current as Element);
    M.Collapsible.init(this.edgeHostsCollapsible.current as Element);
  };

  render = () =>
    <MainLayout>
      <AddButton tooltip={'Add host'} dropdown={{
        id: 'addHosts',
        title: 'Host type',
        empty: 'No more apps to add',
        data: [{text: 'Cloud', pathname: '/hosts/cloud/new_instance'}, {text: 'Edge', pathname: '/hosts/edge/new_host'}],
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

}
