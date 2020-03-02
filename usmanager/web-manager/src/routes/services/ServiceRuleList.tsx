import React from "react";
import {IService} from "./Service";
import Data from "../../components/IData";
import BaseComponent from "../../components/BaseComponent";
import ListItem from "../../components/list/ListItem";
import styles from "../../components/list/ListItem.module.css";
import {Link} from "react-router-dom";
import ControlledList from "../../components/list/ControlledList";
import {ReduxState} from "../../reducers";
import {bindActionCreators} from "redux";
import {
  addServiceRule,
  loadRules,
  loadServiceRules,
  removeServiceRules
} from "../../actions";
import {connect} from "react-redux";

export interface IRule extends Data {
  name: string;
  priority: number;
}

interface StateToProps {
  isLoading: boolean;
  error?: string | null;
  rules: { [key: string]: IRule },
  rulesName: string[];
}

interface DispatchToProps {
  loadRules: (name?: string) => any;
  loadServiceRules: (serviceName: string) => void;
  removeServiceRules: (serviceName: string, rules: string[]) => void;
  addServiceRule: (serviceName: string, rule: string) => void;
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
    this.props.loadRules();
    const {serviceName} = this.props.service;
    if (serviceName) {
      this.props.loadServiceRules(serviceName);
    }
  }

  private rule = (index: number, rule: string, separate: boolean, checked: boolean,
                  handleCheckbox: (event: React.ChangeEvent<HTMLInputElement>) => void): JSX.Element =>
    <ListItem key={index} separate={separate}>
      <div className={`${styles.itemContent}`}>
        <label>
          <input id={rule}
                 type="checkbox"
                 onChange={handleCheckbox}
                 checked={checked}/>
          <span id={'checkbox'}>{rule}</span>
        </label>
      </div>
      {/*<Link to={`/rules/${rule}`} //TODO
            className={`${styles.link}`}/>*/}
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
  const rulesName = service && service.rules;
  return {
    isLoading: state.entities.services.isLoadingRules,
    error: state.entities.services.loadRulesError,
    rules: state.entities.rules.data,
    rulesName: rulesName || [],
  }
}

const mapDispatchToProps = (dispatch: any): DispatchToProps =>
  bindActionCreators({
    loadRules,
    loadServiceRules,
    addServiceRule,
    removeServiceRules,
  }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ServiceRuleList);