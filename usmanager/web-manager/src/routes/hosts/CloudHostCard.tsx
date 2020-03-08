import Card from "../../components/cards/Card";
import CardItem from "../../components/list/CardItem";
import React from "react";
import {ICloudHost} from "./CloudHost";

interface CloudHostCardProps {
  cloudHost: ICloudHost;
}

type Props = CloudHostCardProps;

const CloudHostCard = ({cloudHost}: Props) => (
  <Card<ICloudHost> title={cloudHost.instanceId}
                    link={{ to: { pathname: `/hosts/cloud/${cloudHost.instanceId }`, state: cloudHost } }}
                    height={'250px'}
                    margin={'10px 0'}
                    hoverable>
    <CardItem key={'imageId'}
              label={'imageId'}
              value={`${cloudHost.imageId}`}/>
    <CardItem key={'instanceType'}
              label={'instanceType'}
              value={`${cloudHost.instanceType}`}/>
    <CardItem key={'state'}
              label={'state'}
              value={`${cloudHost.state.code} - ${cloudHost.state.name}`}/>
    <CardItem key={'publicDnsName'}
              label={'publicDnsName'}
              value={`${cloudHost.publicDnsName}`}/>
    <CardItem key={'publicIpAddress'}
              label={'publicIpAddress'}
              value={`${cloudHost.publicIpAddress}`}/>
  </Card>
);

export default CloudHostCard;