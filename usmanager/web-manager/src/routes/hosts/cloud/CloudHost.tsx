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
import BaseComponent from "../../../components/BaseComponent";
import Form, {IFields, required} from "../../../components/form/Form";
import LoadingSpinner from "../../../components/list/LoadingSpinner";
import Error from "../../../components/errors/Error";
import Field from "../../../components/form/Field";
import Tabs, {Tab} from "../../../components/tabs/Tabs";
import MainLayout from "../../../views/mainLayout/MainLayout";
import {ReduxState} from "../../../reducers";
import {loadCloudHosts} from "../../../actions";
import {connect} from "react-redux";
import React from "react";

export interface ICloudHost {
  instanceId: string;
  imageId: string;
  instanceType: string;
  state: { code: number, name: string }
  publicDnsName: string;
  publicIpAddress: string;
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
}

interface DispatchToProps {
  loadCloudHosts: (instanceId: string) => any;
}

interface MatchParams {
  instanceId: string;
}

type Props = StateToProps & DispatchToProps & RouteComponentProps<MatchParams>;

class CloudHost extends BaseComponent<Props, {}> {

  componentDidMount(): void {
    const cloudHostInstanceId = this.props.match.params.instanceId;
    if (cloudHostInstanceId && !isNewHost(cloudHostInstanceId)) {
      this.props.loadCloudHosts(cloudHostInstanceId);
    }
  };

  private onPostSuccess = (reply: any, cloudHostInstanceId: string): void => {
    super.toast(`Cloud host <b>${cloudHostInstanceId}</b> has now started`);
  };

  private onPostFailure = (reason: string, cloudHostInstanceId: string): void =>
    super.toast(`Unable to save ${cloudHostInstanceId}`, 10000, reason, true);

  private onDeleteSuccess = (cloudHostInstanceId: string): void => {
    super.toast(`Cloud host <b>${cloudHostInstanceId}</b> successfully stopped`);
    this.props.history.push(`/hosts`)
  };

  private onDeleteFailure = (reason: string, cloudHostInstanceId: string): void =>
    super.toast(`Unable to stop cloud host ${cloudHostInstanceId}`, 10000, reason, true);

  private getFields = (): IFields =>
    Object.entries(emptyCloudHost()).map(([key, _]) => {
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
    const {isLoading, error, cloudHost} = this.props;
    // @ts-ignore
    const cloudHostKey: (keyof ICloudHost) = cloudHost && Object.keys(cloudHost)[0];
    return (
      <>
        {isLoading && <LoadingSpinner/>}
        {!isLoading && error && <Error message={error}/>}
        {!isLoading && !error && cloudHost && (
          <Form id={cloudHostKey}
                fields={this.getFields()}
                values={cloudHost}
                isNew={isNewHost(this.props.match.params.instanceId)}
                post={{url: 'hosts/cloud', successCallback: this.onPostSuccess, failureCallback: this.onPostFailure}}
                delete={{url: `hosts/cloud/${cloudHost[cloudHostKey]}`, successCallback: this.onDeleteSuccess, failureCallback: this.onDeleteFailure}}
                editable={false}>
            {/*//TODO instanceType dropdown?*/}
            {Object.keys(cloudHost).map((key, index) =>
              <Field key={index}
                     id={key}
                     label={key}/>
            )}
          </Form>
        )}
      </>
    )
  };

  private rules = (): JSX.Element =>
    <></>; //TODO

  private tabs: Tab[] = [
    {
      title: 'Cloud host',
      id: 'cloudHost',
      content: () => this.details()
    },
    {
      title: 'Rules',
      id: 'rules',
      content: () => this.rules()
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
  const isLoading = state.entities.hosts.cloud.isLoadingHosts;
  const error = state.entities.hosts.cloud.loadHostsError;
  const instanceId = props.match.params.instanceId;
  const cloudHost = isNewHost(instanceId) ? emptyCloudHost() : state.entities.hosts.cloud.data[instanceId];
  return  {
    isLoading,
    error,
    cloudHost,
  }
}

const mapDispatchToProps: DispatchToProps = {
  loadCloudHosts,
};

export default connect(mapStateToProps, mapDispatchToProps)(CloudHost);