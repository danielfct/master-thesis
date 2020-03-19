import {ICondition} from "../Rule";
import {IHostRule} from "./HostRule";
import BaseComponent from "../../../components/BaseComponent";
import ListItem from "../../../components/list/ListItem";
import styles from "../../../components/list/ListItem.module.css";
import React from "react";
import {IFields, IValues, required, requiredAndNumberAndMin} from "../../../components/form/Form";
import Field, {getTypeFromValue} from "../../../components/form/Field";
import ControlledList from "../../../components/list/ControlledList";
import {ReduxState} from "../../../reducers";
import {bindActionCreators} from "redux";
import {addRuleHostCondition, loadRuleHostConditions, removeRuleHostConditions} from "../../../actions";
import {connect} from "react-redux";

const emptyCondition = (): Partial<ICondition> => ({
  name: '',
  /*valueMode: { id: 0, name: '' },
  field: { id: 0, name: '' },
  operator: { id: 0, name: '', symbol: '' },*/
  value: 0,
});

interface StateToProps {
  isLoading: boolean;
  error?: string | null;
  conditions: string[];
}

interface DispatchToProps {
  loadRuleHostConditions: (ruleName: string) => void;
  addRuleHostCondition: (ruleName: string, condition: string) => void;
  removeRuleHostConditions: (ruleName: string, conditions: string[]) => void;
}

interface HostRuleConditionListProps {
  rule: IHostRule | Partial<IHostRule>;
  newConditions: ICondition[];
  onAddRuleCondition: (condition: ICondition) => void;
  onRemoveRuleConditions: (condition: string[]) => void;
}

type Props = StateToProps & DispatchToProps & HostRuleConditionListProps;

class HostRuleConditionList extends BaseComponent<Props, {}> {

  componentDidMount(): void {
    const {name} = this.props.rule;
    if (name) {
      this.props.loadRuleHostConditions(name);
    }
  }

  private condition = (index: number, condition: string, separate: boolean, checked: boolean,
                       handleCheckbox: (event: React.ChangeEvent<HTMLInputElement>) => void): JSX.Element =>
    <ListItem key={index} separate={separate}>
      <div className={`${styles.itemContent}`}>
        <label>
          <input id={condition}
                 type="checkbox"
                 onChange={handleCheckbox}
                 checked={checked}/>
          <span id={'checkbox'}>{condition}</span>
        </label>
      </div>
    </ListItem>;

  private onAdd = (condition: IValues): void => {
    this.props.onAddRuleCondition(condition as ICondition);
  };

  private onRemove = (conditions: string[]) =>
    this.props.onRemoveRuleConditions(conditions);

  private onDeleteSuccess = (conditions: string[]): void => {
    const {name} = this.props.rule;
    if (name) {
      this.props.removeRuleHostConditions(name, conditions);
    }
  };

  private onDeleteFailure = (reason: string): void =>
    super.toast(`Unable to delete condition`, 10000, reason, true);

  private getFields = (): IFields =>
    Object.entries(emptyCondition()).map(([key, value]) => {
      return {
        [key]: {
          id: [key],
          label: key,
          validation: getTypeFromValue(value) === 'number'
            ? { rule: requiredAndNumberAndMin, args: 0 }
            : { rule: required }
        }
      };
    }).reduce((fields, field) => {
      for (let key in field) {
        fields[key] = field[key];
      }
      return fields;
    }, {});

  //TODO
  private addModal = () =>
    <div>
      <Field key='name' id={['name']} label='name'/>
      <Field key='value' id={['value']} label='value'/>
      {/* <Field key='description' id={['description']} label='description' type='multilinetextbox'/>
      <div className={'col s6 inline-field'}>
        <Field key='startDate' id={['startDate']} label='startDate' type='datepicker'/>
      </div>
      <div className={'col s6 inline-field'}>
        <Field key='startTime' id={['startTime']} label='startTime' type='timepicker' icon={false}/>
      </div>
      <div className={'col s6 inline-field'}>
        <Field key='endDate' id={['endDate']} label='endDate' type='datepicker'/>
      </div>
      <div className={'col s6 inline-field'}>
        <Field key='endTime' id={['endTime']} label='endTime' type='timepicker' icon={false}/>
      </div>
      <Field key='minReplicas' id={['minReplicas']} label='minReplicas'/>*/}
    </div>;

  render() {
    return <ControlledList isLoading={this.props.isLoading}
                           error={this.props.error}
                           emptyMessage={`Conditions list is empty`}
                           data={this.props.conditions}
                           formModal={{
                             id: 'ruleHostCondition',
                             dataKey: 'name',
                             title: 'Add condition',
                             fields: this.getFields(),
                             values: emptyCondition(),
                             content: this.addModal,
                             position: '15%'
                           }}
                           show={this.condition}
                           onAddInput={this.onAdd}
                           onRemove={this.onRemove}
                           onDelete={{
                             url: `rules/hosts/${this.props.rule.name}/conditions`,
                             successCallback: this.onDeleteSuccess,
                             failureCallback: this.onDeleteFailure
                           }}/>;
  }

}

function mapStateToProps(state: ReduxState, ownProps: HostRuleConditionListProps): StateToProps {
  const ruleName = ownProps.rule.name;
  const rule = ruleName && state.entities.rules.hosts.data[ruleName];
  const conditions = rule && rule.conditions;
  return {
    isLoading: state.entities.rules.hosts.isLoadingConditions,
    error: state.entities.rules.services.loadConditionsError,
    conditions: conditions || [],
  }
}

const mapDispatchToProps = (dispatch: any): DispatchToProps =>
  bindActionCreators({
    loadRuleHostConditions,
    addRuleHostCondition,
    removeRuleHostConditions,
  }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(HostRuleConditionList);