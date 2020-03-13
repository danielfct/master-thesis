import React from "react";
import {IRule} from "./Rule";
import CardItem from "../../components/list/CardItem";
import Card from "../../components/cards/Card";

interface RuleCardProps {
  rule: IRule;
}

type Props = RuleCardProps;

const RuleCard = ({rule}: Props) => (
  <Card<IRule> title={rule.name}
               link={{to: {pathname: `/rules/${rule.name}`, state: rule}}}
               height={'125px'}
               margin={'10px 0'}
               hoverable>
    <CardItem key={'priority'}
              label={'Priority'}
              value={`${rule.priority}`}/>
    <CardItem key={'appliedTo'}
              label={'Applied to'}
              value={`${rule.decision.componentType.name}`}/>
    <CardItem key={'decision'}
              label={'Decision'}
              value={`${rule.decision.name}`}/>
  </Card>
);

export default RuleCard;