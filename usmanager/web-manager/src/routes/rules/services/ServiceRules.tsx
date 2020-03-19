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
import MainLayout from "../../../views/mainLayout/MainLayout";
import AddButton from "../../../components/form/AddButton";
import ServiceRuleCard from "./ServiceRuleCard";
import styles from './ServiceRules.module.css';
import CardList from "../../../components/list/CardList";
import {ReduxState} from "../../../reducers";
import {connect} from "react-redux";
import {loadRulesService} from "../../../actions";

interface StateToProps {
  isLoading: boolean
  error?: string | null;
  serviceRules: IServiceRule[];
}

interface DispatchToProps {
  loadRulesService: (name?: string) => any;
}

type Props = StateToProps & DispatchToProps;

class ServiceRules extends BaseComponent<Props, {}> {

  componentDidMount(): void {
    this.props.loadRulesService();
  }

  private rule = (rule: IServiceRule): JSX.Element =>
    <ServiceRuleCard key={rule.id} rule={rule}/>;

  private predicate = (rule: IServiceRule, search: string): boolean =>
    rule.name.toLowerCase().includes(search);

  render() {
    return (
      <MainLayout>
        <AddButton tooltip={'Add service rule'} pathname={'/rules/services/new_service_rule'}/>
        <div className={`${styles.container}`}>
          <CardList<IServiceRule>
            isLoading={this.props.isLoading}
            error={this.props.error}
            emptyMessage={"No service rules to display"}
            list={this.props.serviceRules}
            card={this.rule}
            predicate={this.predicate}/>
        </div>
      </MainLayout>
    );
  }

}

const mapStateToProps = (state: ReduxState): StateToProps => (
  {
    isLoading: state.entities.rules.services.isLoading,
    error: state.entities.rules.services.error,
    serviceRules: (state.entities.rules.services.data && Object.values(state.entities.rules.services.data)) || [],
  }
);

const mapDispatchToProps: DispatchToProps = {
  loadRulesService,
};

export default connect(mapStateToProps, mapDispatchToProps)(ServiceRules);