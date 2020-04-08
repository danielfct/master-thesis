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
import React from "react";
import styles from "../../../components/list/ListItem.module.css";
import {Link} from "react-router-dom";
import List from "../../../components/list/List";
import {ReduxState} from "../../../reducers";
import {loadGenericRulesService} from "../../../actions";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import ListItem from "../../../components/list/ListItem";

interface StateToProps {
  isLoading: boolean;
  error?: string | null;
  genericServiceRules: string[];
}

interface DispatchToProps {
  loadGenericRulesService: () => void;
}

type Props = StateToProps & DispatchToProps;

class GenericServiceRuleList extends BaseComponent<Props, {}> {

  componentDidMount(): void {
    this.props.loadGenericRulesService();
  }

  private rule = (rule: string, index: number): JSX.Element =>
    <ListItem key={index} separate={index != this.props.genericServiceRules.length - 1}>
      <div className={`${styles.linkedItemContent}`}>
        <span>{rule}</span>
      </div>
      <Link to={`/rules/services/${rule}`}
            className={`${styles.link} waves-effect`}>
        <i className={`${styles.linkIcon} material-icons right`}>link</i>
      </Link>
    </ListItem>;

  render() {
    const RulesList = List<string>();
    return (
      <RulesList isLoading={this.props.isLoading}
                 error={this.props.error}
                 emptyMessage={`Generic service rules list is empty`}
                 list={this.props.genericServiceRules}
                 show={this.rule}/>
    );
  }

}

function mapStateToProps(state: ReduxState): StateToProps {
  return {
    isLoading: state.entities.rules.services.generic.isLoadingGenericRules,
    error: state.entities.rules.services.generic.loadGenericRulesError,
    genericServiceRules: Object.keys(state.entities.rules.services.generic.data),
  }
}

const mapDispatchToProps = (dispatch: any): DispatchToProps =>
  bindActionCreators({
    loadGenericRulesService,
  }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(GenericServiceRuleList);