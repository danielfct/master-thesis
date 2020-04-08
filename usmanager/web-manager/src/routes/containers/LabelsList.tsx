import BaseComponent from "../../components/BaseComponent";
import ListItem from "../../components/list/ListItem";
import styles from "../../components/list/ListItem.module.css";
import List from "../../components/list/List";
import React from "react";

interface PortsListProps {
  labels: string[];
}

type Props = PortsListProps;

export default class LabelsList extends BaseComponent<Props, {}> {

  private label = (label: string, index: number): JSX.Element =>
    <ListItem key={index} separate={index != this.props.labels.length - 1}>
      <div className={`${styles.itemContent}`}>
        <span>{label}</span>
      </div>
    </ListItem>;

  render() {
    const LabelsList = List<string>();
    return (
      <LabelsList emptyMessage={`No labels associated`}
                  list={this.props.labels}
                  show={this.label}/>
    );
  }

}