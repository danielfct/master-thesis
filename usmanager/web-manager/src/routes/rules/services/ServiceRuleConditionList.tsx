import {IServiceRule} from "./ServiceRule";
import BaseComponent from "../../../components/BaseComponent";
import ListItem from "../../../components/list/ListItem";
import styles from "../../../components/list/ListItem.module.css";
import React from "react";
import {IFields, IValues, required, requiredAndNumberAndMin} from "../../../components/form/Form";
import Field, {getTypeFromValue} from "../../../components/form/Field";
import ControlledList from "../../../components/list/ControlledList";
import {ReduxState} from "../../../reducers";
import {bindActionCreators} from "redux";
import {
  addRuleServiceCondition,
  loadFields, loadOperators,
  loadRuleServiceConditions,
  loadValueModes,
  removeRuleServiceConditions
} from "../../../actions";
import {connect} from "react-redux";
import InputDialog from "../../../components/dialogs/InputDialog";
import {capitalize} from "../../../utils/text";
import {Redirect} from "react-router";
import {ICondition} from "../conditions/Condition";

interface StateToProps {
  redirect: boolean;
  isLoading: boolean;
  error?: string | null;
  serviceConditions: string[];
  conditions: { [key: string]: ICondition };
}

interface DispatchToProps {
  loadConditions: () => void;
  loadRuleServiceConditions: (ruleName: string) => void;
  removeRuleServiceConditions: (ruleName: string, conditions: string[]) => void;
  addRuleServiceCondition: (ruleName: string, condition: string) => void;
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
      <div className={`${styles.link} modal-trigger waves-effect`}
           data-target={`serviceRule${condition}`}>
        <i className={`${styles.linkIcon} material-icons right`}>link</i>
      </div>
      {this.inputDialog(condition)}
    </ListItem>;

  private inputDialog = (condition: string): JSX.Element => {
    return <InputDialog id={`serviceRule${condition}`}
                        title={capitalize(condition)}
                        fields={this.getModalFields()}
                        values={this.getModalValues(condition)}
                        confirmCallback={() => {}}>
      <Field key='name' id={'name'} label='name'/>
      <Field key='valueMode' id={'valueMode'} label='valueMode'/>
      <Field key='field' id={'field'} label='field'/>
      <Field key='operator' id={'operator'} label='operator'/>
      <Field key='value' id={'value'} label='value'/>
    </InputDialog>;
  };

  private getModalFields = (): IFields => (
    {
      name: {
        id: 'name',
        label: 'name',
        validation: { rule: required }
      },
      valueMode: {
        id: 'valueMode',
        label: 'valueMode',
        validation: { rule: required }
      },
      field: {
        id: 'field',
        label: 'field',
        validation: { rule: required }
      },
      operator: {
        id: 'operator',
        label: 'operator',
        validation: { rule: required }
      },
      value: {
        id: 'value',
        label: 'value',
        validation: { rule: required }
      }
    }
  );

  private getModalValues = (condition: string): IValues => (
    {
      name: condition,
      valueMode: '',
      field: '',
      operator: '',
      value: 0,
    }
  );

  private onAdd = (conditionValues: IValues): void => {
    const valueMode = this.props.valueModes.find(valueMode => valueMode.name == conditionValues['valueMode']);
    if (!valueMode) {
      return super.toast('Unable to add condition', 5000, `failed to bind valueMode ${conditionValues['valueMode']}`, true)
    }
    const field = this.props.fields.find(field => field.name == conditionValues['field']);
    if (!field) {
      return super.toast('Unable to add condition', 5000, `failed to bind field ${conditionValues['field']}`, true)
    }
    const operator = this.props.operators.find(operator => operator.symbol == conditionValues['operator']);
    if (!operator) {
      return super.toast('Unable to add condition', 5000, `failed to bind operator ${conditionValues['operator']}`, true)
    }
    const condition: ICondition = {
      id: 0,
      name: conditionValues['name'],
      valueMode,
      field,
      operator,
      value: conditionValues['value'],
    };
    this.props.onAddRuleCondition(condition);
  };

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

  private getFields = (): IFields =>
    Object.entries(emptyCondition()).map(([key, value]) => {
      return {
        [key]: {
          id: key,
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

  private getSelectableFields = () =>
    this.props.fields.map(valueMode => valueMode.name);

  private fieldOption = (field: string): string =>
    field;

  private getSelectableOperators = () =>
    this.props.operators.map(operator => operator.symbol);

  private operatorOption = (operator: string): string =>
    operator;

  private getSelectableValueModes = () =>
    this.props.valueModes.map(valueMode => valueMode.name);

  private valueModeOption = (valueMode: string): string =>
    valueMode;

  //TODO
  private addModal = () =>
    <div>
      <Field key='name' id={'name'} label='name'/>
      <Field key={'fields'}
             id={'field'}
             label={'field'}
             type="dropdown"
             dropdown={{
               defaultValue: "Select field",
               values: this.getSelectableFields(),
               optionToString: this.fieldOption}}/>
      <Field key={'operators'}
             id={'operator'}
             label={'operator'}
             type="dropdown"
             dropdown={{
               defaultValue: "Select operator",
               values: this.getSelectableOperators(),
               optionToString: this.operatorOption}}/>
      <Field key={'valueModes'}
             id={'valueMode'}
             label={'valueMode'}
             type="dropdown"
             dropdown={{
               defaultValue: "Select value mode",
               values: this.getSelectableValueModes(),
               optionToString: this.valueModeOption}}/>
      <Field key='value' id={'value'} label='value'/>
    </div>;

  render() {
    if (this.props.redirect) {
      return <Redirect to='/rules'/>;
    }
    console.log(this.props.newConditions)
    return <ControlledList isLoading={this.props.isLoading}
                           error={this.props.error}
                           emptyMessage={`Conditions list is empty`}
                           data={this.props.conditions}
                           formModal={{
                             id: 'ruleServiceCondition',
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
                             url: `rules/services/${this.props.rule.name}/conditions`,
                             successCallback: this.onDeleteSuccess,
                             failureCallback: this.onDeleteFailure
                           }}/>;
  }

}

function mapStateToProps(state: ReduxState, ownProps: ServiceRuleConditionListProps): StateToProps {
  const ruleName = ownProps.rule && ownProps.rule.name;
  const rule = ruleName && state.entities.rules.services.data[ruleName];
  const conditions = rule && rule.conditions;
  return {
    redirect: !ownProps.rule,
    isLoading: state.entities.rules.services.isLoadingConditions,
    error: state.entities.rules.services.loadConditionsError,
    conditions: conditions || [],
    valueModes: (state.entities.valueModes.data && Object.values(state.entities.valueModes.data)) || [],
    fields: (state.entities.fields.data && Object.values(state.entities.fields.data)) || [],
    operators: (state.entities.operators.data && Object.values(state.entities.operators.data)) || [],
  }
}

const mapDispatchToProps = (dispatch: any): DispatchToProps =>
  bindActionCreators({
    loadRuleServiceConditions,
    addRuleServiceCondition,
    removeRuleServiceConditions,
    loadValueModes,
    loadFields,
    loadOperators,
  }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ServiceRuleConditionList);