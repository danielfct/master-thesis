/*
 * Copyright (c) 2020 usmanager
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import {IHostRule} from "./RuleHost";
import BaseComponent from "../../../components/BaseComponent";
import ListItem from "../../../components/list/ListItem";
import styles from "../../../components/list/ListItem.module.css";
import React from "react";
import ControlledList from "../../../components/list/ControlledList";
import {ReduxState} from "../../../reducers";
import {bindActionCreators} from "redux";
import {
  loadCloudHosts,
  loadRuleHostCloudHosts,
  removeRuleHostCloudHosts,
} from "../../../actions";
import {connect} from "react-redux";
import {Redirect} from "react-router";
import {Link} from "react-router-dom";
import {ICloudHost} from "../../hosts/cloud/CloudHost";

interface StateToProps {
  isLoading: boolean;
  error?: string | null;
  ruleCloudHosts: string[];
  cloudHosts: { [key: string]: ICloudHost };
}

interface DispatchToProps {
  loadCloudHosts: () => void;
  loadRuleHostCloudHosts: (ruleName: string) => void;
  removeRuleHostCloudHosts: (ruleName: string, cloudHosts: string[]) => void;
}

interface HostRuleCloudHostListProps {
  rule: IHostRule | Partial<IHostRule>;
  newCloudHosts: string[];
  onAddRuleCloudHost: (cloudHost: string) => void;
  onRemoveRuleCloudHosts: (cloudHost: string[]) => void;
}

type Props = StateToProps & DispatchToProps & HostRuleCloudHostListProps

class HostRuleCloudHostList extends BaseComponent<Props, {}> {

  componentDidMount(): void {
    if (this.props.rule) {
      const {name} = this.props.rule;
      if (name) {
        this.props.loadRuleHostCloudHosts(name);
      }
      this.props.loadCloudHosts();
    }
  }

  private cloudHost = (index: number, cloudHost: string, separate: boolean, checked: boolean,
                       handleCheckbox: (event: React.ChangeEvent<HTMLInputElement>) => void): JSX.Element =>
    <ListItem key={index} separate={separate}>
      <div className={styles.linkedItemContent}>
        <label>
          <input id={cloudHost}
                 type="checkbox"
                 onChange={handleCheckbox}
                 checked={checked}/>
          <span id={'checkbox'}>{cloudHost}</span>
        </label>
      </div>
      <Link to={`/hosts/cloud/${cloudHost}`}
            className={`${styles.link} waves-effect`}>
        <i className={`${styles.linkIcon} material-icons right`}>link</i>
      </Link>
    </ListItem>;

  private onAdd = (cloudHost: string): void =>
    this.props.onAddRuleCloudHost(cloudHost);

  private onRemove = (cloudHosts: string[]) =>
    this.props.onRemoveRuleCloudHosts(cloudHosts);

  private onDeleteSuccess = (cloudHosts: string[]): void => {
    const {name} = this.props.rule;
    if (name) {
      this.props.removeRuleHostCloudHosts(name, cloudHosts);
    }
  };

  private onDeleteFailure = (reason: string): void =>
    super.toast(`Unable to delete cloud host`, 10000, reason, true);

  private getSelectableCloudHostNames = () => {
    const {cloudHosts, ruleCloudHosts, newCloudHosts} = this.props;
    return Object.keys(cloudHosts)
                 .filter(cloudHost => !ruleCloudHosts.includes(cloudHost) && !newCloudHosts.includes(cloudHost));
  };

  render() {
    return <ControlledList isLoading={this.props.isLoading}
                           error={this.props.error}
                           emptyMessage={`Cloud hosts list is empty`}
                           data={this.props.ruleCloudHosts}
                           dataKey={[]} //TODO
                           dropdown={{
                             id: 'cloudHosts',
                             title: 'Add cloud host',
                             empty: 'No more cloudHosts to add',
                             data: this.getSelectableCloudHostNames()
                           }}
                           show={this.cloudHost}
                           onAdd={this.onAdd}
                           onRemove={this.onRemove}
                           onDelete={{
                             url: `rules/hosts/${this.props.rule.name}/conditions`,
                             successCallback: this.onDeleteSuccess,
                             failureCallback: this.onDeleteFailure
                           }}/>;
  }

}

function mapStateToProps(state: ReduxState, ownProps: HostRuleCloudHostListProps): StateToProps {
  const ruleName = ownProps.rule && ownProps.rule.name;
  const rule = ruleName && state.entities.rules.hosts.data[ruleName];
  const ruleCloudHosts = rule && rule.cloudHosts;
  return {
    isLoading: state.entities.rules.hosts.isLoadingCloudHosts,
    error: state.entities.rules.hosts.loadCloudHostsError,
    ruleCloudHosts: ruleCloudHosts || [],
    cloudHosts: state.entities.hosts.cloud.data,
  }
}

const mapDispatchToProps = (dispatch: any): DispatchToProps =>
  bindActionCreators({
    loadRuleHostCloudHosts,
    removeRuleHostCloudHosts,
    loadCloudHosts,
  }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(HostRuleCloudHostList);