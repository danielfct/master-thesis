import Card from "../../components/cards/Card";
import CardItem from "../../components/list/CardItem";
import React from "react";
import {INode} from "./Node";

interface NodeCardProps {
  node: INode;
}

type Props = NodeCardProps;

const ServiceCard = ({node}: Props) => (
  <Card<INode> title={node.id.toString()}
               link={{to: {pathname: `/nodes/${node.id}`, state: node}}}
               height={'125px'}
               margin={'10px 0'}
               hoverable>
    <CardItem key={'hostName'}
              label={'Hostname'}
              value={node.hostname}/>
    <CardItem key={'state'}
              label={'State'}
              value={node.state}/>
    <CardItem key={'role'}
              label={'Role'}
              value={node.role}/>
  </Card>
);

export default ServiceCard;
