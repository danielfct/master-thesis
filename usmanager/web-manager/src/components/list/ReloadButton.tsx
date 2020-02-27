import React from "react";

interface Props {
  tooltip: string;
  reloadCallback: () => void;
  reloading?: boolean;
}

interface State {
  isReloading: boolean;
}

export default class ReloadButton extends React.Component<Props, State> {

  state: State = {
    isReloading: this.props.reloading || false
  };

  handleOnClick = () =>  {
    this.setState(state => ({isReloading: !state.isReloading}));
    this.props.reloadCallback();
  };

  render = () =>
    <div className={`fixed-action-btn tooltipped waves-effect btn-floating grey darken-${this.state.isReloading ? '4' : '3'}`}
         data-position="left"
         data-tooltip={`${this.state.isReloading ? 'Stop' : 'Start'} ${this.props.tooltip}`}
         onClick={this.handleOnClick}>
      <i className="large material-icons">cached</i>
    </div>

}