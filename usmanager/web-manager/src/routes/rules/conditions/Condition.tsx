import React from "react";
import {IField, IOperator, IValueMode} from "../Rule";
import IData from "../../../components/IData";
import {RouteComponentProps} from "react-router";
import BaseComponent from "../../../components/BaseComponent";
import Form, {IFields, required, requiredAndNumberAndMin} from "../../../components/form/Form";
import Field, {getTypeFromValue} from "../../../components/form/Field";
import LoadingSpinner from "../../../components/list/LoadingSpinner";
import Error from "../../../components/errors/Error";
import Tabs, {Tab} from "../../../components/tabs/Tabs";
import MainLayout from "../../../views/mainLayout/MainLayout";
import {ReduxState} from "../../../reducers";
import {loadConditions, loadFields, loadOperators, loadValueModes} from "../../../actions";
import {connect} from "react-redux";

export interface ICondition extends IData {
  name: string;
  valueMode: IValueMode;
  field: IField;
  operator: IOperator;
  value: number;
}

const emptyCondition = () => ({
  name: '',
  valueMode: undefined,
  field: undefined,
  operator: undefined,
  value: 0
});

const isNewCondition = (name: string) =>
  name === 'new_condition';

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

class Condition extends BaseComponent<Props, State> {

  componentDidMount(): void {
    const conditionName = this.props.match.params.name;
    if (conditionName && !isNewCondition(conditionName)) {
      this.props.loadConditions(conditionName);
    }
    this.props.loadValueModes();
    this.props.loadFields();
    this.props.loadOperators();
  };

  private onPostSuccess = (reply: any, conditionName: string): void => {
    super.toast(`Condition <b>${conditionName}</b> is now created`);
  };

  private onPostFailure = (reason: string, conditionName: string): void =>
    super.toast(`Unable to save ${conditionName}`, 10000, reason, true);

  private onPutSuccess = (conditionName: string): void => {
    super.toast(`Changes to condition <b>${conditionName}</b> are now saved`);
    this.setState({conditionName: conditionName});
  };

  private onPutFailure = (reason: string, conditionName: string): void =>
    super.toast(`Unable to update ${conditionName}`, 10000, reason, true);

  private onDeleteSuccess = (conditionName: string): void => {
    super.toast(`Condition <b>${conditionName}</b> successfully removed`);
    this.props.history.push(`/rules/conditions`)
  };

  private onDeleteFailure = (reason: string, conditionName: string): void =>
    super.toast(`Unable to remove ${conditionName}`, 10000, reason, true);

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

  private fieldOption = (field: IField): string =>
    field.name;

  private operatorOption = (operator: IOperator): string =>
    operator.symbol;

  private valueModeOption = (valueMode: IValueMode): string =>
    valueMode.name;

  private details = () => {
    const {isLoading, error, condition, formCondition} = this.props;
    // @ts-ignore
    const conditionKey: (keyof ICondition) = formCondition && Object.keys(formCondition)[0];
    const isNew = isNewCondition(this.props.match.params.name);
    return (
      <>
        {isLoading && <LoadingSpinner/>}
        {!isLoading && error && <Error message={error}/>}
        {!isLoading && !error && formCondition && (
          <Form id={conditionKey}
                fields={this.getFields()}
                values={condition}
                isNew={isNew}
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
      content: () => this.details()
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
  const condition = isNewCondition(name) ? emptyCondition() : state.entities.rules.conditions.data[name];
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

export default connect(mapStateToProps, mapDispatchToProps)(Condition);