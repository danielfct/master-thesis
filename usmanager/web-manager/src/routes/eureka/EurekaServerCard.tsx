import React from "react";
import CardItem from "../../components/list/CardItem";
import Card from "../../components/cards/Card";
import {IEurekaServer} from "./EurekaServer";
import {IContainer} from "../containers/Container";

interface EurekaServerCardProps {
  eurekaServer: IEurekaServer;
}

type Props = EurekaServerCardProps;

const EurekaServerCard = ({eurekaServer}: Props) => (
  <Card<IContainer> title={eurekaServer.id.toString()}
                    link={{to: {pathname: `/eureka-servers/${eurekaServer.id}`, state: eurekaServer}}}
                    height={'150px'}
                    margin={'10px 0'}
                    hoverable>
    <CardItem key={'state'}
              label={'State'}
              value={eurekaServer.state}/>
    <CardItem key={'status'}
              label={'Status'}
              value={eurekaServer.status}/>
    <CardItem key={'hostname'}
              label={'Hostname'}
              value={eurekaServer.hostname}/>
    <CardItem key={'ports'}
              label={'Ports'}
              value={`${eurekaServer.ports.map(p => `${p.privatePort}:${p.publicPort}`).join('/')}`}/>
  </Card>
);

export default EurekaServerCard;