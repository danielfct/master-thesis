/*
 * Copyright (c) 2020 usmanager
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import {IAppRule} from "./AppRule";
import BaseComponent from "../../../components/BaseComponent";
import React from "react";
import MainLayout from "../../../views/mainLayout/MainLayout";
import AddButton from "../../../components/form/AddButton";
import AppRuleCard from "./AppRuleCard";
import styles from './AppRules.module.css';
import CardList from "../../../components/list/CardList";
import {ReduxState} from "../../../reducers";
import {connect} from "react-redux";
import {loadRulesApp} from "../../../actions";

interface StateToProps {
  isLoading: boolean
  error?: string | null;
  appRules: IAppRule[];
}

interface DispatchToProps {
  loadRulesApp: (name?: string) => any;
}

type Props = StateToProps & DispatchToProps;

class AppRules extends BaseComponent<Props, {}> {

  componentDidMount(): void {
    this.props.loadRulesApp();
  }

  private rule = (rule: IAppRule): JSX.Element =>
    <AppRuleCard key={rule.id} rule={rule}/>;

  private predicate = (rule: IAppRule, search: string): boolean =>
    rule.name.toLowerCase().includes(search);

  render() {
    return (
      <MainLayout>
        <AddButton tooltip={'Add app rule'} pathname={'/rules/apps/new_rule'}/>
        <div className={`${styles.container}`}>
          <CardList<IAppRule>
            isLoading={this.props.isLoading}
            error={this.props.error}
            emptyMessage={"No app rules to display"}
            list={this.props.appRules}
            card={this.rule}
            predicate={this.predicate}/>
        </div>
      </MainLayout>
    );
  }

}

const mapStateToProps = (state: ReduxState): StateToProps => (
  {
    isLoading: state.entities.rules.apps.isLoading,
    error: state.entities.rules.apps.error,
    appRules: (state.entities.rules.apps.data && Object.values(state.entities.rules.apps.data)) || [],
  }
);

const mapDispatchToProps: DispatchToProps = {
  loadRulesApp,
};

export default connect(mapStateToProps, mapDispatchToProps)(AppRules);
