/*
 * Copyright (c) 2020 usmanager
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import BaseComponent from "../../../components/BaseComponent";
import ListItem from "../../../components/list/ListItem";
import styles from "../../../components/list/ListItem.module.css";
import React from "react";
import ControlledList from "../../../components/list/ControlledList";
import {ReduxState} from "../../../reducers";
import {bindActionCreators} from "redux";
import {
  loadServices,
  loadRuleServices,
  removeRuleServices,
} from "../../../actions";
import {connect} from "react-redux";
import {Redirect} from "react-router";
import {Link} from "react-router-dom";
import {IService} from "../../services/Service";
import {IServiceRule} from "./RuleService";

interface StateToProps {
  isLoading: boolean;
  error?: string | null;
  ruleServices: string[];
  services: { [key: string]: IService };
}

interface DispatchToProps {
  loadServices: () => void;
  loadRuleServices: (ruleName: string) => void;
  removeRuleServices: (ruleName: string, services: string[]) => void;
}

interface ServiceRuleServicesListProps {
  rule: IServiceRule | Partial<IServiceRule>;
  newServices: string[];
  onAddRuleService: (service: string) => void;
  onRemoveRuleServices: (services: string[]) => void;
}

type Props = StateToProps & DispatchToProps & ServiceRuleServicesListProps

class RuleServiceServicesList extends BaseComponent<Props, {}> {

  componentDidMount(): void {
    if (this.props.rule) {
      const {name} = this.props.rule;
      if (name) {
        this.props.loadRuleServices(name);
      }
      this.props.loadServices();
    }
  }

  private service = (index: number, service: string, separate: boolean, checked: boolean,
                     handleCheckbox: (event: React.ChangeEvent<HTMLInputElement>) => void): JSX.Element =>
    <ListItem key={index} separate={separate}>
      <div className={styles.linkedItemContent}>
        <label>
          <input id={service}
                 type="checkbox"
                 onChange={handleCheckbox}
                 checked={checked}/>
          <span id={'checkbox'}>{service}</span>
        </label>
      </div>
      <Link to={`/services/${service}`}
            className={`${styles.link} waves-effect`}>
        <i className={`${styles.linkIcon} material-icons right`}>link</i>
      </Link>
    </ListItem>;

  private onAdd = (service: string): void =>
    this.props.onAddRuleService(service);

  private onRemove = (services: string[]) =>
    this.props.onRemoveRuleServices(services);

  private onDeleteSuccess = (services: string[]): void => {
    const {name} = this.props.rule;
    if (name) {
      this.props.removeRuleServices(name, services);
    }
  };

  private onDeleteFailure = (reason: string): void =>
    super.toast(`Unable to remove service`, 10000, reason, true);

  private getSelectableServiceNames = () => {
    const {services, ruleServices, newServices} = this.props;
    return Object.keys(services)
                 .filter(service => !ruleServices.includes(service) && !newServices.includes(service));
  };

  render() {
    return <ControlledList isLoading={this.props.isLoading}
                           error={this.props.error}
                           emptyMessage={`Services list is empty`}
                           data={this.props.ruleServices}
                           dataKey={[]} //TODO
                           dropdown={{
                             id: 'services',
                             title: 'Add service',
                             empty: 'No more services to add',
                             data: this.getSelectableServiceNames()
                           }}
                           show={this.service}
                           onAdd={this.onAdd}
                           onRemove={this.onRemove}
                           onDelete={{
                             url: `rules/services/${this.props.rule.name}/services`,
                             successCallback: this.onDeleteSuccess,
                             failureCallback: this.onDeleteFailure
                           }}/>;
  }

}

function mapStateToProps(state: ReduxState, ownProps: ServiceRuleServicesListProps): StateToProps {
  const ruleName = ownProps.rule && ownProps.rule.name;
  const rule = ruleName && state.entities.rules.services.data[ruleName];
  const ruleServices = rule && rule.services;
  return {
    isLoading: state.entities.rules.services.isLoadingServices,
    error: state.entities.rules.services.loadServicesError,
    ruleServices: ruleServices || [],
    services: state.entities.services.data,
  }
}

const mapDispatchToProps = (dispatch: any): DispatchToProps =>
  bindActionCreators({
    loadRuleServices,
    removeRuleServices,
    loadServices,
  }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(RuleServiceServicesList);