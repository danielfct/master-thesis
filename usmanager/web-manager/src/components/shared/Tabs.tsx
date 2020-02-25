import React, {createRef} from "react";
import {RouteComponentProps} from "react-router";
import M from "materialize-css";
import styles from './Tabs.module.css';

export type Tab = { title: string, id: string, content: () => JSX.Element }

interface TabsProps {
  tabs: Tab[];
}

type Props = TabsProps & RouteComponentProps;

export default class extends React.Component<Props, {}> {

  private tabs = createRef<HTMLUListElement>();

  componentDidMount(): void {
    M.Tabs.init(this.tabs.current as Element);
  }

  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<{}>, snapshot?: any): void {

  }

  render() {
    const {tabs} = this.props;
    return (
      <>
        <ul className="tabs" ref={this.tabs}>
          {tabs.map(tab =>
            <li className={`tab col s${12/tabs.length}`}><a href={`#${tab.id}`}>{tab.title}</a></li>
          )}
        </ul>
        {tabs.map(tab =>
          <div className={`tab-content ${styles.tabContent} col s12`} id={tab.id}>
            {tab.content()}
          </div>
        )}
      </>
    )
  }
}