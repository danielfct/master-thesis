import {IServiceRule} from "./ServiceRule";
import BaseComponent from "../../../components/BaseComponent";
import ListItem from "../../../components/list/ListItem";
import styles from "../../../components/list/ListItem.module.css";
import React from "react";
import ControlledList from "../../../components/list/ControlledList";
import {ReduxState} from "../../../reducers";
import {bindActionCreators} from "redux";
import {
  loadConditions,
  loadRuleServiceConditions,
  removeRuleServiceConditions
} from "../../../actions";
import {connect} from "react-redux";
import {Redirect} from "react-router";
import {Link} from "react-router-dom";
import {ICondition} from "../conditions/Condition";

interface StateToProps {
  redirect: boolean;
  isLoading: boolean;
  error?: string | null;
  ruleConditions: string[];
  conditions: { [key: string]: ICondition };
}

interface DispatchToProps {
  loadConditions: () => void;
  loadRuleServiceConditions: (ruleName: string) => void;
  removeRuleServiceConditions: (ruleName: string, conditions: string[]) => void;
}

interface ServiceRuleConditionListProps {
  rule: IServiceRule | Partial<IServiceRule>;
  newConditions: string[];
  onAddRuleCondition: (condition: string) => void;
  onRemoveRuleConditions: (condition: string[]) => void;
}

type Props = StateToProps & DispatchToProps & ServiceRuleConditionListProps

class ServiceRuleConditionList extends BaseComponent<Props, {}> {

  componentDidMount(): void {
    if (this.props.rule) {
      const {name} = this.props.rule;
      if (name) {
        this.props.loadRuleServiceConditions(name);
      }
      this.props.loadConditions();
    }
  }

  private condition = (index: number, condition: string, separate: boolean, checked: boolean,
                       handleCheckbox: (event: React.ChangeEvent<HTMLInputElement>) => void): JSX.Element =>
    <ListItem key={index} separate={separate}>
      <div className={styles.linkedItemContent}>
        <label>
          <input id={condition}
                 type="checkbox"
                 onChange={handleCheckbox}
                 checked={checked}/>
          <span id={'checkbox'}>{condition}</span>
        </label>
      </div>
      <Link to={`/rules/conditions/${condition}`}
            className={`${styles.link} waves-effect`}>
        <i className={`${styles.linkIcon} material-icons right`}>link</i>
      </Link>
    </ListItem>;

  private onAdd = (condition: string): void =>
    this.props.onAddRuleCondition(condition);

  private onRemove = (conditions: string[]) =>
    this.props.onRemoveRuleConditions(conditions);

  private onDeleteSuccess = (conditions: string[]): void => {
    const {name} = this.props.rule;
    if (name) {
      this.props.removeRuleServiceConditions(name, conditions);
    }
  };

  private onDeleteFailure = (reason: string): void =>
    super.toast(`Unable to delete condition`, 10000, reason, true);

  private getSelectableConditionNames = () => {
    const {conditions, ruleConditions, newConditions} = this.props;
    return Object.keys(conditions)
                 .filter(condition => !ruleConditions.includes(condition) && !newConditions.includes(condition));
  };

  render() {
    if (this.props.redirect) {
      return <Redirect to='/rules'/>;
    }
    return <ControlledList isLoading={this.props.isLoading}
                           error={this.props.error}
                           emptyMessage={`Conditions list is empty`}
                           data={this.props.ruleConditions}
                           dataKey={[]} //TODO
                           dropdown={{
                             id: 'conditions',
                             title: 'Add condition',
                             empty: 'No more conditions to add',
                             data: this.getSelectableConditionNames()
                           }}
                           show={this.condition}
                           onAdd={this.onAdd}
                           onRemove={this.onRemove}
                           onDelete={{
                             url: `rules/services/${this.props.rule.name}/conditions`,
                             successCallback: this.onDeleteSuccess,
                             failureCallback: this.onDeleteFailure
                           }}/>;
  }

}

function mapStateToProps(state: ReduxState, ownProps: ServiceRuleConditionListProps): StateToProps {
  const ruleName = ownProps.rule && ownProps.rule.name;
  const rule = ruleName && state.entities.rules.services.data[ruleName];
  const ruleConditions = rule && rule.conditions;
  return {
    redirect: !ownProps.rule,
    isLoading: state.entities.rules.services.isLoadingConditions,
    error: state.entities.rules.services.loadConditionsError,
    ruleConditions: ruleConditions || [],
    conditions: state.entities.rules.conditions.data,
  }
}

const mapDispatchToProps = (dispatch: any): DispatchToProps =>
  bindActionCreators({
    loadRuleServiceConditions,
    removeRuleServiceConditions,
    loadConditions,
  }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ServiceRuleConditionList);