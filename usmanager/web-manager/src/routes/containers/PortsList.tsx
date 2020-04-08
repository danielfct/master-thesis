import BaseComponent from "../../components/BaseComponent";
import ListItem from "../../components/list/ListItem";
import styles from "../../components/list/ListItem.module.css";
import List from "../../components/list/List";
import React from "react";
import {IContainerPort} from "./Container";

interface PortsListProps {
  ports: IContainerPort[];
}

type Props = PortsListProps;

export default class PortsList extends BaseComponent<Props, {}> {

  private port = (port: IContainerPort, index: number): JSX.Element =>
    <ListItem key={index} separate={index != this.props.ports.length - 1}>
      <div className={`${styles.itemContent}`}>
        <span>{port.privatePort}:{port.publicPort} {port.ip}/{port.type}</span>
      </div>
    </ListItem>;

  render() {
    const PortsList = List<IContainerPort>();
    return (
      <PortsList emptyMessage={`No ports associated`}
                 list={this.props.ports}
                 show={this.port}/>
    );
  }

}
