import React from "react";
import styles from './Empty.module.css';

interface Props {
  message: string;
  error?: string;
}

const Empty: React.FC<Props> = ({message, error}: Props) =>
  <div className={`${styles.container}`}>
    <i className={`${styles.icon} material-icons`}>error_outline</i>
    <h6 className={`${styles.message}`}>{message} <div className='red-text'>{error || ''}</div></h6>
  </div>;

export default Empty;
