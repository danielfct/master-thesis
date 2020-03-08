import React from "react";
import MainLayout from "../../views/mainLayout/MainLayout";
import AddButton from "../../components/form/AddButton";
import styles from './EdgeHosts.module.css'
import CloudHostsList from "./CloudHostsList";

const CloudHosts: React.FC = () =>
  <MainLayout>
    <AddButton tooltip={'Add cloud host'} pathname={'/hosts/cloud/new_host'}/>
    <div className={`${styles.container}`}>
      <CloudHostsList/>
    </div>
  </MainLayout>;

export default CloudHosts;