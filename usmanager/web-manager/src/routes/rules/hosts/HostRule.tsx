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
import {connect} from "react-redux";
import React from "react";
import {
  addRuleCloudHosts,
  addRuleHostConditions,
  addRuleEdgeHosts,
  loadDecisions,
  loadRulesHost,
} from "../../../actions";
import {postData} from "../../../utils/api";
import HostRuleConditionList from "./HostRuleConditionList";
import UnsavedChanged from "../../../components/form/UnsavedChanges";
import HostRuleCloudHostsList from "./HostRuleCloudHostsList";
import HostRuleEdgeHostsList from "./HostRuleEdgeHostsList";

export interface IHostRule extends IRule {
  cloudHosts?: string[],
  edgeHosts?: string[],
}

const emptyHostRule = () => ({
  name: '',
  priority: undefined,
  generic: undefined,
  decision: undefined,
});

const isNewRule = (name: string) =>
  name === 'new_host_rule';

interface StateToProps {
  isLoading: boolean;
  error?: string | null;
  hostRule: Partial<IHostRule>;
  formHostRule?: Partial<IHostRule>,
  decisions: IDecision[],
}

interface DispatchToProps {
  loadRulesHost: (name: string) => any;
  loadDecisions: () => any;
  addRuleHostConditions: (ruleName: string, conditions: string[]) => void;
  addRuleCloudHosts: (ruleName: string, cloudHosts: string[]) => void;
  addRuleEdgeHosts: (ruleName: string, edgeHosts: string[]) => void;
}

interface MatchParams {
  name: string;
}

type Props = StateToProps & DispatchToProps & RouteComponentProps<MatchParams>;

type State = {
  newConditions: string[],
  newCloudHosts: string[],
  newEdgeHosts: string[],
  ruleName?: string,
  isGeneric: boolean,
}

class HostRule extends BaseComponent<Props, State> {

  state: State = {
    newConditions: [],
    newCloudHosts: [],
    newEdgeHosts: [],
    isGeneric: this.props.hostRule?.generic || false,
  };

  componentDidMount(): void {
    this.props.loadDecisions();
    const ruleName = this.props.match.params.name;
    if (ruleName && !isNewRule(ruleName)) {
      this.props.loadRulesHost(ruleName);
    }
  };

  private saveEntities = (rule: IHostRule) => {
    this.saveRuleConditions(rule);
    this.saveRuleCloudHosts(rule);
    this.saveRuleEdgeHosts(rule);
  };

  private onPostSuccess = (reply: any, rule: IHostRule): void => {
    super.toast(`Host rule <b>${rule.name}</b> saved`);
    this.saveEntities(rule);
  };

  private onPostFailure = (reason: string, rule: IHostRule): void =>
    super.toast(`Unable to save ${rule}`, 10000, reason, true);

  private onPutSuccess = (rule: IHostRule): void => {
    super.toast(`Changes to host rule <b>${rule.name}</b> are now saved`);
    this.setState({ruleName: rule.name});
    this.saveEntities(rule);
  };

  private onPutFailure = (reason: string, ruleName: string): void =>
    super.toast(`Unable to update ${ruleName}`, 10000, reason, true);

