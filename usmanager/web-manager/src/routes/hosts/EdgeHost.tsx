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
import {loadEdgeHosts} from "../../actions";
import {connect} from "react-redux";
import React from "react";

export interface IEdgeHost extends IData {
  hostname: string;
  sshUsername: string;
  sshPassword: string;
  region: string;
  country: string;
  city: string;
  local: boolean;
}

const emptyEdgeHost = (): Partial<IEdgeHost> => ({
  hostname: '',
  sshUsername: '',
  sshPassword: '',
  region: '',
  country: '',
  city: '',
  local: false,
});

const isNewHost = (edgeHostHostname: string) =>
  edgeHostHostname === 'new_host';

interface StateToProps {
  isLoading: boolean;
  error?: string | null;
  edgeHost: Partial<IEdgeHost>;
}

interface DispatchToProps {
  loadEdgeHosts: (hostname: string) => any;
}

interface MatchParams {
  hostname: string;
}

type Props = StateToProps & DispatchToProps & RouteComponentProps<MatchParams>;

class EdgeHost extends BaseComponent<Props, {}> {

  componentDidMount(): void {
    const edgeHostHostname = this.props.match.params.hostname;
    if (edgeHostHostname && !isNewHost(edgeHostHostname)) {
      this.props.loadEdgeHosts(edgeHostHostname);
    }
  };

  private onPostSuccess = (reply: any, edgeHostHostname: string): void => {
    super.toast(`Edge host <b>${edgeHostHostname}</b> is now saved`);
  };

  private onPostFailure = (reason: string, edgeHostHostname: string): void =>
    super.toast(`Unable to save ${edgeHostHostname}`, 10000, reason, true);

  private onDeleteSuccess = (edgeHostHostname: string): void => {
    super.toast(`Edge host <b>${edgeHostHostname}</b> successfully removed`);
    this.props.history.push(`/hosts`)
  };

  private onDeleteFailure = (reason: string, edgeHostHostname: string): void =>
    super.toast(`Unable to remove edge host ${edgeHostHostname}`, 10000, reason, true);

  private getFields = (): IFields =>
    Object.entries(emptyEdgeHost()).map(([key, value]) => {
      return {
        [key]: {
          id: [key],
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
    const {isLoading, error, edgeHost} = this.props;
    // @ts-ignore
    const edgeHostKey: (keyof IEdgeHost) = edgeHost && Object.keys(edgeHost)[0];
    console.log(edgeHost)
    return (
      <>
        {isLoading && <LoadingSpinner/>}
        {!isLoading && error && <Error message={error}/>}
        {!isLoading && !error && edgeHost && (
          <Form id={edgeHostKey}
                fields={this.getFields()}
                values={edgeHost}
                isNew={isNewHost(this.props.match.params.hostname)}
                post={{url: 'hosts/edge', successCallback: this.onPostSuccess, failureCallback: this.onPostFailure}}
                delete={{url: `hosts/edge/${edgeHost[edgeHostKey]}`, successCallback: this.onDeleteSuccess, failureCallback: this.onDeleteFailure}}>
            {Object.keys(edgeHost).map((key, index) =>
              key === 'local'
                ? <Field key={index}
                         id={[key]}
                         type="dropdown"
                         label={key}
                         dropdown={{defaultValue: "Is a local machine?", values: ["True", "False"]}}/>
                : <Field key={index}
                         id={[key]}
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
      title: 'Edge host',
      id: 'edgeHost',
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
  const isLoading = state.entities.hosts.edge.isLoading;
  const error = state.entities.hosts.edge.error;
  const hostname = props.match.params.hostname;
  const edgeHost = isNewHost(hostname) ? emptyEdgeHost() : state.entities.hosts.edge.data[hostname];
  const partialEdgeHost = { ...edgeHost};
  delete partialEdgeHost["id"];
  //TODO fix local
  return  {
    isLoading,
    error,
    edgeHost: partialEdgeHost,
  }
}

const mapDispatchToProps: DispatchToProps = {
  loadEdgeHosts,
};

export default connect(mapStateToProps, mapDispatchToProps)(EdgeHost);