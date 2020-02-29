import React from "react";
import {IService} from "./Service";

export interface IRule {
  name: string;
  //TODO
}

interface ServiceRuleListProps {
  service: IService | Partial<IService>;
  newRules: string[];
  onAddServiceRule: (rule: string) => void;
  onRemoveServiceRules: (rule: string[]) => void;
}

type Props = ServiceRuleListProps;

export default class ServiceRuleList extends React.Component<Props, {}> {

  render() {
    return (
      <div/>
    );
  }

}