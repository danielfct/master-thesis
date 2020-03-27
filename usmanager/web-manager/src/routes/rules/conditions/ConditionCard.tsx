import Card from "../../../components/cards/Card";
import CardItem from "../../../components/list/CardItem";
import React from "react";
import {ICondition} from "./Condition";

interface ConditionCardProps {
  condition: ICondition;
}

type Props = ConditionCardProps;

const ConditionCard = ({condition}: Props) => (
  <Card<ICondition> title={condition.name.toString()}
               link={{to: {pathname: `conditions/${condition.name}`, state: condition}}}
               height={'150px'}
               margin={'10px 0'}
               hoverable>
    <CardItem key={'valueMode'}
              label={'Value mode'}
              value={condition.valueMode.name}/>
    <CardItem key={'field'}
              label={'Field'}
              value={condition.field.name}/>
    <CardItem key={'operator'}
              label={'Operator'}
              value={condition.operator.symbol}/>
    <CardItem key={'value'}
              label={'Value'}
              value={condition.value.toString()}/>
  </Card>
);

export default ConditionCard;
