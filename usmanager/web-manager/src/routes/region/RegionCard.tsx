import React from "react";
import {IRegion} from "./Region";
import CardItem from "../../components/list/CardItem";
import Card from "../../components/cards/Card";

interface RegionCardProps {
  region: IRegion;
}

type Props = RegionCardProps;

const RegionCard = ({region}: Props) => (
  <Card<IRegion> title={region.name}
                 link={{to: {pathname: `/regions/${region.name}`, state: region}}}
                 height={'125px'}
                 margin={'10px 0'}
                 hoverable>
    <CardItem key={'name'}
              label={'Name'}
              value={`${region.name}`}/>
    <CardItem key={'description'}
              label={'Description'}
              value={`${region.description}`}/>
    <CardItem key={'active'}
              label={'Active'}
              value={`${region.active}`}/>
  </Card>
);

export default RegionCard;