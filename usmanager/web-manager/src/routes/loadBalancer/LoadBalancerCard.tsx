import React from "react";
import CardItem from "../../components/list/CardItem";
import Card from "../../components/cards/Card";
import {ILoadBalancer} from "./LoadBalancer";
import {IContainer} from "../containers/Container";

interface LoadBalancerCardProps {
  loadBalancer: ILoadBalancer;
}

type Props = LoadBalancerCardProps;

const LoadBalancerCard = ({loadBalancer}: Props) => (
  <Card<IContainer> title={loadBalancer.id.toString()}
                    link={{to: {pathname: `/load-balancers/${loadBalancer.id}`, state: loadBalancer}}}
                    height={'150px'}
                    margin={'10px 0'}
                    hoverable>
    <CardItem key={'state'}
              label={'State'}
              value={loadBalancer.state}/>
    <CardItem key={'status'}
              label={'Status'}
              value={loadBalancer.status}/>
    <CardItem key={'hostname'}
              label={'Hostname'}
              value={loadBalancer.hostname}/>
    <CardItem key={'ports'}
              label={'Ports'}
              value={`${loadBalancer.ports.map(p => `${p.privatePort}:${p.publicPort}`).join('/')}`}/>
  </Card>
);

export default LoadBalancerCard;