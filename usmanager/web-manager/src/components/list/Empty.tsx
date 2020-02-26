import React from "react";
import styles from './Empty.module.css';

interface Props {
  message: string;
  error?: string;
}

export default class Empty extends React.Component<Props, {}> {

  render = () =>
    <div className={`${styles.container} row`}>
      <i className={`${styles.icon} material-icons`}>error_outline</i>
      <h6 className={`${styles.message}`}>{this.props.message} <div className='red-text'>{this.props.error || ''}</div></h6>
    </div>

}
