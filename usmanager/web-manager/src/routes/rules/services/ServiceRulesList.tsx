/*
 * Copyright (c) 2020 usmanager
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import {IServiceRule} from "./ServiceRule";
import BaseComponent from "../../../components/BaseComponent";
import React from "react";
import ServiceRuleCard from "./ServiceRuleCard";
import CardList from "../../../components/list/CardList";
import {ReduxState} from "../../../reducers";
import {connect} from "react-redux";
import {loadGenericRulesService, loadRulesService} from "../../../actions";

interface StateToProps {
  isLoading: boolean
  error?: string | null;
  serviceRules: IServiceRule[];
}

interface DispatchToProps {
  loadRulesService: () => any;
  loadGenericRulesService: () => any;
}

type Props = StateToProps & DispatchToProps;

class ServiceRules extends BaseComponent<Props, {}> {

  componentDidMount(): void {
    this.props.loadRulesService();
    this.props.loadGenericRulesService();
  }

  private rule = (rule: IServiceRule): JSX.Element =>
    <ServiceRuleCard key={rule.id} rule={rule}/>;

  private predicate = (rule: IServiceRule, search: string): boolean =>
    rule.name.toLowerCase().includes(search);

  render() {
    return (
      <CardList<IServiceRule>
        isLoading={this.props.isLoading}
        error={this.props.error}
        emptyMessage={"No service rules to display"}
        list={this.props.serviceRules}
        card={this.rule}
        predicate={this.predicate}/>
    );
  }

}

const mapStateToProps = (state: ReduxState): StateToProps => (
  {
    isLoading: state.entities.rules.services.isLoadingRules || state.entities.rules.services.generic.isLoadingGenericRules,
    error: state.entities.rules.services.loadRulesError || state.entities.rules.services.generic.loadGenericRulesError,
    serviceRules: Object.values(state.entities.rules.services.generic.data).concat(Object.values(state.entities.rules.services.data))
  }
);

const mapDispatchToProps: DispatchToProps = {
  loadRulesService,
  loadGenericRulesService
};

export default connect(mapStateToProps, mapDispatchToProps)(ServiceRules);