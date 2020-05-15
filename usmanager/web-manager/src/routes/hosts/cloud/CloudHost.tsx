/*
 * Copyright (c) 2020 usmanager
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import {RouteComponentProps} from "react-router";
import IData from "../../../components/IData";
import BaseComponent from "../../../components/BaseComponent";
import Form, {IFields, required} from "../../../components/form/Form";
import ListLoadingSpinner from "../../../components/list/ListLoadingSpinner";
import Error from "../../../components/errors/Error";
import Field from "../../../components/form/Field";
import Tabs, {Tab} from "../../../components/tabs/Tabs";
import MainLayout from "../../../views/mainLayout/MainLayout";
import {ReduxState} from "../../../reducers";
import {addCloudHostRule, loadCloudHosts} from "../../../actions";
import {connect} from "react-redux";
import React from "react";
import {deleteData, IReply, postData} from "../../../utils/api";
import GenericHostRuleList from "../GenericHostRuleList";
import CloudHostRuleList from "./CloudHostRuleList";
import UnsavedChanged from "../../../components/form/UnsavedChanges";

export interface ICloudHost extends IData {
  instanceId: string;
  imageId: string;
  instanceType: string;
  state: { code: number, name: string }
  publicDnsName: string;
  publicIpAddress: string;
  hostRules?: string[];
}

const emptyCloudHost = (): Partial<ICloudHost> => ({
  instanceId: '',
  imageId: '',
  instanceType: '',
});

const isNewHost = (cloudHostInstanceId: string) =>
  cloudHostInstanceId === 'new_host';

interface StateToProps {
  isLoading: boolean;
  error?: string | null;
  cloudHost: Partial<ICloudHost>;
  formCloudHost?: Partial<ICloudHost>;
}

interface DispatchToProps {
  loadCloudHosts: (instanceId: string) => any;
  addCloudHostRule: (hostname: string, ruleName: string) => void;
}

interface MatchParams {
  instanceId: string;
}

type Props = StateToProps & DispatchToProps & RouteComponentProps<MatchParams>;

type State = {
  newRules: string[],
  cloudHostState?: 'running' | 'stopped' | 'terminated' | undefined,
  isLoading: boolean,
}

class CloudHost extends BaseComponent<Props, {}> {

  state: State = {
    newRules: [],
    isLoading: false,
  };

  componentDidMount(): void {
    this.loadCloudHost();
  };

  private loadCloudHost = () => {
    const cloudHostInstanceId = this.props.match.params.instanceId;
    if (cloudHostInstanceId && !isNewHost(cloudHostInstanceId)) {
      this.props.loadCloudHosts(cloudHostInstanceId);
    }
  };

  private saveEntities = (hostname: string) => {
    this.saveCloudHostRules(hostname);
  };

  private onPostSuccess = (reply: IReply<ICloudHost>): void => {
    super.toast(`Cloud host <b>${reply.data.instanceId}</b> has now started`);
  };

  private onPostFailure = (reason: string, cloudHostInstanceId: string): void =>
    super.toast(`Unable to update ${cloudHostInstanceId}`, 10000, reason, true);


  private onAddCloudHostRule = (rule: string): void => {
    this.setState({
      newRules: this.state.newRules.concat(rule)
    });
  };

  private onRemoveCloudHostRules = (rules: string[]): void => {
    this.setState({
      newRules: this.state.newRules.filter(rule => !rules.includes(rule))
    });
  };

  private saveCloudHostRules = (instanceId: string): void => {
    const {newRules} = this.state;
    if (newRules.length) {
      postData(`hosts/cloud/${instanceId}/rules`, newRules,
        () => this.onSaveRulesSuccess(instanceId),
        (reason) => this.onSaveRulesFailure(instanceId, reason));
    }
  };

  private onSaveRulesSuccess = (instanceId: string): void => {
    if (!isNewHost(this.props.match.params.instanceId)) {
      this.state.newRules.forEach(rule =>
        this.props.addCloudHostRule(instanceId, rule)
      );
    }
    this.setState({ newRules: [] });
  };

  private onSaveRulesFailure = (instanceId: string, reason: string): void =>
    super.toast(`Unable to save rules of host ${instanceId}`, 10000, reason, true);

  private shouldShowSaveButton = () =>
    !!this.state.newRules.length;

  private getFields = (cloudHost: Partial<ICloudHost>): IFields =>
    Object.entries(cloudHost).map(([key, _]) => {
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

  private startStopTerminateButtons = () => {
    const state = (this.state.cloudHostState || this.props.cloudHost.state?.name);
    const runningState = state?.includes('running');
    const stoppedState = state?.includes('stopped');
    const terminatedState = state?.includes('terminated');
    return (
      <>
        {stoppedState &&
         <button className={`btn-flat btn-small waves-effect waves-light green-text`} onClick={this.startCloudHost}>
             Start
         </button>}
        {runningState &&
         <button className={`btn-flat btn-small waves-effect waves-light blue-text`} onClick={this.stopCloudHost}>
             Stop
         </button>}
        {!terminatedState &&
         <button className={`btn-flat btn-small waves-effect waves-light red-text`} onClick={this.terminateCloudHost}>
             Terminate
         </button>}
      </>
    );
  };

  private startCloudHost = () => {
    const {cloudHost} = this.props;
    this.setState({isLoading: true});
    postData(`hosts/cloud/${cloudHost.instanceId}/state`, 'start',
      (reply: IReply<ICloudHost>) => this.onStartSuccess(reply),
      (reply) => this.onStartFailure(reply));
  };

  private onStartSuccess = (reply: IReply<ICloudHost>) => {
    super.toast(`Successfully started cloud host ${reply.data.instanceId}`, 15000);
    this.setState({cloudHostState: 'running', isLoading: false});
  };

  private onStartFailure = (reason: string) => {
    super.toast(`Failed to start cloud host ${this.props.cloudHost.instanceId}`, 10000, reason, true);
    this.setState({isLoading: false});
  };

  private stopCloudHost = () => {
    const {cloudHost} = this.props;
    this.setState({isLoading: true});
    postData(`hosts/cloud/${cloudHost.instanceId}/state`, 'stop',
      (reply: IReply<ICloudHost>) => this.onStopSuccess(reply),
      (reply) => this.onStopFailure(reply));
  };

  private onStopSuccess = (reply: IReply<ICloudHost>) => {
    super.toast(`Successfully stopped cloud host ${reply.data.instanceId}`, 15000);
    this.setState({cloudHostState: 'stopped', isLoading: false});
  };

  private onStopFailure = (reply: string) => {
    super.toast(`Failed to stop cloud host ${this.props.cloudHost.instanceId}`, 10000, reply, true);
    this.setState({isLoading: false});
  };

  private terminateCloudHost = () => {
    const {cloudHost} = this.props;
    this.setState({isLoading: true});
    deleteData(`hosts/cloud/${cloudHost.instanceId}`,
      () => this.onTerminateSuccess(),
      (reply) => this.onTerminateFailure(reply));
  };

  private onTerminateSuccess = () => {
    super.toast(`Successfully terminated cloud host ${this.props.cloudHost.instanceId}`, 15000);
    this.props.history.push(`/hosts`);
  };

  private onTerminateFailure = (reason: string) => {
    super.toast(`Failed to terminate cloud host ${this.props.cloudHost.instanceId}`, 10000, reason, true);
    this.setState({isLoading: false});
  };

  private cloudHost = () => {
    const {isLoading, error, formCloudHost, cloudHost} = this.props;
    // @ts-ignore
    const cloudHostKey: (keyof ICloudHost) = formCloudHost && Object.keys(formCloudHost)[0];
    return (
      <>
        {isLoading && <ListLoadingSpinner/>}
        {!isLoading && error && <Error message={error}/>}
        {!isLoading && !error && formCloudHost && (
          <Form id={cloudHostKey}
                fields={this.getFields(formCloudHost)}
                values={cloudHost}
                isNew={isNewHost(this.props.match.params.instanceId)}
                showSaveButton={this.shouldShowSaveButton()}
                post={{
                  url: 'hosts/cloud',
                  successCallback: this.onPostSuccess,
                  failureCallback: this.onPostFailure}}
                customButtons={this.startStopTerminateButtons()}
                saveEntities={this.saveEntities}
                loading={this.state.isLoading}>
            {/*//TODO instanceType dropdown?*/}
            {Object.keys(formCloudHost).map((key, index) =>
              <Field key={index}
                     id={key}
                     label={key}/>
            )}
          </Form>
        )}
      </>
    )
  };

  private entitiesList = (element: JSX.Element) => {
    const {isLoading, error, cloudHost} = this.props;
    if (isLoading) {
      return <ListLoadingSpinner/>;
    }
    if (error) {
      return <Error message={error}/>;
    }
    if (cloudHost) {
      return element;
    }
    return <></>;
  };

  private rules = (): JSX.Element =>
    this.entitiesList(<CloudHostRuleList host={this.props.cloudHost}
                                         unsavedRules={this.state.newRules}
                                         onAddHostRule={this.onAddCloudHostRule}
                                         onRemoveHostRules={this.onRemoveCloudHostRules}/>);

  private genericRules = (): JSX.Element =>
    this.entitiesList(<GenericHostRuleList/>);

  private tabs: Tab[] = [
    {
      title: 'Cloud host',
      id: 'cloudHost',
      content: () => this.cloudHost()
    },
    {
      title: 'Rules',
      id: 'cloudRules',
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
        {this.shouldShowSaveButton() && !isNewHost(this.props.match.params.instanceId) && <UnsavedChanged/>}
        <div className="container">
          <Tabs {...this.props} tabs={this.tabs}/>
        </div>
      </MainLayout>
    );
  }

}

function mapStateToProps(state: ReduxState, props: Props): StateToProps {
  const isLoading = state.entities.hosts.cloud.isLoadingHosts;
  const error = state.entities.hosts.cloud.loadHostsError;
  const instanceId = props.match.params.instanceId;
  const cloudHost = isNewHost(instanceId) ? emptyCloudHost() : state.entities.hosts.cloud.data[instanceId];
  console.log(cloudHost)
  let formCloudHost;
  if (cloudHost) {
    formCloudHost = {...cloudHost};
    delete formCloudHost["id"];
    delete formCloudHost["hostRules"];
  }
  return  {
    isLoading,
    error,
    cloudHost,
    formCloudHost
  }
}

const mapDispatchToProps: DispatchToProps = {
  loadCloudHosts,
  addCloudHostRule
};

export default connect(mapStateToProps, mapDispatchToProps)(CloudHost);