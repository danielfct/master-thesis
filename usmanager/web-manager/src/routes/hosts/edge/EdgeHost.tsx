/*
 * Copyright (c) 2020 usmanager
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import IData from "../../../components/IData";
import {RouteComponentProps} from "react-router";
import BaseComponent from "../../../components/BaseComponent";
import Form, {IFields, required} from "../../../components/form/Form";
import ListLoadingSpinner from "../../../components/list/ListLoadingSpinner";
import Error from "../../../components/errors/Error";
import Field from "../../../components/form/Field";
import Tabs, {Tab} from "../../../components/tabs/Tabs";
import MainLayout from "../../../views/mainLayout/MainLayout";
import {ReduxState} from "../../../reducers";
import {addEdgeHostRule, loadEdgeHosts} from "../../../actions";
import {connect} from "react-redux";
import React from "react";
import EdgeHostRuleList from "./EdgeHostRuleList";
import {postData} from "../../../utils/api";
import GenericHostRuleList from "../GenericHostRuleList";
import UnsavedChanged from "../../../components/form/UnsavedChanges";

export interface IEdgeHost extends IData {
  hostname: string;
  sshUsername: string;
  sshPassword: string;
  region: string;
  country: string;
  city: string;
  local: boolean;
  hostRules?: string[];
}

const emptyEdgeHost = (): Partial<IEdgeHost> => ({
  hostname: '',
  sshUsername: '',
  sshPassword: '',
  region: '',
  country: '',
  city: '',
  local: undefined,
});

const isNewHost = (edgeHostHostname: string) =>
  edgeHostHostname === 'new_host';

interface StateToProps {
  isLoading: boolean;
  error?: string | null;
  edgeHost: Partial<IEdgeHost>;
  formEdgeHost?: Partial<IEdgeHost>,
}

interface DispatchToProps {
  loadEdgeHosts: (hostname: string) => any;
  addEdgeHostRule: (hostname: string, ruleName: string) => void;
}

interface MatchParams {
  hostname: string;
}

type Props = StateToProps & DispatchToProps & RouteComponentProps<MatchParams>;

type State = {
  newRules: string[],
  hostname?: string,
}

class EdgeHost extends BaseComponent<Props, State> {

  state: State = {
    newRules: [],
  };

  componentDidMount(): void {
    const edgeHostHostname = this.props.match.params.hostname;
    if (edgeHostHostname && !isNewHost(edgeHostHostname)) {
      this.props.loadEdgeHosts(edgeHostHostname);
    }
  };

  private saveEntities = (hostname: string) => {
    this.saveEdgeHostRules(hostname);
  };

  private onPostSuccess = (reply: any, edgeHostHostname: string): void => {
    super.toast(`Edge host <b>${edgeHostHostname}</b> is now saved`);
  };

  private onPostFailure = (reason: string, edgeHostHostname: string): void =>
    super.toast(`Unable to save ${edgeHostHostname}`, 10000, reason, true);

  private onPutSuccess = (hostname: string): void => {
    super.toast(`Changes to host <b>${hostname}</b> are now saved`);
    this.setState({hostname: hostname});
    this.saveEntities(hostname);
  };

  private onPutFailure = (reason: string, hostname: string): void =>
    super.toast(`Unable to update ${hostname}`, 10000, reason, true);

  private onDeleteSuccess = (edgeHostHostname: string): void => {
    super.toast(`Edge host <b>${edgeHostHostname}</b> successfully removed`);
    this.props.history.push(`/hosts`)
  };

  private onDeleteFailure = (reason: string, edgeHostHostname: string): void =>
    super.toast(`Unable to remove edge host ${edgeHostHostname}`, 10000, reason, true);

  private onAddEdgeHostRule = (rule: string): void => {
    this.setState({
      newRules: this.state.newRules.concat(rule)
    });
  };

  private onRemoveEdgeHostRules = (rules: string[]): void => {
    this.setState({
      newRules: this.state.newRules.filter(rule => !rules.includes(rule))
    });
  };

  private saveEdgeHostRules = (hostname: string): void => {
    const {newRules} = this.state;
    if (newRules.length) {
      postData(`hosts/edge/${hostname}/rules`, newRules,
        () => this.onSaveRulesSuccess(hostname),
        (reason) => this.onSaveRulesFailure(hostname, reason));
    }
  };

  private onSaveRulesSuccess = (hostname: string): void => {
    if (!isNewHost(this.props.match.params.hostname)) {
      this.state.newRules.forEach(rule =>
        this.props.addEdgeHostRule(hostname, rule)
      );
    }
    this.setState({ newRules: [] });
  };

  private onSaveRulesFailure = (hostname: string, reason: string): void =>
    super.toast(`Unable to save rules of host ${hostname}`, 10000, reason, true);

  private shouldShowSaveButton = () =>
    !!this.state.newRules.length;

  private getFields = (edgeHost: Partial<IEdgeHost>): IFields =>
    Object.entries(edgeHost).map(([key, _]) => {
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

  private isLocalOption = (isLocal: boolean): string =>
    isLocal.toString();

  private details = () => {
    const {isLoading, error, formEdgeHost, edgeHost} = this.props;
    // @ts-ignore
    const edgeHostKey: (keyof IEdgeHost) = formEdgeHost && Object.keys(formEdgeHost)[0];
    return (
      <>
        {isLoading && <ListLoadingSpinner/>}
        {!isLoading && error && <Error message={error}/>}
        {!isLoading && !error && formEdgeHost && (
          <Form id={edgeHostKey}
                fields={this.getFields(formEdgeHost)}
                values={edgeHost}
                isNew={isNewHost(this.props.match.params.hostname)}
                showSaveButton={this.shouldShowSaveButton()}
                post={{
                  url: 'hosts/edge',
                  successCallback: this.onPostSuccess,
                  failureCallback: this.onPostFailure}}
                put={{
                  url: `hosts/edge/${this.state.hostname || edgeHost[edgeHostKey]}`,
                  successCallback: this.onPutSuccess,
                  failureCallback: this.onPutFailure}}
                delete={{
                  url: `hosts/edge/${this.state.hostname || edgeHost[edgeHostKey]}`,
                  successCallback: this.onDeleteSuccess,
                  failureCallback: this.onDeleteFailure}}
                saveEntities={this.saveEntities}>
            {Object.keys(formEdgeHost).map((key, index) =>
              key === 'local'
                ? <Field<boolean> key={index}
                         id={key}
                         type="dropdown"
                         label={key}
                         dropdown={{
                           defaultValue: "Is a local machine?",
                           values: [true, false],
                           optionToString: this.isLocalOption}}/>
                : <Field key={index}
                         id={key}
                         label={key}/>
            )}
          </Form>
        )}
      </>
    )
  };

  private rules = (): JSX.Element =>
    <EdgeHostRuleList host={this.props.edgeHost}
                      unsavedRules={this.state.newRules}
                      onAddHostRule={this.onAddEdgeHostRule}
                      onRemoveHostRules={this.onRemoveEdgeHostRules}/>;

  private genericRules = (): JSX.Element =>
    <GenericHostRuleList/>;

  private tabs: Tab[] = [
    {
      title: 'Edge host',
      id: 'edgeHost',
      content: () => this.details()
    },
    {
      title: 'Rules',
      id: 'edgeRules',
      content: () => this.rules()
    },
    {
      title: 'Generic rules',
      id: 'genericEdgeRules',
      content: () => this.genericRules()
    },
  ];

  render() {
    return (
      <MainLayout>
        {this.shouldShowSaveButton() && !isNewHost(this.props.match.params.hostname) && <UnsavedChanged/>}
        <div className="container">
          <Tabs {...this.props} tabs={this.tabs}/>
        </div>
      </MainLayout>
    );
  }

}

function mapStateToProps(state: ReduxState, props: Props): StateToProps {
  const isLoading = state.entities.hosts.edge.isLoadingHosts;
  const error = state.entities.hosts.edge.loadHostsError;
  const hostname = props.match.params.hostname;
  const edgeHost = isNewHost(hostname) ? emptyEdgeHost() : state.entities.hosts.edge.data[hostname];
  let formEdgeHost;
  if (edgeHost) {
    formEdgeHost = { ...edgeHost };
    delete formEdgeHost["id"];
    delete formEdgeHost["hostRules"];
  }
  return  {
    isLoading,
    error,
    edgeHost,
    formEdgeHost,
  }
}

const mapDispatchToProps: DispatchToProps = {
  loadEdgeHosts,
  addEdgeHostRule
};

export default connect(mapStateToProps, mapDispatchToProps)(EdgeHost);