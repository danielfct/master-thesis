import React from 'react';
import {ICondition} from "./Condition";
import BaseComponent from "../../../components/BaseComponent";
import MainLayout from "../../../views/mainLayout/MainLayout";
import AddButton from "../../../components/form/AddButton";
import CardList from "../../../components/list/CardList";
import {ReduxState} from "../../../reducers";
import {connect} from "react-redux";
import ConditionCard from "./ConditionCard";
import styles from "./Conditions.module.css";
import {loadConditions} from "../../../actions";

interface StateToProps {
  isLoading: boolean
  error?: string | null;
  conditions: ICondition[];
}

interface DispatchToProps {
  loadConditions: (id?: string) => any;
}

type Props = StateToProps & DispatchToProps;

class Conditions extends BaseComponent<Props, {}> {

  componentDidMount(): void {
    this.props.loadConditions();
  }

  private condition = (condition: ICondition): JSX.Element =>
    <ConditionCard key={condition.id} condition={condition}/>;

  private predicate = (condition: ICondition, search: string): boolean =>
    condition.name.toString().toLowerCase().includes(search);

  render = () =>
    <MainLayout>
      <AddButton tooltip={'Add condition'} pathname={'/rules/conditions/new_condition'}/>
      <div className={`${styles.container}`}>
        <CardList<ICondition>
          isLoading={this.props.isLoading}
          error={this.props.error}
          emptyMessage={"No conditions to display"}
          list={this.props.conditions}
          card={this.condition}
          predicate={this.predicate}/>
      </div>
    </MainLayout>

}

const mapStateToProps = (state: ReduxState): StateToProps => (
  {
    isLoading: state.entities.rules.conditions.isLoadingConditions,
    error: state.entities.rules.conditions.loadConditionsError,
    conditions: (state.entities.rules.conditions.data && Object.values(state.entities.rules.conditions.data)) || [],
  }
);

const mapDispatchToProps: DispatchToProps = {
  loadConditions,
};

export default connect(mapStateToProps, mapDispatchToProps)(Conditions);
