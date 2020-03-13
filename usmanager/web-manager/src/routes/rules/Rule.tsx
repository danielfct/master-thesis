import IData from "../../components/IData";
import {RouteComponentProps} from "react-router";
import BaseComponent from "../../components/BaseComponent";
import Form, {IFields, required} from "../../components/form/Form";
import LoadingSpinner from "../../components/list/LoadingSpinner";
import Error from "../../components/errors/Error";
import Field from "../../components/form/Field";
import Tabs, {Tab} from "../../components/tabs/Tabs";
import MainLayout from "../../views/mainLayout/MainLayout";
import {ReduxState} from "../../reducers";
import {loadRegions, loadRules} from "../../actions";
import {connect} from "react-redux";
import React from "react";
import {IRegion} from "../region/Region";

export interface IRule extends IData {
  name: string;
  priority: number;
  decision: IDecision;
}

interface IDecision extends IData {
  name: string;
  componentType: IComponentType;
}

interface IComponentType extends IData {
  name: string;
}

export interface ICondition extends IData {
  valueMode: IValueMode;
  field: IField;
  operator: IOperator;
  value: number;
}

interface IValueMode extends IData {
  name: string;
}

interface IField extends IData {
  name: string;
}

interface IOperator extends IData {
  name: string;
  symbol: string;
}


const emptyRule = () => ({
  name: '',
  priority: 0,
  decision: undefined,
});

const isNewRule = (name: string) =>
  name === 'new_rule';

interface StateToProps {
  isLoading: boolean;
  error?: string | null;
  rule: Partial<IRule>;
  formRule?: Partial<IRule>,
}

interface DispatchToProps {
  loadRules: (name: string) => any;
}

interface MatchParams {
  name: string;
}

type Props = StateToProps & DispatchToProps & RouteComponentProps<MatchParams>;

class Region extends BaseComponent<Props, {}> {

  componentDidMount(): void {
    const ruleName = this.props.match.params.name;
    if (ruleName && !isNewRule(ruleName)) {
      this.props.loadRules(ruleName);
    }
  };

  private onPostSuccess = (reply: any, ruleName: string): void => {
    super.toast(`Rule <b>${ruleName}</b> saved`);
  };

  private onPostFailure = (reason: string, ruleName: string): void =>
    super.toast(`Unable to save ${ruleName}`, 10000, reason, true);

  private onPutSuccess = (ruleName: string): void => {
    super.toast(`Changes to rule <b>${ruleName}</b> are now saved`);
  };

  private onPutFailure = (reason: string, ruleName: string): void =>
    super.toast(`Unable to update ${ruleName}`, 10000, reason, true);

  private onDeleteSuccess = (ruleName: string): void => {
    super.toast(`Rule <b>${ruleName}</b> successfully removed`);
    this.props.history.push(`/rules`)
  };

  private onDeleteFailure = (reason: string, ruleName: string): void =>
    super.toast(`Unable to delete ${ruleName}`, 10000, reason, true);

  private getFields = (rule: Partial<IRule>): IFields =>
    Object.entries(rule).map(([key, value]) => {
      return {
        [key]: {
          id: key,
          label: key,
          validation: { rule: required }
        }
      };
    }).reduce((fields, field) => {
      for (let key in field) {
        fields[key] = field[key];
      }
      return fields;
    }, {});

  private details = () => {
    const {isLoading, error, formRule, rule} = this.props;
    // @ts-ignore
    const ruleKey: (keyof IRule) = formRule && Object.keys(formRule)[0];
    return (
      <>
        {isLoading && <LoadingSpinner/>}
        {!isLoading && error && <Error message={error}/>}
        {!isLoading && !error && formRule && (
          <Form id={ruleKey}
                fields={this.getFields(formRule)}
                values={rule}
                isNew={isNewRule(this.props.match.params.name)}
                post={{url: 'rules', successCallback: this.onPostSuccess, failureCallback: this.onPostFailure}}
                put={{url: `rules/${rule[ruleKey]}`, successCallback: this.onPutSuccess, failureCallback: this.onPutFailure}}
                delete={{url: `regions/${rule[ruleKey]}`, successCallback: this.onDeleteSuccess, failureCallback: this.onDeleteFailure}}>
            {Object.keys(formRule).map((key, index) =>
              key === 'decision'
                ? <Field key={index}
                         id={key}
                         label={key}
                         type="dropdown"
                         dropdown={{defaultValue: "Decision", values: ["TODO: load decisions"]}}/>
                : <Field key={index}
                         id={key}
                         label={key}/>
            )}
          </Form>
        )}
      </>
    )
  };

  private tabs: Tab[] = [
    {
      title: 'Rule',
      id: 'rule',
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
  const isLoading = state.entities.rules.isLoading;
  const error = state.entities.rules.error;
  const name = props.match.params.name;
  const rule = isNewRule(name) ? emptyRule() : state.entities.rules.data[name];
  let formRule;
  if (rule) {
    formRule = { ...rule };
    delete formRule["id"];
  }
  return  {
    isLoading,
    error,
    rule,
    formRule,
  }
}

const mapDispatchToProps: DispatchToProps = {
  loadRules,
};

export default connect(mapStateToProps, mapDispatchToProps)(Region);

