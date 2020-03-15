import React from 'react';
import {connect} from "react-redux";
import {IAppRule} from "./AppRule";
import BaseComponent from "../../../components/BaseComponent";
import AppRuleCard from "./AppRuleCard";
import {ReduxState} from "../../../reducers";
import CardList from "../../../components/list/CardList";
import {loadRulesApp} from "../../../actions";

interface StateToProps {
  isLoading: boolean
  error?: string | null;
  appRules: IAppRule[];
}

interface DispatchToProps {
  loadRulesApp: (name?: string) => any;
}

type Props = StateToProps & DispatchToProps;

class AppRulesList extends BaseComponent<Props, {}> {

  componentDidMount(): void {
    this.props.loadRulesApp();
  }

  private rule = (rule: IAppRule): JSX.Element =>
    <AppRuleCard key={rule.id} rule={rule}/>;

  private predicate = (rule: IAppRule, search: string): boolean =>
    rule.name.toLowerCase().includes(search);

  render = () =>
    <CardList<IAppRule>
      isLoading={this.props.isLoading}
      error={this.props.error}
      emptyMessage={"No app rules to display"}
      list={this.props.appRules}
      card={this.rule}
      predicate={this.predicate}/>

}

const mapStateToProps = (state: ReduxState): StateToProps => (
  {
    isLoading: state.entities.rules.apps.isLoading,
    error: state.entities.rules.apps.error,
    appRules: (state.entities.rules.apps.data && Object.values(state.entities.rules.apps.data)) || [],
  }
);

const mapDispatchToProps: DispatchToProps = {
  loadRulesApp,
};

export default connect(mapStateToProps, mapDispatchToProps)(AppRulesList);
