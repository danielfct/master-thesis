import React, {createRef} from "react";
import M from "materialize-css";

interface Props {
  id: string;
  title: string;
  active?: boolean;
  headerClassname?: string;
  bodyClassname?: string;
}

interface State {
  isOpen: boolean;
}

//FIXME: fix scrollbar when collapsible is opened/closed

export default class extends React.Component<Props, State> {

  state: State = {
    isOpen: this.props.active || false
  };

  private collapsible = createRef<HTMLUListElement>();

  componentDidMount(): void {
    this.initCollapsible();
  }

  private initCollapsible = () => {
    M.Collapsible.init(this.collapsible.current as Element);
  };

  private setIsOpen = () =>
    this.setState(state => ({isOpen: !state.isOpen}));

  render() {
    const {id, title, active, headerClassname, bodyClassname, children} = this.props;
    const {isOpen} = this.state;
    return (
      <ul id={id} className="collapsible" ref={this.collapsible} onClick={this.setIsOpen}>
        <li className={active ? "active" : undefined}>
          <ul className={`collapsible-header no-select ${headerClassname}`}>
            <div className={`subtitle`}>{title}</div>
            <i className="material-icons">{isOpen ? 'arrow_drop_down' : 'arrow_drop_up'}</i>
          </ul>
          <div className={`collapsible-body ${bodyClassname}`}>
            {children}
          </div>
        </li>
      </ul>
    );
  }

}