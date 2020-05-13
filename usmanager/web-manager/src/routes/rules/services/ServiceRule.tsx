/*
 * Copyright (c) 2020 usmanager
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import {IDecision, IRule} from "../Rule";
import {RouteComponentProps} from "react-router";
import BaseComponent from "../../../components/BaseComponent";
import Form, {IFields, required, requiredAndNumberAndMin} from "../../../components/form/Form";
import ListLoadingSpinner from "../../../components/list/ListLoadingSpinner";
import Error from "../../../components/errors/Error";
import Field from "../../../components/form/Field";
import Tabs from "../../../components/tabs/Tabs";
import MainLayout from "../../../views/mainLayout/MainLayout";
import {ReduxState} from "../../../reducers";
import {
  addRuleServiceConditions,
  addRuleServices,
  loadDecisions,
  loadRulesService,
} from "../../../actions";
import {connect} from "react-redux";
import React from "react";
import {postData} from "../../../utils/api";
import ServiceRuleConditionList from "./ServiceRuleConditionList";
import UnsavedChanged from "../../../components/form/UnsavedChanges";
import ServiceRuleServicesList from "./ServiceRuleServicesList";

export interface IServiceRule extends IRule {
  services?: string[]
}

const emptyServiceRule = () => ({
  name: '',
  priority: 0,
  generic: undefined,
  decision: undefined,
});

const isNewRule = (name: string) =>
  name === 'new_service_rule';

interface StateToProps {
  isLoading: boolean;
  error?: string | null;
  serviceRule: Partial<IServiceRule>;
  formServiceRule?: Partial<IServiceRule>,
  decisions: IDecision[],
}

interface DispatchToProps {
  loadRulesService: (name: string) => any;
  loadDecisions: () => any;
  addRuleServiceConditions: (ruleName: string, conditions: string[]) => void;
  addRuleServices: (ruleName: string, services: string[]) => void;
}

interface MatchParams {
  name: string;
}

type Props = StateToProps & DispatchToProps & RouteComponentProps<MatchParams>;

type State = {
  newConditions: string[],
  newServices: string[],
  ruleName?: string,
  isGeneric: boolean,
}

class ServiceRule extends BaseComponent<Props, State> {

  state: State = {
    newConditions: [],
    newServices: [],
    isGeneric: this.props.serviceRule?.generic || false,
  };

  componentDidMount(): void {
    this.props.loadDecisions();
    const ruleName = this.props.match.params.name;
    if (ruleName && !isNewRule(ruleName)) {
      this.props.loadRulesService(ruleName);
    }
  };

  private saveEntities = (rule: IServiceRule) => {
    this.saveRuleConditions(rule);
    this.saveRuleServices(rule);
  };

  private onPostSuccess = (reply: any, rule: IServiceRule): void => {
    super.toast(`Service rule <b>${rule.name}</b> saved`);
    this.setState({ruleName: rule.name});
    this.saveEntities(rule);
  };

  private onPostFailure = (reason: string, rule: IServiceRule): void =>
    super.toast(`Unable to update ${rule.name}`, 10000, reason, true);

  private onPutSuccess = (rule: IServiceRule): void => {
    super.toast(`Changes to service rule <b>${rule.name}</b> are now saved`);
    this.setState({ruleName: rule.name});
    this.saveEntities(rule);
  };

  private onPutFailure = (reason: string, rule: IServiceRule): void =>
    super.toast(`Unable to update ${rule.name}`, 10000, reason, true);

  private onDeleteSuccess = (rule: IServiceRule): void => {
    super.toast(`Service rule <b>${rule.name}</b> successfully removed`);
    this.props.history.push(`/rules`)
  };

  private onDeleteFailure = (reason: string, rule: IServiceRule): void =>
    super.toast(`Unable to delete ${rule}`, 10000, reason, true);

  private onAddRuleCondition = (condition: string): void => {
    this.setState({
      newConditions: this.state.newConditions.concat(condition)
    });
  };

  private onRemoveRuleConditions = (conditions: string[]): void => {
    this.setState({
      newConditions: this.state.newConditions.filter(condition => !conditions.includes(condition))
    });
  };

  private saveRuleConditions = (rule: IServiceRule): void => {
    const {newConditions} = this.state;
    if (newConditions.length) {
      postData(`rules/services/${rule.name}/conditions`, newConditions,
        () => this.onSaveConditionsSuccess(rule),
        (reason) => this.onSaveConditionsFailure(rule, reason));
    }
  };

  private onSaveConditionsSuccess = (rule: IServiceRule): void => {
    if (!isNewRule(this.props.match.params.name)) {
      this.props.addRuleServiceConditions(rule.name, this.state.newConditions);
    }
    this.setState({ newConditions: [] });
  };

  private onSaveConditionsFailure = (rule: IServiceRule, reason: string): void =>
    super.toast(`Unable to save conditions of rule ${rule.name}`, 10000, reason, true);

  private onAddRuleService = (service: string): void =>
    this.setState({
      newServices: this.state.newServices.concat(service)
    });

  private onRemoveRuleServices = (services: string[]): void => {
    this.setState({
      newServices: this.state.newServices.filter(service => !services.includes(service))
    });
  };

  private saveRuleServices = (rule: IServiceRule): void => {
    const {newServices} = this.state;
    if (newServices.length) {
      postData(`rules/services/${rule.name}/services`, newServices,
        () => this.onSaveServicesSuccess(rule),
        (reason) => this.onSaveServicesFailure(rule, reason));
    }
  };

  private onSaveServicesSuccess = (rule: IServiceRule): void => {
    if (!isNewRule(this.props.match.params.name)) {
      this.props.addRuleServices(rule.name, this.state.newServices)
    }
    this.setState({ newServices: [] });
  };

  private onSaveServicesFailure = (rule: IServiceRule, reason: string): void =>
    super.toast(`Unable to save services of rule ${rule.name}`, 10000, reason, true);

  private getFields = (serviceRule: Partial<IRule>): IFields =>
    Object.entries(serviceRule).map(([key, _]) => {
      return {
        [key]: {
          id: key,
          label: key,
          validation:
            key == 'priority'
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

  private shouldShowSaveButton = () =>
    !isNewRule(this.props.match.params.name) &&
    (!!this.state.newConditions.length || !!this.state.newServices.length);

  private decisionDropdownOption = (decision: IDecision): string =>
    decision.name;

  private isGenericSelected = (value: string) =>
    this.setState({isGeneric: value === 'true'});

  private serviceRule = () => {
    const {isLoading, error, formServiceRule, serviceRule} = this.props;
    // @ts-ignore
    const ruleKey: (keyof IServiceRule) = formServiceRule && Object.keys(formServiceRule)[0];
    return (
      <>
        {isLoading && <ListLoadingSpinner/>}
        {!isLoading && error && <Error message={error}/>}
        {!isLoading && !error && formServiceRule && (
          <Form id={ruleKey}
                fields={this.getFields(formServiceRule)}
                values={serviceRule}
                isNew={isNewRule(this.props.match.params.name)}
                showSaveButton={this.shouldShowSaveButton()}
                post={{url: 'rules/services', successCallback: this.onPostSuccess, failureCallback: this.onPostFailure}}
                put={{url: `rules/services/${this.state.ruleName || serviceRule[ruleKey]}`, successCallback: this.onPutSuccess, failureCallback: this.onPutFailure}}
                delete={{url: `rules/services/${this.state.ruleName || serviceRule[ruleKey]}`, successCallback: this.onDeleteSuccess, failureCallback: this.onDeleteFailure}}
                saveEntities={this.saveEntities}>
            {Object.keys(formServiceRule).map((key, index) =>
              key === 'decision'
                ? <Field<IDecision> key={index}
                                    id={key}
                                    label={key}
                                    type="dropdown"
                                    dropdown={{
                                      defaultValue: "Choose decision",
                                      values: this.props.decisions,
                                      optionToString: this.decisionDropdownOption}}/>
                : key === 'generic'
                ? <Field<boolean> key={index}
                                  id={key}
                                  label={key}
                                  type="dropdown"
                                  dropdown={{
                                    selectCallback: this.isGenericSelected,
                                    defaultValue: "Apply to all services?",
                                    values: [true, false]}}/>
                : <Field key={index}
                         id={key}
                         label={key}
                         type={key == 'priority' ? 'numberbox' : undefined}/>
            )}
          </Form>
        )}
      </>
    )
  };

  private conditions = (): JSX.Element =>
    <ServiceRuleConditionList rule={this.props.serviceRule}
                              newConditions={this.state.newConditions}
                              onAddRuleCondition={this.onAddRuleCondition}
                              onRemoveRuleConditions={this.onRemoveRuleConditions}/>;

  private services = (): JSX.Element =>
    <ServiceRuleServicesList rule={this.props.serviceRule}
                             newServices={this.state.newServices}
                             onAddRuleService={this.onAddRuleService}
                             onRemoveRuleServices={this.onRemoveRuleServices}/>;

  private tabs = () => [
    {
      title: 'Service rule',
      id: 'serviceRule',
      content: () => this.serviceRule()
    },
    {
      title: 'Conditions',
      id: 'serviceRuleConditions',
      content: () => this.conditions(),
    },
    {
      title: 'Services',
      id: 'services',
      content: () => this.services(),
      disabled: this.state.isGeneric,
    }
  ];

  render() {
    return (
      <MainLayout>
        {this.shouldShowSaveButton() && !isNewRule(this.props.match.params.name) && <UnsavedChanged/>}
        <div className="container">
          <Tabs {...this.props} tabs={this.tabs()}/>
        </div>
      </MainLayout>
    );
  }

}

function mapStateToProps(state: ReduxState, props: Props): StateToProps {
  const isLoading = state.entities.rules.services.isLoadingRules;
  const error = state.entities.rules.services.loadRulesError;
  const name = props.match.params.name;
  const isNew = isNewRule(name);
  const serviceRule = isNew
    ? emptyServiceRule()
    : state.entities.rules.services.data[name];
  let formServiceRule;
  if (isNew || !isNew && serviceRule) {
    formServiceRule = { ...serviceRule };
    if (!isNew) {
      delete formServiceRule["id"];
      delete formServiceRule["conditions"];
      delete formServiceRule["services"];
    }
  }
  const decisions = state.entities.decisions.data
                    && Object.values(state.entities.decisions.data)
                             .filter(decision => decision.componentType.name.toLowerCase() == 'service');
  return  {
    isLoading,
    error,
    serviceRule,
    formServiceRule,
    decisions,
  }
}

const mapDispatchToProps: DispatchToProps = {
  loadRulesService,
  loadDecisions,
  addRuleServiceConditions,
  addRuleServices,
};

export default connect(mapStateToProps, mapDispatchToProps)(ServiceRule);
