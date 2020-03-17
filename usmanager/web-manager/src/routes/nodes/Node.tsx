import IData from "../../components/IData";
import {RouteComponentProps} from "react-router";
import BaseComponent from "../../components/BaseComponent";
import Form, {IFields, required, requiredAndNumberAndMin} from "../../components/form/Form";
import LoadingSpinner from "../../components/list/LoadingSpinner";
import Error from "../../components/errors/Error";
import Field, {getTypeFromValue} from "../../components/form/Field";
import Tabs, {Tab} from "../../components/tabs/Tabs";
import MainLayout from "../../views/mainLayout/MainLayout";
import {ReduxState} from "../../reducers";
import {loadNodes} from "../../actions";
import {connect} from "react-redux";
import React from "react";

export interface INode extends IData {
  hostname: string;
  state: string;
  role: string;
}

const emptyNode = () => ({
  region: '',
  country: '',
  city: '',
  hostname: '',
  quantity: 1
});

const isNewNode = (name: string) =>
  name === 'new_node';

interface StateToProps {
  isLoading: boolean;
  error?: string | null;
  node: Partial<INode>;
}

interface DispatchToProps {
  loadNodes: (name: string) => any;
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
  };

  private onPostSuccess = (reply: any, nodeId: string): void => {
    super.toast(`Node <b>${nodeId}</b> has now started`);
  };

  private onPostFailure = (reason: string, nodeId: string): void =>
    super.toast(`Unable to save ${nodeId}`, 10000, reason, true);

  private onPutSuccess = (nodeId: string): void => {
    super.toast(`Changes to node <b>${nodeId}</b> are now saved`);
  };

  private onPutFailure = (reason: string, nodeId: string): void =>
    super.toast(`Unable to update ${nodeId}`, 10000, reason, true);

  private onDeleteSuccess = (nodeId: string): void => {
    super.toast(`Node <b>${nodeId}</b> successfully stopped`);
    this.props.history.push(`/nodes`)
  };

  private onDeleteFailure = (reason: string, nodeId: string): void =>
    super.toast(`Unable to stop ${nodeId}`, 10000, reason, true);

  private getFields = (): IFields =>
    Object.entries(emptyNode()).map(([key, value]) => {
      return {
        [key]: {
          id: [key],
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

  private getSelectableHostnames = () =>
    ['127.0.0.1']; //TODO load hostnames

  private getSelectableRoles = () =>
    ['MANAGER', 'WORKER'];

  private getSelectableRegions = () =>
    []; //TODO

  private getSelectableCountries = () =>
    []; //TODO

  private getSelectableCities = () =>
    []; //TODO

  private formFields = (node: Partial<INode>, isNew: boolean): JSX.Element => {
    return (
      isNew ?
        <>
          <Field key={'region'}
                 id={['region']}
                 label={'region'}
                 type="dropdown"
                 dropdown={{defaultValue: "Select region", values: this.getSelectableRegions()}}/>
          <Field key={'country'}
                 id={['country']}
                 label={'country'}
                 type="dropdown"
                 dropdown={{defaultValue: "Select country", values: this.getSelectableCountries()}}/>
          <Field key={'city'}
                 id={['city']}
                 label={'city'}
                 type="dropdown"
                 dropdown={{defaultValue: "Select city", values: this.getSelectableCities()}}/>
          <Field key={'hostname'}
                 id={['hostname']}
                 label={'hostname'}
                 type="dropdown"
                 dropdown={{defaultValue: "Select hostname", values: this.getSelectableHostnames()}}/>
          {/*<Field key={'role'}
               id={'role'}
               label={'role'}
               type="dropdown"
               dropdown={{defaultValue: "Select role", values: this.getSelectableRoles()}}/>*/}
          <Field key={'quantity'}
                 id={['quantity']}
                 label={'quantity'}
                 type={"numberbox"}/>
        </>
        :
        <>
          {Object.entries(node).map(([key, value], index) =>
            <Field key={index}
                   id={[key]}
                   label={key}/>)}
        </>
    )
  };

  private details = () => {
    const {isLoading, error, node} = this.props;
    // @ts-ignore
    const nodeKey: (keyof INode) = node && Object.keys(node)[0];
    const isNew = isNewNode(this.props.match.params.id);
    return (
      <>
        {isLoading && <LoadingSpinner/>}
        {!isLoading && error && <Error message={error}/>}
        {!isLoading && !error && node && (
          <Form id={nodeKey}
                fields={this.getFields()}
                values={node}
                isNew={isNew}
                post={{url: 'nodes', successCallback: this.onPostSuccess, failureCallback: this.onPostFailure}}
                put={{url: `nodes/${node[nodeKey]}`, successCallback: this.onPutSuccess, failureCallback: this.onPutFailure}}
                delete={{url: `nodes/${node[nodeKey]}`, successCallback: this.onDeleteSuccess, failureCallback: this.onDeleteFailure}}
                editable={false}
                deletable={node.role !== 'MANAGER'}>
            {this.formFields(node, isNew)}
          </Form>
        )}
      </>
    )
  };

  private tabs: Tab[] = [
    {
      title: 'Node',
      id: 'node',
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
  const isLoading = state.entities.nodes?.isLoading;
  const error = state.entities.nodes?.error;
  const id = props.match.params.id;
  const node = isNewNode(id) ? emptyNode() : state.entities.nodes.data[id];
  return  {
    isLoading,
    error,
    node,
  }
}

const mapDispatchToProps: DispatchToProps = {
  loadNodes,
};

export default connect(mapStateToProps, mapDispatchToProps)(Node);