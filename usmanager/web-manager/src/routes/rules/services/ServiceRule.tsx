/*
 * Copyright (c) 2020 usmanager
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import {IRule} from "../Rule";
import {IService} from "../../services/Service";
import {RouteComponentProps} from "react-router";
import BaseComponent from "../../../components/BaseComponent";
import Form, {IFields, required} from "../../../components/form/Form";
import LoadingSpinner from "../../../components/list/LoadingSpinner";
import Error from "../../../components/errors/Error";
import Field from "../../../components/form/Field";
import Tabs, {Tab} from "../../../components/tabs/Tabs";
import MainLayout from "../../../views/mainLayout/MainLayout";
import {ReduxState} from "../../../reducers";
import {loadRulesService} from "../../../actions";
import {connect} from "react-redux";
import React from "react";

export interface IServiceRule extends IRule {
  service: IService
}

const emptyServiceRule = () => ({
  name: '',
  priority: 0,
  decision: undefined,
});

const isNewRule = (name: string) =>
  name === 'new_rule';

interface StateToProps {
  isLoading: boolean;
  error?: string | null;
  serviceRule: Partial<IServiceRule>;
  formServiceRule?: Partial<IServiceRule>,
}

interface DispatchToProps {
  loadRulesService: (name: string) => any;
}

interface MatchParams {
  name: string;
}

type Props = StateToProps & DispatchToProps & RouteComponentProps<MatchParams>;

class ServiceRule extends BaseComponent<Props, {}> {

  componentDidMount(): void {
    const ruleName = this.props.match.params.name;
    if (ruleName && !isNewRule(ruleName)) {
      this.props.loadRulesService(ruleName);
    }
  };

  private onPostSuccess = (reply: any, ruleName: string): void => {
    super.toast(`Service rule <b>${ruleName}</b> saved`);
  };

  private onPostFailure = (reason: string, ruleName: string): void =>
    super.toast(`Unable to save ${ruleName}`, 10000, reason, true);

  private onPutSuccess = (ruleName: string): void => {
    super.toast(`Changes to service rule <b>${ruleName}</b> are now saved`);
  };

  private onPutFailure = (reason: string, ruleName: string): void =>
    super.toast(`Unable to update ${ruleName}`, 10000, reason, true);

  private onDeleteSuccess = (ruleName: string): void => {
    super.toast(`Service rule <b>${ruleName}</b> successfully removed`);
    this.props.history.push(`/rules`)
  };

  private onDeleteFailure = (reason: string, ruleName: string): void =>
    super.toast(`Unable to delete ${ruleName}`, 10000, reason, true);

  private getFields = (serviceRule: Partial<IRule>): IFields =>
    Object.entries(serviceRule).map(([key, value]) => {
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
    const {isLoading, error, formServiceRule, serviceRule} = this.props;
    // @ts-ignore
    const ruleKey: (keyof IServiceRule) = formServiceRule && Object.keys(formServiceRule)[0];
    return (
      <>
        {isLoading && <LoadingSpinner/>}
        {!isLoading && error && <Error message={error}/>}
        {!isLoading && !error && formServiceRule && (
          <Form id={ruleKey}
                fields={this.getFields(formServiceRule)}
                values={serviceRule}
                isNew={isNewRule(this.props.match.params.name)}
                post={{url: 'rules', successCallback: this.onPostSuccess, failureCallback: this.onPostFailure}}
                put={{url: `rules/services/${serviceRule[ruleKey]}`, successCallback: this.onPutSuccess, failureCallback: this.onPutFailure}}
                delete={{url: `rules/services/${serviceRule[ruleKey]}`, successCallback: this.onDeleteSuccess, failureCallback: this.onDeleteFailure}}>
            {Object.keys(formServiceRule).map((key, index) =>
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
      title: 'Service rule',
      id: 'serviceRule',
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
  const isLoading = state.entities.rules.services.isLoading;
  const error = state.entities.rules.services.error;
  const name = props.match.params.name;
  const serviceRule = isNewRule(name) ? emptyServiceRule() : state.entities.rules.services.data[name];
  let formServiceRule;
  if (serviceRule) {
    formServiceRule = { ...serviceRule };
    delete formServiceRule["id"];
  }
  return  {
    isLoading,
    error,
    serviceRule,
    formServiceRule,
  }
}

const mapDispatchToProps: DispatchToProps = {
  loadRulesService,
};

export default connect(mapStateToProps, mapDispatchToProps)(ServiceRule);
