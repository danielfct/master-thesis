import {RouteComponentProps} from "react-router";
import BaseComponent from "../../components/BaseComponent";
import Form, {IFields, requiredAndNumberAndMin, requiredAndTrimmed} from "../../components/form/Form";
import ListLoadingSpinner from "../../components/list/ListLoadingSpinner";
import {Error} from "../../components/errors/Error";
import Field, {getTypeFromValue} from "../../components/form/Field";
import Tabs, {Tab} from "../../components/tabs/Tabs";
import MainLayout from "../../views/mainLayout/MainLayout";
import {ReduxState} from "../../reducers";
import {addNode, loadCloudHosts, loadEdgeHosts, loadNodes, loadRegions, updateNode} from "../../actions";
import {connect} from "react-redux";
import React from "react";
import {IRegion} from "../region/Region";
import {IEdgeHost} from "../hosts/edge/EdgeHost";
import {IReply} from "../../utils/api";
import {isNew} from "../../utils/router";
import {normalize} from "normalizr";
import {Schemas} from "../../middleware/api";
import {ICloudHost} from "../hosts/cloud/CloudHost";
import NodeLabelsList from "./NodeLabelList";

export interface INode {
  id: string;
  hostname: string;
  state: string;
  availability: string;
  role: string;
  version: number;
  labels: INodeLabel;
}

export interface INodeLabel {
  [key: string]: string
}

interface INewNodeHost {
  host?: string;
  role?: string;
}

interface INewNodeLocation {
  region?: IRegion,
  country?: string,
  city?: string,
  role?: string;
  quantity: number,
}

const buildNewNodeHost = (): INewNodeHost => ({
  host: undefined,
  role: undefined,
});

const buildNewNodeLocation = (): INewNodeLocation => ({
  region: undefined,
  country: undefined,
  city: undefined,
  role: undefined,
  quantity: 1,
});

interface StateToProps {
  isLoading: boolean;
  error?: string | null;
  newNodeHost?: INewNodeHost;
  newNodeLocation?: INewNodeLocation;
  node?: INode;
  formNode?: Partial<INode>;
  cloudHosts: { [key: string]: ICloudHost };
  edgeHosts: { [key: string]: IEdgeHost };
  regions: { [key: string]: IRegion };
  nodes: { [key: string]: INode };
}

interface DispatchToProps {
  loadNodes: (nodeId: string) => void;
  addNode: (node: INode) => void;
  updateNode: (previousNode: INode, currentNode: INode) => void;
  loadEdgeHosts: () => void;
  loadCloudHosts: () => void;
  loadRegions: () => void;
}

interface MatchParams {
  id: string;
}

type Props = StateToProps & DispatchToProps & RouteComponentProps<MatchParams>;

interface State {
  node?: INode,
  formNode?: INode,
  currentForm: 'On host' | 'On location',
}

class Node extends BaseComponent<Props, State> {

  state: State = {
    currentForm: 'On host'
  };

  private mounted = false;

  public componentDidMount(): void {
    this.loadNode();
    this.props.loadEdgeHosts();
    this.props.loadCloudHosts();
    this.props.loadRegions();
    this.mounted = true;
  };

  componentWillUnmount(): void {
    this.mounted = false;
  }

  private loadNode = () => {
    if (!isNew(this.props.location.search)) {
      const nodeId = this.props.match.params.id;
      this.props.loadNodes(nodeId);
    }
  };

  private getNode = () =>
    this.state.node || this.props.node;

  private getFormNode = () =>
    this.state.formNode || this.props.formNode;

  private isNew = () =>
    isNew(this.props.location.search);

  private onPostSuccess = (reply: IReply<INode[]>): void => {
    const nodes = reply.data;
    if (nodes.length == 1) {
      const node = nodes[0];
      super.toast(`<span class="green-text">Started node ${this.mounted ? `<b class="white-text">${node.id}</b>` : `<a href=/nodes/${node.id}><b>${node.id}</b></a>`} at ${node.hostname}</span>`);
      this.props.addNode(node);
      if (this.mounted) {
        this.updateNode(node);
        this.props.history.replace(node.id);
      }
    }
    else {
      super.toast(`<span class="green-text">Started nodes <b class="white-text">${nodes.map(node => `${node.hostname} => ${node.id}`)}</b></span>`);
      this.props.history.push("/nodes");
    }

  };

