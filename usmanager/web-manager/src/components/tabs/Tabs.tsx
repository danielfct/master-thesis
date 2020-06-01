import React, {createRef} from "react";
import {RouteComponentProps} from "react-router";
import M from "materialize-css";
import styles from './Tabs.module.css';

export type Tab = { title: string, id: string, content: () => JSX.Element, disabled?: boolean }

interface TabsProps {
  tabs: Tab[];
}

type Props = TabsProps & RouteComponentProps;

export default class extends React.Component<Props, {}> {

  private tabs = createRef<HTMLUListElement>();

  public componentDidMount(): void {
    M.Tabs.init(this.tabs.current as Element);
  }

  public render() {
    const {tabs} = this.props;
    return (
      <>
        <ul className="tabs tabs-fixed-width" ref={this.tabs}>
          {tabs.map((tab, index) =>
            <li key={index} className={`tab ${tab.disabled ? 'disabled' : ''}`}>
              <a href={tabs.length === 1 ? undefined : `#${tab.id}`}>{tab.title}</a>
            </li>
          )}
        </ul>
        {tabs.map((tab, index) =>
          <div id={tab.id} key={index} className={`tab-content ${styles.tabContent} col s12`}>
            {tab.content()}
          </div>
        )}
      </>
    )
  }
}