import React, {createRef} from 'react';
import MainLayout from '../../views/mainLayout/MainLayout';
import AddButton from "../../components/form/AddButton";
import styles from './Rules.module.css'
import BaseComponent from "../../components/BaseComponent";
import M from "materialize-css";
import Collapsible from "../../components/collapsible/Collapsible";
import RulesHostList from "./hosts/RulesHostList";
import RulesServiceList from "./services/RulesServiceList";
import Conditions from "./conditions/RuleConditionsList";
import RuleConditionsList from "./conditions/RuleConditionsList";

export default class Rules extends BaseComponent<{}, {}> {

  private hostRulesCollapsible = createRef<HTMLUListElement>();
  private servicesRulesCollapsible = createRef<HTMLUListElement>();
  private conditionsCollapsible = createRef<HTMLUListElement>();

  componentDidMount(): void {
    this.init();
  }

  private init = () => {
    M.Collapsible.init(this.hostRulesCollapsible.current as Element);
    M.Collapsible.init(this.servicesRulesCollapsible.current as Element);
    M.Collapsible.init(this.conditionsCollapsible.current as Element);
  };

  render = () =>
    <MainLayout>
      <AddButton tooltip={'Add rule or condition'} dropdown={{
        id: 'addRuleOrCondition',
        title: 'Select option',
        data: [
          {text: 'Host rule', pathname: '/rules/hosts/new_host_rule?new=true'},
          {text: 'Service rule', pathname: '/rules/services/new_service_rule?new=true'},
          {text: 'Rule condition', pathname: '/rules/conditions/new_condition?new=true'},
        ],
      }}/>
      <div className={`${styles.collapsibleContainer}`}>
        <Collapsible id={"rulesHostCollapsible"}
                     title={'Hosts'}
                     active
                     headerClassname={styles.collapsibleSubtitle}
                     bodyClassname={styles.collapsibleCardList}>
          <RulesHostList/>
        </Collapsible>
      </div>
      <div className={`${styles.collapsibleContainer}`}>
        <Collapsible id={"rulesServiceCollapsible"}
                     title={'Services'}
                     active
                     headerClassname={styles.collapsibleSubtitle}
                     bodyClassname={styles.collapsibleCardList}>
          <RulesServiceList/>
        </Collapsible>
      </div>
      <div className={`${styles.collapsibleContainer}`}>
        <Collapsible id={"rulesConditionCollapsible"}
                     title={'Conditions'}
                     active
                     headerClassname={styles.collapsibleSubtitle}
                     bodyClassname={styles.collapsibleCardList}>
          <RuleConditionsList/>
        </Collapsible>
      </div>
    </MainLayout>

}