  private onPostFailure = (reason: string, place: INewNodeHost | INewNodeLocation): void => {
    let message;
    if ("host" in place && place.host) {
      message = `Unable to start node at ${place.host}`;
    }
    else if ("city" in place) {
      message = `Unable to start node at ${place.city}`;
    }
    else {
      message = `Unable to start node`;
    }
    super.toast(message, 10000, reason, true);
  };



  private onPutSuccess = (reply: IReply<INode>): void => {
    const node = reply.data;
    const previousRole = this.getNode()?.role.toLowerCase();
    super.toast(`<span class="green-text">Node ${this.mounted ? `<b class="white-text">${node.id}</b>` : `<a href=/nodes/${node.id}><b>${node.id}</b></a>`} has been ${previousRole === 'manager' ? 'demoted' : 'promoted'} to ${node.role}</span>`);
    const previousNode = this.getNode();
    if (previousNode?.id) {
      this.props.updateNode(previousNode as INode, node)
    }
    if (this.mounted) {
      this.updateNode(node);
      this.props.history.replace(node.id);
    }
  };

  private onPutFailure = (reason: string, node: INode): void =>
    super.toast(`Unable to change role of node ${this.mounted ? `<b>${node.id}</b>` : `<a href=/nodes/${node.id}><b>${node.id}</b></a>`}`, 10000, reason, true);

  private onDeleteSuccess = (node: INode): void => {
    super.toast(`<span class="green-text">Node <b class="white-text">${node.id}</b> successfully removed</span>`);
    if (this.mounted) {
      this.props.history.push(`/nodes`);
    }
  };

  private onDeleteFailure = (reason: string, node: INode): void =>
    super.toast(`Unable to stop ${this.mounted ? `<b>${node.id}</b>` : `<a href=/nodes/${node.id}><b>${node.id}</b></a>`} node`, 10000, reason, true);

  private updateNode = (node: INode) => {
    node = Object.values(normalize(node, Schemas.NODE).entities.nodes || {})[0];
    const formNode = { ...node };
    removeFields(formNode);
    this.setState({node: node, formNode: formNode});
  };

  private getFields = (node: INewNodeHost | INewNodeLocation | INode): IFields =>
    Object.entries(node).map(([key, value]) => {
      return {
        [key]: {
          id: key,
          label: key,
          validation: getTypeFromValue(value) === 'number'
            ? { rule: requiredAndNumberAndMin, args: 1 }
            : { rule: requiredAndTrimmed }
        }
      };
    }).reduce((fields, field) => {
      for (let key in field) {
        fields[key] = field[key];
      }
      return fields;
    }, {});

  private getSelectableHosts = () => {
    const nodesHostname = Object.values(this.props.nodes).map(node => node.hostname);
    const cloudHosts = Object.values(this.props.cloudHosts)
                             .filter(instance => !nodesHostname.includes(instance.publicIpAddress))
                             .map(instance => instance.instanceId);
    const edgeHosts = Object.entries(this.props.edgeHosts)
                            .filter(([_, edgeHost]) => !nodesHostname.includes(edgeHost.privateIpAddress))
                            .map(([hostname, _]) => hostname);
    return cloudHosts.concat(edgeHosts);
  };

  private regionDropdownOption = (region: IRegion) =>
    region.name;

  private formFields = (isNew: boolean) => {
    const formNode = this.getFormNode();
    const {currentForm} = this.state;
    return (
      isNew ?
        currentForm === 'On host'
          ?
          <>
            <Field<string> key={'host'}
                           id={'host'}
                           label={'host'}
                           type="dropdown"
                           dropdown={{
                             defaultValue: "Select host",
                             values: this.getSelectableHosts()
                           }}/>
            <Field key={'role'}
                   id={'role'}
                   label={'role'}
                   type="dropdown"
                   dropdown={{
                     defaultValue: "Select role",
                     values: ['MANAGER', 'WORKER']
                   }}/>
          </>
          :
          <>
            <Field<IRegion> key={'region'}
                            id={'region'}
                            label={'region'}
                            type="dropdown"
                            dropdown={{
                              defaultValue: "Select region",
                              values: Object.values(this.props.regions),
                              optionToString: this.regionDropdownOption
                            }}/>
            <Field key={'country'}
                   id={'country'}
                   label={'country'}/>
            <Field key={'city'}
                   id={'city'}
                   label={'city'}/>
            <Field key={'role'}
                   id={'role'}
                   label={'role'}
                   type="dropdown"
                   dropdown={{
                     defaultValue: "Select role",
                     values: ['MANAGER', 'WORKER']
                   }}/>
            <Field key={'quantity'}
                   id={'quantity'}
                   label={'quantity'}
                   type={"number"}/>
          </>
        :
        formNode && Object.entries(formNode).map(([key, value], index) =>
                   key === 'role'
                     ? <Field key={'role'}
                              id={'role'}
                              label={'role'}
                              type="dropdown"
                              dropdown={{
                                defaultValue: "Select role",
                                values: ['MANAGER', 'WORKER']
                              }}/>
                     : <Field key={index}
                              id={key}
                              label={key}
                              disabled={true}/>)
    );
  };

