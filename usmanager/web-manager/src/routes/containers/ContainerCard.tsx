import Card from "../../components/cards/Card";
import CardItem from "../../components/list/CardItem";
import React from "react";
import {IContainer} from "./Container";

interface ContainerCardProps {
  container: IContainer;
}

type Props = ContainerCardProps;

const ServiceCard = ({container}: Props) => (
  <Card<IContainer> title={container.id.toString()}
               link={{to: {pathname: `/containers/${container.id}`, state: container}}}
               height={'215px'}
               margin={'10px 0'}
               hoverable>
    <CardItem key={'names'}
              label={'Names'}
              value={container.names.join('/')}/>
    <CardItem key={'image'}
              label={'Image'}
              value={container.image}/>
    <CardItem key={'state'}
              label={'State'}
              value={container.state}/>
    <CardItem key={'status'}
              label={'Status'}
              value={container.status}/>
    <CardItem key={'hostname'}
              label={'Hostname'}
              value={container.hostname}/>
    <CardItem key={'ports'}
              label={'Ports'}
              value={`${container.ports.map(p => `${p.privatePort}:${p.publicPort}`).join('/')}`}/>
  </Card>
);

export default ServiceCard;
