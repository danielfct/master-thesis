import React from "react";
import MainLayout from "../../views/mainLayout/MainLayout";
import AddButton from "../../components/form/AddButton";
import styles from './EdgeHosts.module.css'
import EdgeHostsList from "./EdgeHostsList";

const EdgeHosts: React.FC = () =>
  <MainLayout>
    <AddButton tooltip={'Add edge host'} pathname={'/hosts/edge/new_host'}/>
    <div className={`${styles.container}`}>
      <EdgeHostsList/>
    </div>
  </MainLayout>;

export default EdgeHosts;