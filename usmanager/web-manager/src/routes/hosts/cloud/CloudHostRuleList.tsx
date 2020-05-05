/*
 * Copyright (c) 2020 usmanager
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import React from "react";
import BaseComponent from "../../../components/BaseComponent";
import ListItem from "../../../components/list/ListItem";
import styles from "../../../components/list/ListItem.module.css";
import ControlledList from "../../../components/list/ControlledList";
import {ReduxState} from "../../../reducers";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {IHostRule} from "../../rules/hosts/HostRule";
import {Link} from "react-router-dom";
import {ICloudHost} from "./CloudHost";
import {addCloudHostRule, loadCloudHostRules, loadRulesHost, removeCloudHostRules} from "../../../actions";

interface StateToProps {
  isLoading: boolean;
  error?: string | null;
  rules: { [key: string]: IHostRule },
  rulesName: string[];
}

interface DispatchToProps {
  loadRulesHost: (name?: string) => any;
  loadCloudHostRules: (hostname: string) => void;
  removeCloudHostRules: (hostname: string, rules: string[]) => void;
  addCloudHostRule: (hostname: string, rule: string) => void;
}

interface HostRuleListProps {
  host: ICloudHost | Partial<ICloudHost>;
  unsavedRules: string[];
  onAddHostRule: (rule: string) => void;
  onRemoveHostRules: (rule: string[]) => void;
}

type Props = StateToProps & DispatchToProps & HostRuleListProps;

class CloudHostRuleList extends BaseComponent<Props, {}> {

  componentDidMount(): void {
    this.props.loadRulesHost();
    const {instanceId} = this.props.host;
    if (instanceId) {
      this.props.loadCloudHostRules(instanceId);
    }
  }

  private rule = (index: number, rule: string, separate: boolean, checked: boolean,
                  handleCheckbox: (event: React.ChangeEvent<HTMLInputElement>) => void): JSX.Element => {
    const unsaved = this.props.unsavedRules.map(newRule => newRule).includes(rule);
    return (
      <ListItem key={index} separate={separate}>
        <div className={`${styles.linkedItemContent}`}>
          <label>
            <input id={rule}
                   type="checkbox"
                   onChange={handleCheckbox}
                   checked={checked}/>
            <span id={'checkbox'}>
            <div className={unsaved ? styles.unsavedItem : undefined}>
              {rule}
            </div>
            </span>
          </label>
        </div>
        <Link to={`/rules/hosts/${rule}`}
              className={`${styles.link} waves-effect`}>
          <i className={`${styles.linkIcon} material-icons right`}>link</i>
        </Link>
      </ListItem>
    );
  };

  private onAdd = (rule: string): void =>
    this.props.onAddHostRule(rule);

  private onRemove = (rules: string[]) =>
    this.props.onRemoveHostRules(rules);

  private onDeleteSuccess = (rules: string[]): void => {
    const {instanceId} = this.props.host;
    if (instanceId) {
      this.props.removeCloudHostRules(instanceId, rules);
    }
  };

  private onDeleteFailure = (reason: string): void =>
    super.toast(`Unable to delete rule`, 10000, reason, true);

  private getSelectableRules = () => {
    const {rules, rulesName, unsavedRules} = this.props;
    return Object.keys(rules).filter(name => !rulesName.includes(name) && !unsavedRules.includes(name));
  };

  render() {
    return <ControlledList isLoading={this.props.isLoading}
                           error={this.props.error}
                           emptyMessage={`Rules list is empty`}
                           data={this.props.rulesName}
                           dataKey={['instanceId']}
                           dropdown={{
                             id: 'rules',
                             title: 'Add rule',
                             empty: 'No more rules to add',
                             data: this.getSelectableRules()
                           }}
                           show={this.rule}
                           onAdd={this.onAdd}
                           onRemove={this.onRemove}
                           onDelete={{
                             url: `hosts/${this.props.host.instanceId}/rules`,
                             successCallback: this.onDeleteSuccess,
                             failureCallback: this.onDeleteFailure
                           }}/>;
  }

}

function mapStateToProps(state: ReduxState, ownProps: HostRuleListProps): StateToProps {
  const instanceId = ownProps.host.instanceId;
  const host = instanceId && state.entities.hosts.cloud.data[instanceId];
  const rulesName = host && host.rules;
  return {
    isLoading: state.entities.hosts.cloud.isLoadingRules,
    error: state.entities.hosts.cloud.loadRulesError,
    rules: state.entities.rules.hosts.data,
    rulesName: rulesName || [],
  }
}

const mapDispatchToProps = (dispatch: any): DispatchToProps =>
  bindActionCreators({
    loadRulesHost,
    loadCloudHostRules,
    addCloudHostRule,
    removeCloudHostRules,
  }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(CloudHostRuleList);