import {RouteComponentProps} from "react-router";
import BaseComponent from "../../components/BaseComponent";
import Form, {IFields, requiredAndNumberAndMin, requiredAndTrimmed} from "../../components/form/Form";
import ListLoadingSpinner from "../../components/list/ListLoadingSpinner";
import {Error} from "../../components/errors/Error";
import Field, {getTypeFromValue} from "../../components/form/Field";
import Tabs from "../../components/tabs/Tabs";
import MainLayout from "../../views/mainLayout/MainLayout";
import {ReduxState} from "../../reducers";
import {addNode, loadCloudHosts, loadEdgeHosts, loadNodes, loadRegions} from "../../actions";
import {connect} from "react-redux";
import React from "react";
import {IRegion} from "../region/Region";
import {IEdgeHost} from "../hosts/edge/EdgeHost";
import {IReply} from "../../utils/api";
import {isNew} from "../../utils/router";
import {normalize} from "normalizr";
import {Schemas} from "../../middleware/api";
import {awsInstanceStates, ICloudHost} from "../hosts/cloud/CloudHost";

export interface INode {
  id: string;
  hostname: string;
  state: string;
  role: string;
}

interface INewNodeHost {
  hostname?: string;
  quantity: number;
}

interface INewNodeLocation {
  region?: IRegion,
  country?: string,
  city?: string,
  quantity: number,
}

const buildNewNodeHost = (): INewNodeHost => ({
  hostname: undefined,
  quantity: 1,
});

const buildNewNodeLocation = (): INewNodeLocation => ({
  region: undefined,
  country: undefined,
  city: undefined,
  quantity: 1,
});

interface StateToProps {
  isLoading: boolean;
  error?: string | null;
  newNodeHost?: INewNodeHost;
  newNodeLocation?: INewNodeLocation;
  node?: INode;
  edgeHosts: { [key: string]: IEdgeHost };
  cloudHosts: { [key: string]: ICloudHost };
  regions: { [key: string]: IRegion };
  nodes: { [key: string]: INode };
}

interface DispatchToProps {
  loadNodes: () => void;
  addNode: (node: INode) => void;
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
    this.props.loadNodes();
  };

  private getNode = () =>
    this.state.node || this.props.node;

  private isNew = () =>
    isNew(this.props.location.search);

  private onPostSuccess = (reply: IReply<INode>): void => {
    const node = reply.data;
    super.toast(`<span class="green-text">Started node ${this.mounted ? `<b class="white-text">${node.id}</b>` : `<a href=/nodes/${node.id}><b>${node.id}</b></a>`} at ${node.hostname}</span>`);
    this.props.addNode(node);
    if (this.mounted) {
      this.updateNode(node);
      this.props.history.replace(node.id);
    }
  };

  private onPostFailure = (reason: string, place: INewNodeHost | INewNodeLocation): void => {
    console.log(place)
    let message;
    if ("hostname" in place && place.hostname) {
      message = `Unable to start node at ${place.hostname}`;
    }
    else if ("city" in place) {
      message = `Unable to start node at ${place.city}`;
    }
    else {
      message = `Unable to start node`;
    }
    super.toast(message, 10000, reason, true);
  };

  private onDeleteSuccess = (node: INode): void => {
    super.toast(`<span class="green-text">Node ${this.mounted ? `<b class="white-text">${node.id}</b>` : `<a href=/nodes/${node.id}><b>${node.id}</b></a>`} successfully stopped</span>`);
    if (this.mounted) {
      this.props.history.push(`/nodes`);
    }
  };

  private onDeleteFailure = (reason: string, node: INode): void =>
    super.toast(`Unable to stop ${this.mounted ? `<b>${node.id}</b>` : `<a href=/nodes/${node.id}><b>${node.id}</b></a>`} node`, 10000, reason, true);

  private updateNode = (node: INode) => {
    node = Object.values(normalize(node, Schemas.NODE).entities.nodes || {})[0];
    this.setState({node: node});
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
    const nodesHostnames = Object.values(this.props.nodes).map(node => node.hostname);
    const cloudHosts = Object.values(this.props.cloudHosts)
                             .filter(instance => instance.state.code === awsInstanceStates.RUNNING.code
                                                 && !nodesHostnames.includes(instance.publicIpAddress))
                             .map(instance => instance.publicIpAddress);
    const edgeHosts = Object.keys(this.props.edgeHosts).filter(edgeHost => !nodesHostnames.includes(edgeHost));
    return cloudHosts.concat(edgeHosts);
  };

  private regionDropdownOption = (region: IRegion) =>
    region.name;

  private formFields = (isNew: boolean) => {
    const node = this.getNode();
    const {currentForm} = this.state;
    return (
      isNew ?
        currentForm === 'On host'
          ?
          <>
            <Field<string> key={'hostname'}
                           id={'hostname'}
                           label={'hostname'}
                           type="dropdown"
                           dropdown={{
                             defaultValue: "Select host",
                             values: this.getSelectableHosts()
                           }}/>
            {/*<Field key={'role'}
             id={'role'}
             label={'role'}
             type="dropdown"
             dropdown={{
               defaultValue: "Select role",
               values: ['MANAGER', 'WORKER']
             }}/>*/}
            <Field key={'quantity'}
                   id={'quantity'}
                   label={'quantity'}
                   type={"number"}/>
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
            <Field key={'quantity'}
                   id={'quantity'}
                   label={'quantity'}
                   type={"number"}/>
          </>
        :
        node && Object.entries(node).map(([key, value], index) =>
               <Field key={index}
                      id={key}
                      label={key}/>)
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
                  textButton: 'Start',
                  url: 'nodes',
                  successCallback: this.onPostSuccess,
                  failureCallback: this.onPostFailure
                }}
                // delete button is never present on new nodes, so a type cast is safe
                delete={(node as INode).role !== 'MANAGER'
                  ? {textButton: 'Remove',
                    url: `nodes/${(node as INode).id}`,
                    successCallback: this.onDeleteSuccess,
                    failureCallback: this.onDeleteFailure}
                  : undefined}
                switchDropdown={isNewNode ? {options: ['On host', 'On location'], onSwitch: this.switchForm} : undefined}>
            {this.formFields(isNewNode)}
          </Form>
        )}
      </>
    )
  };

  private tabs = () =>
    [{
      title: 'Node',
      id: 'node',
      content: () => this.node()
    }];

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


function mapStateToProps(state: ReduxState, props: Props): StateToProps {
  const isLoading = state.entities.nodes.isLoadingNodes;
  const error = state.entities.nodes.loadNodesError;
  const id = props.match.params.id;
  const newNodeHost = isNew(props.location.search) ? buildNewNodeHost() : undefined;
  const newNodeLocation = isNew(props.location.search) ? buildNewNodeLocation() : undefined;
  const node = !isNew(props.location.search) ? state.entities.nodes.data[id] : undefined;
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
    nodes,
    cloudHosts,
    edgeHosts,
    regions
  }
}

const mapDispatchToProps: DispatchToProps = {
  loadNodes,
  addNode,
  loadEdgeHosts,
  loadCloudHosts,
  loadRegions,
};

export default connect(mapStateToProps, mapDispatchToProps)(Node);