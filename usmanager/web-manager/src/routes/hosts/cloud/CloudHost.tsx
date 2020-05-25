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
import IDatabaseData from "../../../components/IDatabaseData";
import BaseComponent from "../../../components/BaseComponent";
import Form, {ICustomButton, IFormLoading} from "../../../components/form/Form";
import ListLoadingSpinner from "../../../components/list/ListLoadingSpinner";
import Error from "../../../components/errors/Error";
import Field from "../../../components/form/Field";
import Tabs, {Tab} from "../../../components/tabs/Tabs";
import MainLayout from "../../../views/mainLayout/MainLayout";
import {ReduxState} from "../../../reducers";
import {addCloudHost, addCloudHostRule, loadCloudHosts} from "../../../actions";
import {connect} from "react-redux";
import React from "react";
import {deleteData, IReply, postData} from "../../../utils/api";
import GenericHostRuleList from "../GenericHostRuleList";
import CloudHostRuleList from "./CloudHostRuleList";
import UnsavedChanged from "../../../components/form/UnsavedChanges";
import {Schemas} from "../../../middleware/api";
import {normalize} from "normalizr";
import {isNew} from "../../../utils/router";

export interface ICloudHost extends IDatabaseData {
  instanceId: string;
  imageId: string;
  instanceType: string;
  state: string;
  publicDnsName: string;
  publicIpAddress: string;
  hostRules?: string[];
}

export interface IState {
  code: number,
  name: string
}

const buildNewCloudHost = (): Partial<ICloudHost> => ({
});

interface StateToProps {
  isLoading: boolean;
  error?: string | null;
  cloudHost: Partial<ICloudHost>;
  formCloudHost?: Partial<ICloudHost>;
}

interface DispatchToProps {
  loadCloudHosts: (instanceId: string) => void;
  addCloudHost: (cloudHost: ICloudHost) => void;
  //TODO updateCloudHost: (previousCloudHost: Partial<ICloudHost>, cloudHost: ICloudHost) => void;
  addCloudHostRule: (instanceId: string, ruleName: string) => void;
}

interface MatchParams {
  instanceId: string;
}

type Props = StateToProps & DispatchToProps & RouteComponentProps<MatchParams>;

interface State {
  cloudHost?: ICloudHost,
  formCloudHost?: ICloudHost,
  unsavedRules: string[],
  loading: IFormLoading,
}

class CloudHost extends BaseComponent<Props, State> {

  private mounted = false;

  state: State = {
    unsavedRules: [],
    loading: undefined,
  };

  componentDidMount(): void {
    this.loadCloudHost();
    this.mounted = true;
  };

  componentWillUnmount(): void {
    this.mounted = false;
  }

  private loadCloudHost = () => {
    if (!isNew(this.props.location.search)) {
      const instanceId = this.props.match.params.instanceId;
      this.props.loadCloudHosts(instanceId);
    }
  };

  private getCloudHost = () =>
    this.state.cloudHost || this.props.cloudHost;

  private getFormCloudHost = () =>
    this.state.formCloudHost || this.props.formCloudHost;

  private onPostSuccess = (reply: IReply<ICloudHost>): void => {
    const cloudHost = reply.data;
    super.toast(`<span class="green-text">Cloud instance ${this.mounted ? `<b class="white-text">${cloudHost.instanceId}</b>` : `<a href=/hosts/cloud/${cloudHost.instanceId}><b>${cloudHost.instanceId}</b></a>`} has started</span>`);
    this.props.addCloudHost(cloudHost);
    this.saveEntities(cloudHost);
    if (this.mounted) {
      this.updateCloudHost(cloudHost);
      this.props.history.replace(cloudHost.instanceId);
    }
  };

  private onPostFailure = (reason: string): void =>
    super.toast(`Unable to start a new cloud instance`, 10000, reason, true);

  private shouldShowSaveButton = () =>
    !!this.state.unsavedRules.length;

  private saveEntities = (cloudHost: ICloudHost) => {
    this.saveCloudHostRules(cloudHost);
  };

  private addCloudHostRule = (rule: string): void => {
    this.setState({
      unsavedRules: this.state.unsavedRules.concat(rule)
    });
  };

  private removeCloudHostRules = (rules: string[]): void => {
    this.setState({
      unsavedRules: this.state.unsavedRules.filter(rule => !rules.includes(rule))
    });
  };

  private saveCloudHostRules = (cloudHost: ICloudHost): void => {
    const {unsavedRules} = this.state;
    if (unsavedRules.length) {
      postData(`hosts/cloud/${cloudHost.instanceId}/rules`, unsavedRules,
        () => this.onSaveRulesSuccess(cloudHost),
        (reason) => this.onSaveRulesFailure(cloudHost, reason));
    }
  };

