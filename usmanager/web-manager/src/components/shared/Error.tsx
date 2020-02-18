import React from "react";
import './Error.css';

interface Props {
  message: String;
}

export default class Error extends React.Component<Props, {}> {

  public render = () =>
    <div className="error-container row">
      <i className="material-icons error-icon">error_outline</i>
        <h5 className="error-message">{this.props.message}</h5>
    </div>

}