  private onDeleteSuccess = (ruleName: string): void => {
    super.toast(`Host rule <b>${ruleName}</b> successfully removed`);
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

  private saveRuleConditions = (rule: IHostRule): void => {
    const {newConditions} = this.state;
    if (newConditions.length) {
      postData(`rules/hosts/${rule.name}/conditions`, newConditions,
        () => this.onSaveConditionsSuccess(rule),
        (reason) => this.onSaveConditionsFailure(rule, reason));
    }
  };

  private onSaveConditionsSuccess = (rule: IHostRule): void => {
    if (!isNewRule(this.props.match.params.name)) {
      this.props.addRuleHostConditions(rule.name, this.state.newConditions)
    }
    this.setState({ newConditions: [] });
  };

  private onSaveConditionsFailure = (rule: IHostRule, reason: string): void =>
    super.toast(`Unable to save conditions of rule ${rule.name}`, 10000, reason, true);

  private onAddRuleCloudHost = (cloudHost: string): void =>
    this.setState({
      newCloudHosts: this.state.newCloudHosts.concat(cloudHost)
    });

  private onRemoveRuleCloudHosts = (cloudHosts: string[]): void => {
    this.setState({
      newCloudHosts: this.state.newCloudHosts.filter(cloudHost => !cloudHosts.includes(cloudHost))
    });
  };

  private saveRuleCloudHosts = (rule: IHostRule): void => {
    const {newCloudHosts} = this.state;
    if (newCloudHosts.length) {
      postData(`rules/hosts/${rule.name}/cloudHosts`, newCloudHosts,
        () => this.onSaveCloudHostsSuccess(rule.name),
        (reason) => this.onSaveCloudHostsFailure(rule.name, reason));
    }
  };

  private onSaveCloudHostsSuccess = (ruleName: string): void => {
    if (!isNewRule(this.props.match.params.name)) {
      this.props.addRuleCloudHosts(ruleName, this.state.newCloudHosts)
    }
    this.setState({ newCloudHosts: [] });
  };

  private onSaveCloudHostsFailure = (ruleName: string, reason: string): void =>
    super.toast(`Unable to save cloud hosts of rule ${ruleName}`, 10000, reason, true);

  private onAddRuleEdgeHost = (edgeHost: string): void =>
    this.setState({
      newEdgeHosts: this.state.newEdgeHosts.concat(edgeHost)
    });

  private onRemoveRuleEdgeHosts = (edgeHosts: string[]): void => {
    this.setState({
      newEdgeHosts: this.state.newEdgeHosts.filter(edgeHost => !edgeHosts.includes(edgeHost))
    });
  };

  private saveRuleEdgeHosts = (rule: IHostRule): void => {
    const {newEdgeHosts} = this.state;
    if (newEdgeHosts.length) {
      postData(`rules/hosts/${rule.name}/edgeHosts`, newEdgeHosts,
        () => this.onSaveEdgeHostsSuccess(rule),
        (reason) => this.onSaveEdgeHostsFailure(rule, reason));
    }
  };

  private onSaveEdgeHostsSuccess = (rule: IHostRule): void => {
    if (!isNewRule(this.props.match.params.name)) {
      this.props.addRuleEdgeHosts(rule.name, this.state.newEdgeHosts)
    }
    this.setState({ newEdgeHosts: [] });
  };

  private onSaveEdgeHostsFailure = (rule: IHostRule, reason: string): void =>
    super.toast(`Unable to save edge hosts of rule ${rule.name}`, 10000, reason, true);


  private getFields = (hostRule: Partial<IRule>): IFields =>
    Object.entries(hostRule).map(([key, _]) => {
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

  private shouldShowSaveButton = ():boolean =>
    !isNewRule(this.props.match.params.name) &&
    (!!this.state.newConditions.length || !!this.state.newCloudHosts.length || !!this.state.newEdgeHosts.length);

  private decisionDropdownOption = (decision: IDecision) =>
    decision.name;

  private isGenericSelected = (value: string) =>
    this.setState({isGeneric: value === 'true'});

  private details = () => {
    const {isLoading, error, formHostRule, hostRule} = this.props;
    // @ts-ignore
    const ruleKey: (keyof IHostRule) = formHostRule && Object.keys(formHostRule)[0];
    return (
      <>
        {isLoading && <ListLoadingSpinner/>}
        {!isLoading && error && <Error message={error}/>}
        {!isLoading && !error && formHostRule && (
          <Form id={ruleKey}
                fields={this.getFields(formHostRule)}
                values={hostRule}
                isNew={isNewRule(this.props.match.params.name)}
                showSaveButton={this.shouldShowSaveButton()}
                post={{url: 'rules/hosts', successCallback: this.onPostSuccess, failureCallback: this.onPostFailure}}
                put={{url: `rules/hosts/${this.state.ruleName || hostRule[ruleKey]}`, successCallback: this.onPutSuccess, failureCallback: this.onPutFailure}}
                delete={{url: `rules/hosts/${this.state.ruleName || hostRule[ruleKey]}`, successCallback: this.onDeleteSuccess, failureCallback: this.onDeleteFailure}}
                saveEntities={this.saveEntities}>
            {Object.keys(formHostRule).map((key, index) =>
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
                                    defaultValue: "Apply to all hosts?",
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
    <HostRuleConditionList rule={this.props.hostRule}
                           newConditions={this.state.newConditions}
                           onAddRuleCondition={this.onAddRuleCondition}
                           onRemoveRuleConditions={this.onRemoveRuleConditions}/>;

  private cloudHosts = (): JSX.Element =>
    <HostRuleCloudHostsList rule={this.props.hostRule}
                            newCloudHosts={this.state.newCloudHosts}
                            onAddRuleCloudHost={this.onAddRuleCloudHost}
                            onRemoveRuleCloudHosts={this.onRemoveRuleCloudHosts}/>;

  private edgeHosts = (): JSX.Element =>
    <HostRuleEdgeHostsList rule={this.props.hostRule}
                           newEdgeHosts={this.state.newEdgeHosts}
                           onAddRuleEdgeHost={this.onAddRuleEdgeHost}
                           onRemoveRuleEdgeHosts={this.onRemoveRuleEdgeHosts}/>;

  private tabs = () => [
    {
      title: 'Host rule',
      id: 'hostRule',
      content: () => this.details(),
    },
    {
      title: 'Conditions',
      id: 'hostRuleConditions',
      content: () => this.conditions(),
    },
    {
      title: 'Cloud hosts',
      id: 'cloudHosts',
      content: () => this.cloudHosts(),
      disabled: this.state.isGeneric,
    },
    {
      title: 'Edge hosts',
      id: 'edgeHosts',
      content: () => this.edgeHosts(),
      disabled: this.state.isGeneric
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
  const isLoading = state.entities.rules.hosts.isLoadingRules;
  const error = state.entities.rules.hosts.loadRulesError;
  const name = props.match.params.name;
  const isNew = isNewRule(name);
  const hostRule = isNew ? emptyHostRule() : state.entities.rules.hosts.data[name];
  let formHostRule;
  if (isNew || !isNew && hostRule) {
    formHostRule = { ...hostRule };
    if (!isNew) {
      delete formHostRule["id"];
      delete formHostRule["conditions"];
      delete formHostRule["cloudHosts"];
      delete formHostRule["edgeHosts"];
    }
  }
  const decisions = state.entities.decisions.data
                    && Object.values(state.entities.decisions.data)
                             .filter(decision => decision.componentType.name.toLowerCase() == 'host');
  return  {
    isLoading,
    error,
    hostRule,
    formHostRule,
    decisions,
  }
}

const mapDispatchToProps: DispatchToProps = {
  loadRulesHost,
  loadDecisions,
  addRuleHostConditions,
  addRuleCloudHosts,
  addRuleEdgeHosts
};

export default connect(mapStateToProps, mapDispatchToProps)(HostRule);
