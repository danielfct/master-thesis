import Card from "../../components/cards/Card";
import React from "react";
import {IApp} from "./App";

interface AppCardProps {
  app: IApp;
}

type Props = AppCardProps;

const AppCard = ({app}: Props) => (
  <Card<IApp> title={app.name.toString()}
               link={{to: {pathname: `/apps/${app.name}`, state: app}}}
               height={'30px'}
               margin={'10px 0'}
               hoverable>
  </Card>
);

export default AppCard;