  private switchForm = (formId: 'On host' | 'On location') =>
    this.setState({currentForm: formId});

  private node = () => {
    const {isLoading, error, newNodeHost, newNodeLocation} = this.props;
    const {currentForm} = this.state;
    const isNewNode = this.isNew();
    const node = isNewNode ? (currentForm === 'On host' ? newNodeHost : newNodeLocation) : this.getNode();
    // @ts-ignore
    const nodeKey: (keyof INode) = node && Object.keys(node)[0];
    return (
      <>
        {!isNewNode && isLoading && <ListLoadingSpinner/>}
        {!isNewNode && !isLoading && error && <Error message={error}/>}
        {(isNewNode || !isLoading) && (isNewNode || !error) && node && (
          <Form id={nodeKey}
                fields={this.getFields(node)}
                values={node}
                isNew={isNewNode}
                post={{
                  textButton: isNewNode ? 'Join swarm' : 'Save',
                  url: 'nodes',
                  successCallback: this.onPostSuccess,
                  failureCallback: this.onPostFailure
                }}
                put={{
                  url: `nodes/${(node as INode).id}`,
                  successCallback: this.onPutSuccess,
                  failureCallback: this.onPutFailure
                }}
            // delete button is never present on new nodes, so a type cast is safe
                delete={{
                  textButton: 'Leave swarm',
                  url: `nodes/${(node as INode).id}`,
                  successCallback: this.onDeleteSuccess,
                  failureCallback: this.onDeleteFailure}}
                switchDropdown={isNewNode ? {options: ['On host', 'On location'], onSwitch: this.switchForm} : undefined}>
            {this.formFields(isNewNode)}
          </Form>
        )}
      </>
    )
  };

  private labels = (): JSX.Element =>
    <NodeLabelsList isLoadingNode={this.props.isLoading}
                    loadNodeError={!this.isNew() ? this.props.error : undefined}
                    node={this.getNode()}/>;

  private tabs = (): Tab[] => ([
    {
      title: 'Node',
      id: 'newNode',
      content: () => this.node(),
      hidden: !this.isNew()
    },
    {
      title: 'Node',
      id: 'node',
      content: () => this.node(),
      hidden: this.isNew()
    },
    {
      title: 'Labels',
      id: 'nodeLabels',
      content: () => this.labels(),
      hidden: this.isNew()
    }
  ]);

  public render() {
    return (
      <MainLayout>
        <div className="container">
          <Tabs {...this.props} tabs={this.tabs()}/>
        </div>
      </MainLayout>
    );
  }

}


function removeFields(node: Partial<INode>) {
  if (node) {
    delete node["labels"];
  }
}

function mapStateToProps(state: ReduxState, props: Props): StateToProps {
  const isLoading = state.entities.nodes.isLoadingNodes;
  const error = state.entities.nodes.loadNodesError;
  const id = props.match.params.id;
  const newNodeHost = isNew(props.location.search) ? buildNewNodeHost() : undefined;
  const newNodeLocation = isNew(props.location.search) ? buildNewNodeLocation() : undefined;
  const node = !isNew(props.location.search) ? state.entities.nodes.data[id] : undefined;
  let formNode;
  if (node) {
    formNode = { ...node };
    removeFields(formNode);
  }
  const nodes = state.entities.nodes.data;
  const cloudHosts = state.entities.hosts.cloud.data;
  const edgeHosts = state.entities.hosts.edge.data;
  const regions = state.entities.regions.data;
  return  {
    isLoading,
    error,
    newNodeHost,
    newNodeLocation,
    node,
    formNode,
    nodes,
    cloudHosts,
    edgeHosts,
    regions
  }
}

const mapDispatchToProps: DispatchToProps = {
  loadNodes,
  addNode,
  updateNode,
  loadCloudHosts,
  loadEdgeHosts,
  loadRegions,
};

export default connect(mapStateToProps, mapDispatchToProps)(Node);