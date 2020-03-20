import React, {createRef} from 'react';
import MainLayout from '../../views/mainLayout/MainLayout';
import AddButton from "../../components/form/AddButton";
import styles from './Rules.module.css'
import BaseComponent from "../../components/BaseComponent";
import M from "materialize-css";
import Collapsible from "../../components/collapsible/Collapsible";
import HostRulesList from "./hosts/HostRulesList";
import ServiceRulesList from "./services/ServiceRulesList";

export default class Rules extends BaseComponent<{}, {}> {

  private appRulesCollapsible = createRef<HTMLUListElement>();
  private hostRulesCollapsible = createRef<HTMLUListElement>();
  private servicesRulesCollapsible = createRef<HTMLUListElement>();

  componentDidMount(): void {
    this.init();
  }

  private init = () => {
    M.Collapsible.init(this.appRulesCollapsible.current as Element);
    M.Collapsible.init(this.hostRulesCollapsible.current as Element);
    M.Collapsible.init(this.servicesRulesCollapsible.current as Element);
  };

  render = () =>
    <MainLayout>
      <AddButton tooltip={'Add rule'} dropdown={{
        id: 'addRules',
        title: 'Rule type',
        empty: 'No more rules to add',
        data: [
          {text: 'App', pathname: '/rules/apps/new_app_rule'},
          {text: 'Host', pathname: '/rules/hosts/new_host_rule'},
          {text: 'Service', pathname: '/rules/edges/new_edge_rule'},
        ],
      }}/>
      <div className={`${styles.collapsibleContainer}`}>
        <Collapsible id={"hostRulesCollapsible"}
                     title={'Hosts'}
                     active
                     headerClassname={styles.collapsibleSubtitle}
                     bodyClassname={styles.collapsibleCardList}>
          <HostRulesList/>
        </Collapsible>
      </div>
      <div className={`${styles.collapsibleContainer}`}>
        <Collapsible id={"servicesRulesCollapsible"}
                     title={'Services'}
                     active
                     headerClassname={styles.collapsibleSubtitle}
                     bodyClassname={styles.collapsibleCardList}>
          <ServiceRulesList/>
        </Collapsible>
      </div>
    </MainLayout>

}
