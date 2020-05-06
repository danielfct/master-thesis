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
import {IService} from "../../services/Service";
import {RouteComponentProps} from "react-router";
import BaseComponent from "../../../components/BaseComponent";
import Form, {IFields, required, requiredAndNumberAndMin} from "../../../components/form/Form";
import ListLoadingSpinner from "../../../components/list/ListLoadingSpinner";
import Error from "../../../components/errors/Error";
import Field from "../../../components/form/Field";
import Tabs, {Tab} from "../../../components/tabs/Tabs";
import MainLayout from "../../../views/mainLayout/MainLayout";
import {ReduxState} from "../../../reducers";
import {
  addRuleCloudHosts,
  addRuleServiceCondition, addRuleServices,
  loadDecisions,
  loadGenericRulesService,
  loadRulesService, loadServices
} from "../../../actions";
import {connect} from "react-redux";
import React from "react";
import {postData} from "../../../utils/api";
import ServiceRuleConditionList from "./ServiceRuleConditionList";
import UnsavedChanged from "../../../components/form/UnsavedChanges";
import HostRuleCloudHostsList from "../hosts/HostRuleCloudHostsList";
import ServiceRuleServicesList from "./ServiceRuleServicesList";

export interface IServiceRule extends IRule {
  services: string[]
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
  loadGenericRulesService: (name: string) => any;
  loadDecisions: () => any;
  addRuleServiceCondition: (ruleName: string, condition: string) => void;
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
}

class ServiceRule extends BaseComponent<Props, State> {

  state: State = {
    newConditions: [],
    newServices: [],
  };

  componentDidMount(): void {
    this.props.loadDecisions();
    const ruleName = this.props.match.params.name;
    if (ruleName && !isNewRule(ruleName)) {
      this.props.loadRulesService(ruleName);
      this.props.loadGenericRulesService(ruleName);
    }
  };

  private saveEntities = (ruleName: string) => {
    this.saveRuleConditions(ruleName);
    this.saveRuleServices(ruleName);
  };

  private onPostSuccess = (reply: any, ruleName: string): void => {
    super.toast(`Service rule <b>${ruleName}</b> saved`);
    this.setState({ruleName: ruleName});
    this.saveEntities(ruleName);
  };

  private onPostFailure = (reason: string, ruleName: string): void =>
    super.toast(`Unable to update ${ruleName}`, 10000, reason, true);

  private onPutSuccess = (ruleName: string): void => {
    super.toast(`Changes to service rule <b>${ruleName}</b> are now saved`);
    this.setState({ruleName: ruleName});
    this.saveEntities(ruleName);
  };

  private onPutFailure = (reason: string, ruleName: string): void =>
    super.toast(`Unable to update ${ruleName}`, 10000, reason, true);

  private onDeleteSuccess = (ruleName: string): void => {
    super.toast(`Service rule <b>${ruleName}</b> successfully removed`);
    this.props.history.push(`/rules`)
  };

  private onDeleteFailure = (reason: string, ruleName: string): void =>
    super.toast(`Unable to delete ${ruleName}`, 10000, reason, true);

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

  private saveRuleConditions = (ruleName: string): void => {
    const {newConditions} = this.state;
    if (newConditions.length) {
      postData(`rules/services/${ruleName}/conditions`, newConditions,
        () => this.onSaveConditionsSuccess(ruleName),
        (reason) => this.onSaveConditionsFailure(ruleName, reason));
    }
  };

  private onSaveConditionsSuccess = (ruleName: string): void => {
    if (!isNewRule(this.props.match.params.name)) {
      this.state.newConditions.forEach(condition =>
        this.props.addRuleServiceCondition(ruleName, condition)
      );
    }
    this.setState({ newConditions: [] });
  };

  private onSaveConditionsFailure = (ruleName: string, reason: string): void =>
    super.toast(`Unable to save conditions of rule ${ruleName}`, 10000, reason, true);




  private onAddRuleService = (service: string): void =>
    this.setState({
      newServices: this.state.newServices.concat(service)
    });

  private onRemoveRuleServices = (services: string[]): void => {
    this.setState({
      newServices: this.state.newServices.filter(service => !services.includes(service))
    });
  };

  private saveRuleServices = (ruleName: string): void => {
    const {newServices} = this.state;
    if (newServices.length) {
      postData(`rules/services/${ruleName}/services`, newServices,
        () => this.onSaveServicesSuccess(ruleName),
        (reason) => this.onSaveServicesFailure(ruleName, reason));
    }
  };

  private onSaveServicesSuccess = (ruleName: string): void => {
    if (!isNewRule(this.props.match.params.name)) {
      this.props.addRuleServices(ruleName, this.state.newServices)
    }
    this.setState({ newServices: [] });
  };

  private onSaveServicesFailure = (ruleName: string, reason: string): void =>
    super.toast(`Unable to save services of rule ${ruleName}`, 10000, reason, true);

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
    !isNewRule(this.props.match.params.name) && Object.values(this.state).some(newValues => newValues?.length);

  private decisionDropdownOption = (decision: IDecision): string =>
    decision.name;

  private details = () => {
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
                                    defaultValue: "Apply to all services?",
                                    values: [true, false]}}/>
                : <Field key={index}
                         id={key}
                         label={key}/>
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

  private tabs: Tab[] = [
    {
      title: 'Service rule',
      id: 'serviceRule',
      content: () => this.details()
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
    }
  ];

  render() {
    return (
      <MainLayout>
        {this.shouldShowSaveButton() && !isNewRule(this.props.match.params.name) && <UnsavedChanged/>}
        <div className="container">
          <Tabs {...this.props} tabs={this.tabs}/>
        </div>
      </MainLayout>
    );
  }

}

function mapStateToProps(state: ReduxState, props: Props): StateToProps {
  const isLoading = state.entities.rules.services.isLoadingRules || state.entities.rules.services.generic.isLoadingGenericRules;
  const error = state.entities.rules.services.loadRulesError && state.entities.rules.services.generic.loadGenericRulesError;
  const name = props.match.params.name;
  const isNew = isNewRule(name);
  const serviceRule = isNew
    ? emptyServiceRule()
    : state.entities.rules.services.data[name] || state.entities.rules.services.generic.data[name];
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
  loadGenericRulesService,
  loadDecisions,
  addRuleServiceCondition,
  addRuleServices,
};

export default connect(mapStateToProps, mapDispatchToProps)(ServiceRule);
