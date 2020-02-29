import BaseComponent from "../../components/BaseComponent";
import React from "react";
import {IService} from "./Service";

interface ServiceAppListProps {
  service: Partial<IService>;
  addServiceAppCallback: (appName: string) => void;
}

type Props = ServiceAppListProps;

export default class ServiceAppList extends BaseComponent<Props, {}> {
  render() {
    return (
      <div/>
    );
  }
}