  private onSaveRulesSuccess = (cloudHost: ICloudHost): void => {
    this.state.unsavedRules.forEach(rule => this.props.addCloudHostRule(cloudHost.instanceId, rule));
    if (this.mounted) {
      this.setState({ unsavedRules: [] });
    }
  };

  private onSaveRulesFailure = (cloudHost: ICloudHost, reason: string): void =>
    super.toast(`Unable to save rules of ${this.mounted ? `<b>${cloudHost.instanceId}</b>` : `<a href=/hosts/cloud/${cloudHost.instanceId}><b>${cloudHost.instanceId}</b></a>`} instance`, 10000, reason, true);

  private startStopTerminateButtons = (): ICustomButton[] => {
    const buttons: ICustomButton[] = [];
    const cloudHost = this.getCloudHost();
    const state = this.getCloudHost().state;
    if (state?.includes('stopped')) {
      buttons.push({
        button:
          <button className={`btn-flat btn-small waves-effect waves-light blue-text`}
                  onClick={this.startCloudHost}>
            Start
          </button>
      });
    }
    if (state?.includes('running')) {
      buttons.push({
        button:
          <button className={`btn-flat btn-small waves-effect waves-light blue-text`}
                  onClick={this.stopCloudHost}>
            Stop
          </button>
      });
    }
    if (!state?.includes('terminated') && !state?.includes('shutting_down')) {
      buttons.push({
        button:
          <button className='modal-trigger btn-flat btn-small waves-effect waves-light red-text'
                  data-target='terminate-cloudHost'>
            Terminate
          </button>,
        confirm: {
          id: 'terminate-cloudHost',
          message: `terminate instance ${cloudHost.instanceId}`,
          onClickConfirm: this.terminateCloudHost
        }
      });
    }
    return buttons;
  };

  private startCloudHost = () => {
    const cloudHost = this.getCloudHost();
    const url = `hosts/cloud/${cloudHost.instanceId}/state`;
    this.setState({ loading: { method: 'post', url: url } });
    postData(url, 'start',
      (reply: IReply<ICloudHost>) => this.onStartSuccess(reply.data),
      (reason) => this.onStartFailure(reason, cloudHost));
  };

  private onStartSuccess = (cloudHost: ICloudHost) => {
    super.toast(`<span class="green-text">Successfully started ${this.mounted ? `<b class="white-text">${cloudHost.instanceId}</b>` : `<a href=/hosts/cloud/${cloudHost.instanceId}><b>${cloudHost.instanceId}</b></a>`} instance</span>`, 15000);
    if (this.mounted) {
      this.updateCloudHost(cloudHost);
    }
  };

  private onStartFailure = (reason: string, cloudHost: Partial<ICloudHost>) => {
    super.toast(`Failed to start ${this.mounted ? `<b>${cloudHost.instanceId}</b>` : `<a href=/hosts/cloud/${cloudHost.instanceId}><b>${cloudHost.instanceId}</b></a>`} instance`, 10000, reason, true);
    if (this.mounted) {
      this.setState({loading: undefined});
    }
  };

  private stopCloudHost = () => {
    const cloudHost = this.getCloudHost();
    const url = `hosts/cloud/${cloudHost.instanceId}/state`;
    this.setState({ loading: { method: 'post', url: url } });
    postData(url, 'stop',
      (reply: IReply<ICloudHost>) => this.onStopSuccess(reply.data),
      (reason) => this.onStopFailure(reason, cloudHost));
  };

  private onStopSuccess = (cloudHost: ICloudHost) => {
    super.toast(`<span class="green-text">Successfully stopped ${this.mounted ? `<b class="white-text">${cloudHost.instanceId}</b>` : `<a href=/hosts/cloud/${cloudHost.instanceId}><b>${cloudHost.instanceId}</b></a>`} instance</span>`, 15000);
    if (this.mounted) {
      this.updateCloudHost(cloudHost);
    }
  };

  private onStopFailure = (reason: string, cloudHost: Partial<ICloudHost>) => {
    super.toast(`Failed to stop ${this.mounted ? `<b>${cloudHost.instanceId}</b>` : `<a href=/hosts/cloud/${cloudHost.instanceId}><b>${cloudHost.instanceId}</b></a>`} instance`, 10000, reason, true);
    if (this.mounted) {
      this.setState({loading: undefined});
    }
  };

