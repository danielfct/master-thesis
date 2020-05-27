import BaseComponent from "../../components/BaseComponent";
import ListItem from "../../components/list/ListItem";
import styles from "./ContainerLogsList.module.css";
import List from "../../components/list/List";
import React from "react";
import {IContainer} from "./Container";

interface PortsListProps {
  isLoadingContainer: boolean;
  loadContainerError?: string | null;
  container?: IContainer | null;
}

type Props = PortsListProps;

export default class ContainerLogsList extends BaseComponent<Props, {}> {

  private logs = () => {
    let logs = this.props.container?.logs?.split("\n");
    if (logs) {
      logs.pop();
    }
    else {
      logs = [];
    }
    console.log(logs); //TODO why pop 1?
    return logs;
  };

  private log = (logs: string, index: number): JSX.Element =>
    <ListItem key={index}>
      <div className={styles.listItemContent}>
        <span>{logs}</span>
      </div>
    </ListItem>;

  render() {
    const LogsList = List<string>();
    return (
      <div className={styles.logsListContainer}>
        <LogsList isLoading={this.props.isLoadingContainer}
                  error={this.props.loadContainerError}
                  emptyMessage={`No logs available`}
                  list={this.logs()}
                  show={this.log}
                  paginate={{pagesize: {initial: 50}, position: 'top-bottom'}}/>
      </div>
    );
  }

}
