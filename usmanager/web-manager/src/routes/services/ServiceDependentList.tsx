import {IService} from "./Service";
import React from "react";

export interface IDependent extends IService {
}

interface ServiceDependentListProps {
  service: IService | Partial<IService>;
  newDependentsBy: string[];
  onAddServiceDependentBy: (dependent: string) => void;
  onRemoveServiceDependentsBy: (dependent: string[]) => void;
}

type Props = ServiceDependentListProps;

export default class ServiceDependentList extends React.Component<Props, {}> {

  render() {
    return (
      <div/>
    );
  }

}