import BaseComponent from "../../components/BaseComponent";
import ListItem from "../../components/list/ListItem";
import styles from "./ContainerLogsList.module.css";
import List from "../../components/list/List";
import React from "react";

interface PortsListProps {
  logs: string[];
}

type Props = PortsListProps;

export default class ContainerLogsList extends BaseComponent<Props, {}> {

  private logs = (logs: string, index: number): JSX.Element =>
    <ListItem key={index}>
      <div className={styles.listItemContent}>
        <span>{logs}</span>
      </div>
    </ListItem>;

  render() {
    const LogsList = List<string>();
    return (
      <div className={styles.logsListContainer}>
        <LogsList emptyMessage={`No logs available`}
                  list={this.props.logs}
                  show={this.logs}
                  paginate={{pagesize: {initial: 50}, position: 'top-bottom'}}/>
      </div>
    );
  }

}
