import {ICloudHost} from "./CloudHost";
import Card from "../../components/cards/Card";
import CardItem from "../../components/list/CardItem";
import React from "react";
import {IEdgeHost} from "./EdgeHost";

interface EdgeHostCardProps {
  edgeHost: IEdgeHost;
}

type Props = EdgeHostCardProps;

const EdgeHostCard = ({edgeHost}: Props) => (
  <Card<IEdgeHost> title={edgeHost.hostname}
                    link={{ to: { pathname: `/hosts/edge/${edgeHost.hostname }`, state: edgeHost } }}
                    height={'215px'}
                    margin={'10px 0'}
                    hoverable>
    <CardItem key={'sshUsername'}
              label={'Ssh username'}
              value={`${edgeHost.sshUsername}`}/>
    <CardItem key={'sshPassword'}
              label={'Ssh password (base64)'}
              value={`${edgeHost.sshPassword}`}/>
    <CardItem key={'region'}
              label={'Region'}
              value={`${edgeHost.region}`}/>
    <CardItem key={'country'}
              label={'Country'}
              value={`${edgeHost.country}`}/>
    <CardItem key={'city'}
              label={'City'}
              value={`${edgeHost.city}`}/>
    <CardItem key={'local'}
              label={'Local'}
              value={`${edgeHost.local}`}/>
  </Card>
);

export default EdgeHostCard;