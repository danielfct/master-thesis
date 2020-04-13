import IData from "../../components/IData";
import {RouteComponentProps} from "react-router";
import BaseComponent from "../../components/BaseComponent";
import Form, {IFields, required, requiredAndNumberAndMin} from "../../components/form/Form";
import ListLoadingSpinner from "../../components/list/ListLoadingSpinner";
import Error from "../../components/errors/Error";
import Field, {getTypeFromValue} from "../../components/form/Field";
import Tabs, {Tab} from "../../components/tabs/Tabs";
import MainLayout from "../../views/mainLayout/MainLayout";
import {ReduxState} from "../../reducers";
import {loadCloudHosts, loadEdgeHosts, loadNodes, loadRegions} from "../../actions";
import {connect} from "react-redux";
import React from "react";
import {IRegion} from "../region/Region";
import {IEdgeHost} from "../hosts/edge/EdgeHost";

export interface INode extends IData {
  hostname: string;
  state: string;
  role: string;
}

const emptyNodeHost = () => ({
  hostname: '',
  quantity: 1
});

const emptyNodeLocation = () => ({
  region: '',
  country: '',
  city: '',
  quantity: 1
});

const isNewNode = (name: string) =>
  name === 'new_node';

interface StateToProps {
  isLoading: boolean;
  error?: string | null;
  node?: INode;
  nodeHost: any;
  nodeLocation: any;
  hosts: IEdgeHost[];
  regions: IRegion[];
}

interface DispatchToProps {
  loadNodes: (name: string) => any;
  loadEdgeHosts: () => any;
  loadCloudHosts: () => any;
  loadRegions: () => any;
}

interface MatchParams {
  id: string;
}

type Props = StateToProps & DispatchToProps & RouteComponentProps<MatchParams>;

class Node extends BaseComponent<Props, {}> {

  componentDidMount(): void {
    const nodeId = this.props.match.params.id;
    if (nodeId && !isNewNode(nodeId)) {
      this.props.loadNodes(nodeId);
    }
    this.props.loadEdgeHosts();
    this.props.loadCloudHosts();
    this.props.loadRegions();
  };

  private onPostSuccess = (reply: any, nodeId: string): void => {
    super.toast(`Setup at <b>${nodeId}</b> is done`);
  };

  private onPostFailure = (reason: string, nodeId: string | IRegion): void => {
    if (typeof nodeId === "string") {
      super.toast(`Unable to start node on ${nodeId}`, 10000, reason, true);
    }
    else {
      super.toast(`Unable to start node at ${nodeId.name}`, 10000, reason, true);
    }
  };

  private onDeleteSuccess = (nodeId: string): void => {
    super.toast(`Node <b>${nodeId}</b> successfully stopped`);
    this.props.history.push(`/nodes`)
  };

  private onDeleteFailure = (reason: string, nodeId: string): void =>
    super.toast(`Unable to stop ${nodeId}`, 10000, reason, true);

  private getFields = (node: INode): IFields =>
    Object.entries(node).map(([key, value]) => {
      return {
        [key]: {
          id: key,
          label: key,
          validation: getTypeFromValue(value) === 'number'
            ? { rule: requiredAndNumberAndMin, args: 1 }
            : { rule: required }
        }
      };
    }).reduce((fields, field) => {
      for (let key in field) {
        fields[key] = field[key];
      }
      return fields;
    }, {});

  private formFields = (): JSX.Element => {
    const {node} = this.props;
    return (
      <>
        {node && Object.entries(node).map(([key, value], index) =>
          <Field key={index}
                 id={key}
                 label={key}/>)}
      </>
    );
  };

  private getSelectableRoles = () =>
    ['MANAGER', 'WORKER'];

  private hostnameDropdownOption = (hostname: string) =>
    hostname;

  private formFieldsHost = (): JSX.Element =>
    <>
      <Field<string> key={'hostname'}
                     id={'hostname'}
                     label={'hostname'}
                     type="dropdown"
                     dropdown={{
                       defaultValue: "Select host",
                       values: this.props.hosts.map(host => host.hostname),
                       optionToString: this.hostnameDropdownOption
                     }}/>
      {/*<Field key={'role'}
               id={'role'}
               label={'role'}
               type="dropdown"
               dropdown={{defaultValue: "Select role", values: this.getSelectableRoles()}}/>*/}
      <Field key={'quantity'}
             id={'quantity'}
             label={'quantity'}
             type={"numberbox"}/>
    </>;

  private regionDropdownOption = (region: IRegion) =>
    region.name;

  private formFieldsLocation = (): JSX.Element =>
    <>
      <Field<IRegion> key={'region'}
                      id={'region'}
                      label={'region'}
                      type="dropdown"
                      dropdown={{
                        defaultValue: "Select region",
                        values: this.props.regions,
                        optionToString: this.regionDropdownOption
                      }}/>
      <Field key={'country'}
             id={'country'}
             label={'country'}/>
      <Field key={'city'}
             id={'city'}
             label={'city'}/>
    </>;

  //TODO put={{url: `conditions/${this.state.nodeName || condition[conditionKey]}` on every class

  private details = (node: any, formFields: JSX.Element) => {
    const {isLoading, error} = this.props;
    // @ts-ignore
    const nodeKey: (keyof INode) = Object.keys(node)[0];
    const isNew = isNewNode(this.props.match.params.id);
    return (
      <>
        {isLoading && <ListLoadingSpinner/>}
        {!isLoading && error && <Error message={error}/>}
        {!isLoading && !error && node && (
          <Form id={nodeKey}
                fields={this.getFields(node)}
                values={node}
                isNew={isNew}
                post={{url: 'nodes', successCallback: this.onPostSuccess, failureCallback: this.onPostFailure}}
                delete={{url: `nodes/${node[nodeKey]}`, successCallback: this.onDeleteSuccess, failureCallback: this.onDeleteFailure}}
                editable={false}
                deletable={node.role !== 'MANAGER'}>
            {formFields}
          </Form>
        )}
      </>
    )
  };

  private tabs: Tab[] =
    isNewNode(this.props.match.params.id)
      ? [
        {
          title: 'Host',
          id: 'nodeOnHost',
          content: () => this.details(this.props.nodeHost, this.formFieldsHost())
        },
        {
          title: 'Location',
          id: 'nodeUsingLocation',
          content: () => this.details(this.props.nodeLocation, this.formFieldsLocation())
        }
      ]
      : [
        {
          title: 'Node',
          id: 'node',
          content: () => this.details(this.props.node, this.formFields())
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
  const isLoading = state.entities.nodes.isLoadingNodes;
  const error = state.entities.nodes.loadNodesError;
  const id = props.match.params.id;
  const node = isNewNode(id) ? undefined : state.entities.nodes.data[id];
  const nodeHost = emptyNodeHost();
  const nodeLocation = emptyNodeLocation();
  //TODO cloud too
  const hosts = state.entities.hosts.edge.data && Object.values(state.entities.hosts.edge.data);
  const regions = state.entities.regions.data && Object.values(state.entities.regions.data);
  return  {
    isLoading,
    error,
    node,
    nodeHost,
    nodeLocation,
    hosts,
    regions
  }
}

const mapDispatchToProps: DispatchToProps = {
  loadNodes,
  loadEdgeHosts,
  loadCloudHosts,
  loadRegions,
};

export default connect(mapStateToProps, mapDispatchToProps)(Node);