import React from "react";
import {IField, IOperator, IValueMode} from "../Rule";
import IDatabaseData from "../../../components/IDatabaseData";
import {RouteComponentProps} from "react-router";
import BaseComponent from "../../../components/BaseComponent";
import Form, {IFields, requiredAndNumberAndMin, requiredAndTrimmed} from "../../../components/form/Form";
import Field, {getTypeFromValue} from "../../../components/form/Field";
import ListLoadingSpinner from "../../../components/list/ListLoadingSpinner";
import Error from "../../../components/errors/Error";
import Tabs, {Tab} from "../../../components/tabs/Tabs";
import MainLayout from "../../../views/mainLayout/MainLayout";
import {ReduxState} from "../../../reducers";
import {loadConditions, loadFields, loadOperators, loadValueModes} from "../../../actions";
import {connect} from "react-redux";
import {IReply} from "../../../utils/api";
import {isNew} from "../../../utils/router";

export interface ICondition extends IDatabaseData {
  name: string;
  valueMode: IValueMode;
  field: IField;
  operator: IOperator;
  value: number;
}

const buildNewCondition = () => ({
  name: '',
  valueMode: undefined,
  field: undefined,
  operator: undefined,
  value: 0
});

interface StateToProps {
  isLoading: boolean;
  error?: string | null;
  condition: Partial<ICondition>;
  formCondition: Partial<ICondition>,
  valueModes: IValueMode[];
  fields: IField[];
  operators: IOperator[];
}

interface DispatchToProps {
  loadConditions: (name: string) => any;
  loadValueModes: () => void;
  loadFields: () => void;
  loadOperators: () => void;
}

interface MatchParams {
  name: string;
}

type Props = StateToProps & DispatchToProps & RouteComponentProps<MatchParams>;

type State = {
  conditionName?: string;
}

class RuleCondition extends BaseComponent<Props, State> {

  componentDidMount(): void {
    if (!isNew(this.props.location.search)) {
      const conditionName = this.props.match.params.name;
      this.props.loadConditions(conditionName);
    }
    this.props.loadValueModes();
    this.props.loadFields();
    this.props.loadOperators();
  };

  private onPostSuccess = (reply: IReply<ICondition>): void => {
    super.toast(`<span class="green-text">Condition ${reply.data.name} is now created</span>`);
  };

  private onPostFailure = (reason: string, conditionName: string): void =>
    super.toast(`Unable to save ${conditionName}`, 10000, reason, true);

  private onPutSuccess = (conditionName: string): void => {
    super.toast(`<span class="green-text">Changes to condition ${conditionName} have been saved</span>`);
    this.setState({conditionName: conditionName});
  };

  private onPutFailure = (reason: string, conditionName: string): void =>
    super.toast(`Unable to update ${conditionName}`, 10000, reason, true);

  private onDeleteSuccess = (conditionName: string): void => {
    super.toast(`<span class="green-text">Condition ${conditionName} successfully removed</span>`);
    this.props.history.push(`/rules/conditions`)
  };

  private onDeleteFailure = (reason: string, conditionName: string): void =>
    super.toast(`Unable to remove ${conditionName}`, 10000, reason, true);

  private getFields = (): IFields =>
    Object.entries(buildNewCondition()/*this.getCondition()TODO*/).map(([key, value]) => {
      return {
        [key]: {
          id: key,
          label: key,
          validation: getTypeFromValue(value) === 'number'
            ? { rule: requiredAndNumberAndMin, args: 0 }
            : { rule: requiredAndTrimmed }
        }
      };
    }).reduce((fields, field) => {
      for (let key in field) {
        fields[key] = field[key];
      }
      return fields;
    }, {});

  private fieldOption = (field: IField): string =>
    field.name;

  private operatorOption = (operator: IOperator): string =>
    operator.symbol;

  private valueModeOption = (valueMode: IValueMode): string =>
    valueMode.name;

  private condition = () => {
    const {isLoading, error, condition, formCondition} = this.props;
    // @ts-ignore
    const conditionKey: (keyof ICondition) = formCondition && Object.keys(formCondition)[0];
    return (
      <>
        {isLoading && <ListLoadingSpinner/>}
        {!isLoading && error && <Error message={error}/>}
        {!isLoading && !error && formCondition && (
          <Form id={conditionKey}
                fields={this.getFields()}
                values={condition}
                isNew={isNew(this.props.location.search)}
                post={{url: 'rules/conditions', successCallback: this.onPostSuccess, failureCallback: this.onPostFailure}}
                put={{url: `rules/conditions/${this.state?.conditionName || condition[conditionKey]}`, successCallback: this.onPutSuccess, failureCallback: this.onPutFailure}}
                delete={{url: `rules/conditions/${this.state?.conditionName || condition[conditionKey]}`, successCallback: this.onDeleteSuccess, failureCallback: this.onDeleteFailure}}>
            <Field key='name' id={'name'} label='name'/>
            <Field<IField> key='fields'
                           id='field'
                           label='field'
                           type='dropdown'
                           dropdown={{
                             defaultValue: "Select field",
                             values: this.props.fields,
                             optionToString: this.fieldOption}}/>
            <Field<IOperator> key='operators'
                              id='operator'
                              label='operator'
                              type='dropdown'
                              dropdown={{
                                defaultValue: "Select operator",
                                values: this.props.operators,
                                optionToString: this.operatorOption}}/>
            <Field<IValueMode> key='valueModes'
                               id='valueMode'
                               label='valueMode'
                               type='dropdown'
                               dropdown={{
                                 defaultValue: 'Select value mode',
                                 values: this.props.valueModes,
                                 optionToString: this.valueModeOption}}/>
            <Field key='value' id='value' label='value'/>
          </Form>
        )}
      </>
    )
  };

  private tabs: Tab[] = [
    {
      title: 'Condition',
      id: 'condition',
      content: () => this.condition()
    },
  ];

  render() {
    return (
      <MainLayout>
        <div className="container">
          <Tabs {...this.props} tabs={this.tabs}/>
        </div>
      </MainLayout>
    );
  }

}

function mapStateToProps(state: ReduxState, props: Props): StateToProps {
  const isLoading = state.entities.rules.conditions.isLoadingConditions;
  const error = state.entities.rules.conditions.loadConditionsError;
  const name = props.match.params.name;
  const condition = isNew(props.location.search) ? buildNewCondition() : state.entities.rules.conditions.data[name];
  let formCondition;
  formCondition = { ...condition };
  delete formCondition['id'];
  return  {
    isLoading,
    error,
    condition,
    formCondition,
    valueModes: (state.entities.valueModes.data && Object.values(state.entities.valueModes.data)) || [],
    fields: (state.entities.fields.data && Object.values(state.entities.fields.data)) || [],
    operators: (state.entities.operators.data && Object.values(state.entities.operators.data)) || [],
  }
}

const mapDispatchToProps: DispatchToProps = {
  loadConditions,
  loadValueModes,
  loadFields,
  loadOperators,
};

export default connect(mapStateToProps, mapDispatchToProps)(RuleCondition);