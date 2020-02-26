import React from "react";
import styles from './Error.module.css';

interface Props {
  message: String;
}

export default class Error extends React.Component<Props, {}> {

  render = () =>
    <div className={`${styles.container}`}>
      <i className={`${styles.icon} material-icons`}>error_outline</i>
        <h5 className={`${styles.message}`}>{this.props.message}</h5>
    </div>

}
