import React from "react";

interface Props {
  tooltip: { text?: string, deactivatedText?: string, activatedText?: string, position: 'left' | 'right' | 'bottom' | 'top' };
  reloadCallback: () => void;
  reloading?: boolean;
  automatic?: boolean;
  offset?: number;
}

interface State {
  isReloading: boolean;
}

export default class ReloadButton extends React.Component<Props, State> {

  state: State = {
    isReloading: this.props.automatic && this.props.reloading || false
  };

  handleOnClick = () =>  {
    if (this.props.automatic) {
      this.setState(state => ({isReloading: !state.isReloading}));
    }
    this.props.reloadCallback();
  };

  public render() {
    const {offset, tooltip, automatic} = this.props;
    const {isReloading} = this.state;
    return (
      <div className={`fixed-action-btn tooltipped waves-effect btn-floating grey darken-${isReloading ? '4' : '3'}`}
           style={offset ? {right: `${offset * 55 + 23}px`} : undefined}
           data-position={tooltip.position}
           data-tooltip={`${automatic ? (isReloading ? tooltip.activatedText : tooltip.deactivatedText) : tooltip.text}`}
           onClick={this.handleOnClick}>
        <i className="large material-icons">cached</i>
      </div>
    );
  }

}