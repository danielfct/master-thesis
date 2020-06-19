import Card from "../../components/cards/Card";
import CardItem from "../../components/list/CardItem";
import React from "react";
import {IContainer} from "./Container";

interface ContainerCardProps {
  container: IContainer;
}

type Props = ContainerCardProps;

const ServiceCard = ({container}: Props) => (
  <Card<IContainer> title={container.containerId.toString()}
               link={{to: {pathname: `/containers/${container.containerId}`, state: container}}}
               height={'200px'}
               margin={'10px 0'}
               hoverable>
    <CardItem key={'names'}
              label={'Names'}
              value={container.names.join(', ')}/>
    <CardItem key={'image'}
              label={'Image'}
              value={container.image}/>
    <CardItem key={'hostname'}
              label={'Hostname'}
              value={container.hostname}/>
    <CardItem key={'ports'}
              label={'Ports'}
              value={`${container.ports.map(p => `${p.privatePort}:${p.publicPort}`).join('/')}`}/>
    <CardItem key={'Stoppable'}
              label={'Stoppable'}
              value={`${container.labels['isStoppable'] !== undefined ? container.labels['isStoppable'] : true}`}/>
    <CardItem key={'replicable'}
              label={'Replicable'}
              value={`${container.labels['isReplicable'] !== undefined ? container.labels['isReplicable'] : true}`}/>
  </Card>
);

export default ServiceCard;
