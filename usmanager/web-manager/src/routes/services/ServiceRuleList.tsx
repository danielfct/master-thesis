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
import {IService} from "./Service";
import BaseComponent from "../../components/BaseComponent";
import ListItem from "../../components/list/ListItem";
import styles from "../../components/list/ListItem.module.css";
import ControlledList from "../../components/list/ControlledList";
import {ReduxState} from "../../reducers";
import {bindActionCreators} from "redux";
import {
  loadRulesService,
  loadServiceRules,
  removeServiceRules
} from "../../actions";
import {connect} from "react-redux";
import {IServiceRule} from "../rules/services/RuleService";
import {Link} from "react-router-dom";

interface StateToProps {
  isLoading: boolean;
  error?: string | null;
  rules: { [key: string]: IServiceRule },
  rulesName: string[];
}

interface DispatchToProps {
  loadRulesService: (name?: string) => any;
  loadServiceRules: (serviceName: string) => void;
  removeServiceRules: (serviceName: string, rules: string[]) => void;
}

interface ServiceRuleListProps {
  service: IService | Partial<IService>;
  newRules: string[];
  onAddServiceRule: (rule: string) => void;
  onRemoveServiceRules: (rule: string[]) => void;
}

type Props = StateToProps & DispatchToProps & ServiceRuleListProps;

class ServiceRuleList extends BaseComponent<Props, {}> {

  componentDidMount(): void {
    this.props.loadRulesService();
    const {serviceName} = this.props.service;
    if (serviceName) {
      this.props.loadServiceRules(serviceName);
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
      <Link to={`/rules/services/${rule}`}
            className={`${styles.link} waves-effect`}>
        <i className={`${styles.linkIcon} material-icons right`}>link</i>
      </Link>
    </ListItem>;

  private onAdd = (rule: string): void =>
    this.props.onAddServiceRule(rule);

  private onRemove = (rules: string[]) =>
    this.props.onRemoveServiceRules(rules);

  private onDeleteSuccess = (rules: string[]): void => {
    const {serviceName} = this.props.service;
    if (serviceName) {
      this.props.removeServiceRules(serviceName, rules);
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
                           dataKey={[]} //TODO
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
                             url: `services/${this.props.service.serviceName}/rules`,
                             successCallback: this.onDeleteSuccess,
                             failureCallback: this.onDeleteFailure
                           }}/>;
  }

}

function mapStateToProps(state: ReduxState, ownProps: ServiceRuleListProps): StateToProps {
  const serviceName = ownProps.service.serviceName;
  const service = serviceName && state.entities.services.data[serviceName];
  const rulesName = service && service.serviceRules;
  return {
    isLoading: state.entities.services.isLoadingRules,
    error: state.entities.services.loadRulesError,
    rules: Object.entries(state.entities.rules.services.data)
                 .filter(([_, rule]) => !rule.generic)
                 .map(([key, value]) => ({[key]: value}))
                 .reduce((fields, field) => {
                   for (let key in field) {
                     fields[key] = field[key];
                   }
                   return fields;
                 }, {}),
    rulesName: rulesName || [],
  }
}

const mapDispatchToProps = (dispatch: any): DispatchToProps =>
  bindActionCreators({
    loadRulesService,
    loadServiceRules,
    removeServiceRules,
  }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ServiceRuleList);