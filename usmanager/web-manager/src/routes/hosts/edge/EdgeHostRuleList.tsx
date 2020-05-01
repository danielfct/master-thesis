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
import {IEdgeHost} from "./EdgeHost";
import {addEdgeHostRule, loadEdgeHostRules, loadRulesHost, removeEdgeHostRules} from "../../../actions";

interface StateToProps {
  isLoading: boolean;
  error?: string | null;
  rules: { [key: string]: IHostRule },
  rulesName: string[];
}

interface DispatchToProps {
  loadRulesHost: (name?: string) => any;
  loadEdgeHostRules: (hostname: string) => void;
  removeEdgeHostRules: (hostname: string, rules: string[]) => void;
  addEdgeHostRule: (hostname: string, rule: string) => void;
}

interface HostRuleListProps {
  host: IEdgeHost | Partial<IEdgeHost>;
  newRules: string[];
  onAddHostRule: (rule: string) => void;
  onRemoveHostRules: (rule: string[]) => void;
}

type Props = StateToProps & DispatchToProps & HostRuleListProps;

class EdgeHostRuleList extends BaseComponent<Props, {}> {

  componentDidMount(): void {
    this.props.loadRulesHost();
    const {hostname} = this.props.host;
    if (hostname) {
      this.props.loadEdgeHostRules(hostname);
    }
  }

  private rule = (index: number, rule: string, separate: boolean, checked: boolean,
                  handleCheckbox: (event: React.ChangeEvent<HTMLInputElement>) => void): JSX.Element =>
    <ListItem key={index} separate={separate}>
      <div className={`${styles.linkedItemContent}`}>
        <label>
          <input id={rule}
                 type="checkbox"
                 onChange={handleCheckbox}
                 checked={checked}/>
          <span id={'checkbox'}>{rule}</span>
        </label>
      </div>
      <Link to={`/rules/hosts/${rule}`}
            className={`${styles.link} waves-effect`}>
        <i className={`${styles.linkIcon} material-icons right`}>link</i>
      </Link>
    </ListItem>;

  private onAdd = (rule: string): void =>
    this.props.onAddHostRule(rule);

  private onRemove = (rules: string[]) =>
    this.props.onRemoveHostRules(rules);

  private onDeleteSuccess = (rules: string[]): void => {
    const {hostname} = this.props.host;
    if (hostname) {
      this.props.removeEdgeHostRules(hostname, rules);
    }
  };

  private onDeleteFailure = (reason: string): void =>
    super.toast(`Unable to delete rule`, 10000, reason, true);

  private getSelectableRules = () => {
    const {rules, rulesName, newRules} = this.props;
    return Object.keys(rules).filter(name => !rulesName.includes(name) && !newRules.includes(name));
  };

  render() {
    return <ControlledList isLoading={this.props.isLoading}
                           error={this.props.error}
                           emptyMessage={`Rules list is empty`}
                           data={this.props.rulesName}
                           dataKey={['hostname']}
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
                             url: `hosts/${this.props.host.hostname}/rules`,
                             successCallback: this.onDeleteSuccess,
                             failureCallback: this.onDeleteFailure
                           }}/>;
  }

}

function mapStateToProps(state: ReduxState, ownProps: HostRuleListProps): StateToProps {
  const hostname = ownProps.host.hostname;
  const host = hostname && state.entities.hosts.edge.data[hostname];
  const rulesName = host && host.rules;
  return {
    isLoading: state.entities.hosts.edge.isLoadingRules,
    error: state.entities.hosts.edge.loadRulesError,
    rules: state.entities.rules.hosts.data,
    rulesName: rulesName || [],
  }
}

const mapDispatchToProps = (dispatch: any): DispatchToProps =>
  bindActionCreators({
    loadRulesHost,
    loadEdgeHostRules,
    addEdgeHostRule,
    removeEdgeHostRules,
  }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(EdgeHostRuleList);