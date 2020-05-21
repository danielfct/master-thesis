/*
 * Copyright (c) 2020 usmanager
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

/*
 * Copyright (c) 2020 usmanager
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import {IRuleHost} from "./RuleHost";
import BaseComponent from "../../../components/BaseComponent";
import ListItem from "../../../components/list/ListItem";
import styles from "../../../components/list/ListItem.module.css";
import React from "react";
import ControlledList from "../../../components/list/ControlledList";
import {ReduxState} from "../../../reducers";
import {bindActionCreators} from "redux";
import {
  loadEdgeHosts,
  loadRuleHostEdgeHosts,
  removeRuleHostEdgeHosts,
} from "../../../actions";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import {IEdgeHost} from "../../hosts/edge/EdgeHost";

interface StateToProps {
  isLoading: boolean;
  error?: string | null;
  ruleEdgeHosts: string[];
  edgeHosts: { [key: string]: IEdgeHost };
}

interface DispatchToProps {
  loadEdgeHosts: () => void;
  loadRuleHostEdgeHosts: (ruleName: string) => void;
  removeRuleHostEdgeHosts: (ruleName: string, edgeHosts: string[]) => void;
}

interface HostRuleEdgeHostListProps {
  isLoadingHostRule: boolean;
  loadHostRuleError?: string | null;
  ruleHost: IRuleHost | Partial<IRuleHost> | null;
  newEdgeHosts: string[];
  onAddRuleEdgeHost: (edgeHost: string) => void;
  onRemoveRuleEdgeHosts: (edgeHost: string[]) => void;
}

type Props = StateToProps & DispatchToProps & HostRuleEdgeHostListProps

class HostRuleEdgeHostList extends BaseComponent<Props, {}> {

  componentDidMount(): void {
    this.props.loadEdgeHosts();
    if (this.props.ruleHost?.name) {
      const {name} = this.props.ruleHost;
      this.props.loadRuleHostEdgeHosts(name);
    }
  }

  private edgeHost = (index: number, edgeHost: string, separate: boolean, checked: boolean,
                      handleCheckbox: (event: React.ChangeEvent<HTMLInputElement>) => void): JSX.Element =>
    <ListItem key={index} separate={separate}>
      <div className={styles.linkedItemContent}>
        <label>
          <input id={edgeHost}
                 type="checkbox"
                 onChange={handleCheckbox}
                 checked={checked}/>
          <span id={'checkbox'}>{edgeHost}</span>
        </label>
      </div>
      <Link to={`/hosts/edge/${edgeHost}`}
            className={`${styles.link} waves-effect`}>
        <i className={`${styles.linkIcon} material-icons right`}>link</i>
      </Link>
    </ListItem>;

  private onAdd = (edgeHost: string): void =>
    this.props.onAddRuleEdgeHost(edgeHost);

  private onRemove = (edgeHosts: string[]) =>
    this.props.onRemoveRuleEdgeHosts(edgeHosts);

  private onDeleteSuccess = (edgeHosts: string[]): void => {
    if (this.props.ruleHost?.name) {
      const {name} = this.props.ruleHost;
      this.props.removeRuleHostEdgeHosts(name, edgeHosts);
    }
  };

  private onDeleteFailure = (reason: string): void =>
    super.toast(`Unable to remove edge host`, 10000, reason, true);

  private getSelectableEdgeHostNames = () => {
    const {edgeHosts, ruleEdgeHosts, newEdgeHosts} = this.props;
    return Object.keys(edgeHosts)
                 .filter(edgeHost => !ruleEdgeHosts.includes(edgeHost) && !newEdgeHosts.includes(edgeHost));
  };

  render() {
    return <ControlledList isLoading={this.props.isLoadingHostRule || this.props.isLoading}
                           error={this.props.loadHostRuleError || this.props.error}
                           emptyMessage={`Edge hosts list is empty`}
                           data={this.props.ruleEdgeHosts}
                           dataKey={[]} //TODO
                           dropdown={{
                             id: 'edgeHosts',
                             title: 'Add edge host',
                             empty: 'No more edge hosts to add',
                             data: this.getSelectableEdgeHostNames()
                           }}
                           show={this.edgeHost}
                           onAdd={this.onAdd}
                           onRemove={this.onRemove}
                           onDelete={{
                             url: `rules/hosts/${this.props.ruleHost?.name}/edgeHosts`,
                             successCallback: this.onDeleteSuccess,
                             failureCallback: this.onDeleteFailure
                           }}/>;
  }

}

function mapStateToProps(state: ReduxState, ownProps: HostRuleEdgeHostListProps): StateToProps {
  const ruleName = ownProps.ruleHost?.name;
  const rule = ruleName && state.entities.rules.hosts.data[ruleName];
  const ruleEdgeHosts = rule && rule.edgeHosts;
  return {
    isLoading: state.entities.rules.hosts.isLoadingEdgeHosts,
    error: state.entities.rules.hosts.loadEdgeHostsError,
    ruleEdgeHosts: ruleEdgeHosts || [],
    edgeHosts: state.entities.hosts.edge.data,
  }
}

const mapDispatchToProps = (dispatch: any): DispatchToProps =>
  bindActionCreators({
    loadRuleHostEdgeHosts,
    removeRuleHostEdgeHosts,
    loadEdgeHosts,
  }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(HostRuleEdgeHostList);