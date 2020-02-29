import React from "react";
import {IService} from "./Service";

export interface IPrediction {
  name: string;
  //TODO
}

interface ServicePredictionListProps {
  service: IService | Partial<IService>;
  newPredictions: string[];
  onAddServicePrediction: (prediction: string) => void;
  onRemoveServicePredictions: (prediction: string[]) => void;
}

type Props = ServicePredictionListProps;

export default class ServicePredictionList extends React.Component<Props, {}> {

  render() {
    return (
      <div/>
    );
  }

}