  private terminateCloudHost = () => {
    const cloudHost = this.getCloudHost();
    const url = `hosts/cloud/${cloudHost.instanceId}`;
    this.setState({ loading: { method: 'delete', url: url } });
    deleteData(url,
      () => this.onTerminateSuccess(cloudHost),
      (reason) => this.onTerminateFailure(reason, cloudHost));
  };

  private onTerminateSuccess = (cloudHost: Partial<ICloudHost>) => {
    super.toast(`<span class="green-text">Successfully terminated <b class="white-text">${cloudHost.instanceId}</b> instance</span>`, 15000);
    if (this.mounted) {
      this.props.history.push('/hosts/cloud');
    }
  };

  private onTerminateFailure = (reason: string, cloudHost: Partial<ICloudHost>) => {
    super.toast(`Failed to terminate ${this.mounted ? `<b>${cloudHost.instanceId}</b>` : `<a href=/hosts/cloud/${cloudHost.instanceId}><b>${cloudHost.instanceId}</b></a>`} instance`, 10000, reason, true);
    if (this.mounted) {
      this.setState({loading: undefined});
    }
  };

  private updateCloudHost = (cloudHost: ICloudHost) => {
    //const previousCloudHost = this.getCloudHost();
    cloudHost = Object.values(normalize(cloudHost, Schemas.CLOUD_HOST).entities.cloudHosts || {})[0];
    //TODO this.props.updateCloudHost(previousCloudHost, cloudHost):
    const formCloudHost = { ...cloudHost };
    removeFields(formCloudHost);
    this.setState({cloudHost: cloudHost, formCloudHost: formCloudHost, loading: undefined});
  };

  private cloudHost = () => {
    const {isLoading, error} = this.props;
    const cloudHost = this.getCloudHost();
    const formCloudHost = this.getFormCloudHost();
    // @ts-ignore
    const cloudHostKey: (keyof ICloudHost) = formCloudHost && Object.keys(formCloudHost)[0];
    return (
      <>
        {isLoading && <ListLoadingSpinner/>}
        {!isLoading && error && <Error message={error}/>}
        {!isLoading && !error && formCloudHost && (
          <Form id={cloudHostKey}
                fields={{}}
                values={cloudHost}
                isNew={isNew(this.props.location.search)}
                showSaveButton={this.shouldShowSaveButton()}
                post={{
                  url: 'hosts/cloud',
                  textButton: 'launch',
                  successCallback: this.onPostSuccess,
                  failureCallback: this.onPostFailure
                }}
                customButtons={this.startStopTerminateButtons()}
                saveEntities={this.saveEntities}
                loading={this.state.loading}>
            {Object.keys(formCloudHost).map((key, index) =>
              <Field key={index}
                     id={key}
                     label={key}/>)}
          </Form>
        )}
      </>
    )
  };

  private rules = (): JSX.Element =>
    <CloudHostRuleList isLoadingCloudHost={this.props.isLoading}
                       loadCloudHostError={this.props.error}
                       cloudHost={this.getCloudHost()}
                       unsavedRules={this.state.unsavedRules}
                       onAddHostRule={this.addCloudHostRule}
                       onRemoveHostRules={this.removeCloudHostRules}/>;

  private genericRules = (): JSX.Element =>
    <GenericHostRuleList/>;

  private tabs = () => [
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
        {this.shouldShowSaveButton() && !isNew(this.props.location.search) && <UnsavedChanged/>}
        <div className="container">
          <Tabs {...this.props} tabs={this.tabs()}/>
        </div>
      </MainLayout>
    );
  }

}

function removeFields(cloudHost: Partial<ICloudHost>) {
  delete cloudHost["id"];
  delete cloudHost["hostRules"];
  if (!cloudHost.publicDnsName) {
    delete cloudHost["publicDnsName"];
  }
  if (!cloudHost.publicIpAddress) {
    delete cloudHost["publicIpAddress"];
  }
}

function mapStateToProps(state: ReduxState, props: Props): StateToProps {
  const isLoading = state.entities.hosts.cloud.isLoadingHosts;
  const error = state.entities.hosts.cloud.loadHostsError;
  const instanceId = props.match.params.instanceId;
  const cloudHost = isNew(props.location.search) ? buildNewCloudHost() : state.entities.hosts.cloud.data[instanceId];
  let formCloudHost;
  if (cloudHost) {
    formCloudHost = {...cloudHost};
    removeFields(formCloudHost);
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
  addCloudHost,
  addCloudHostRule
};

export default connect(mapStateToProps, mapDispatchToProps)(CloudHost);
