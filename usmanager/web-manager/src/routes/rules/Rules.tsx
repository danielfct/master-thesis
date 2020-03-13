import BaseComponent from "../../components/BaseComponent";
import {IRule} from "./Rule";
import MainLayout from "../../views/mainLayout/MainLayout";
import React from "react";
import AddButton from "../../components/form/AddButton";
import styles from "./Rules.module.css";
import CardList from "../../components/list/CardList";
import {ReduxState} from "../../reducers";
import {connect} from "react-redux";
import RuleCard from "./Rulecard";
import {loadRules} from "../../actions";

interface StateToProps {
  isLoading: boolean
  error?: string | null;
  rules: IRule[];
}

interface DispatchToProps {
  loadRules: (name?: string) => any;
}

type Props = StateToProps & DispatchToProps;

class Rules extends BaseComponent<Props, {}> {

  componentDidMount(): void {
    this.props.loadRules();
  }

  private rule = (rule: IRule): JSX.Element =>
    <RuleCard key={rule.id} rule={rule}/>;

  private predicate = (rule: IRule, search: string): boolean =>
    rule.name.toLowerCase().includes(search);

  render() {
    return (
      <MainLayout>
        <AddButton tooltip={'Add rule'} pathname={'/rules/new_rule'}/>
        <div className={`${styles.container}`}>
          <CardList<IRule>
            isLoading={this.props.isLoading}
            error={this.props.error}
            emptyMessage={"No rules to display"}
            list={this.props.rules}
            card={this.rule}
            predicate={this.predicate}/>
        </div>
      </MainLayout>
    );
  }

}

const mapStateToProps = (state: ReduxState): StateToProps => (
  {
    isLoading: state.entities.rules.isLoading,
    error: state.entities.rules.error,
    rules: (state.entities.rules.data && Object.values(state.entities.rules.data)) || [],
  }
);

const mapDispatchToProps: DispatchToProps = {
  loadRules,
};

export default connect(mapStateToProps, mapDispatchToProps)(Rules);