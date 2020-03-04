import React from "react";
import styles from "./UnsavedChanges.module.css";

const UnsavedChanges: React.FC = () =>
  <div className={`${styles.container}`}>
    <div className={`${styles.message}`}>You have unsaved changes</div>
  </div>;

export default UnsavedChanges;