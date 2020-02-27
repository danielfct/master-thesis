import React from "react";

interface Props {
  tooltip: string;
  reloadCallback: () => void;
}

export default class ReloadButton extends React.Component<Props, {}> {
  render = () =>
    <div className="fixed-action-btn tooltipped waves-effect btn-floating grey darken-3"
         data-position="left"
         data-tooltip={this.props.tooltip}
         onClick={this.props.reloadCallback}>
      <i className="large material-icons">cached</i>
    </div>
}