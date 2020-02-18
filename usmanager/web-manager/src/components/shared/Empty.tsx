import React from "react";
import './Empty.css'

interface Props {
  message?: string;
}

export default class Empty extends React.Component<Props, {}> {

  public render = () =>
    <div className="empty-container row">
      <i className="material-icons empty-icon">error_outline</i>
      <h6 className="empty-message">{this.props.message || 'Nothing to show'}</h6>
    </div>

}
