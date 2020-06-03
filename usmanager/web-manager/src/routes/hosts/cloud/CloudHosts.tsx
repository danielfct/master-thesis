/*
 * Copyright (c) 2020 usmanager
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import React from "react";
import MainLayout from "../../../views/mainLayout/MainLayout";
import AddButton from "../../../components/form/AddButton";
import styles from '../edge/EdgeHosts.module.css'
import CloudHostsList from "./CloudHostsList";
import ReloadButton from "../../../components/list/ReloadButton";
import BaseComponent from "../../../components/BaseComponent";
import {reloadCloudHosts} from "../../../actions";
import {connect} from "react-redux";

interface DispatchToProps {
  reloadCloudHosts: () => void;
}

type Props = DispatchToProps;

class CloudHosts extends BaseComponent<Props, {}> {

  private reloadCloudInstances = () => {
    this.props.reloadCloudHosts();
  };

  public render() {
    return (
      <MainLayout>
        <AddButton tooltip={{text: 'Start cloud instance', position: 'bottom'}}
                   pathname={'/hosts/cloud/new_instance?new=true'}
                   offset={0}/>
        <ReloadButton tooltip={{text: 'Reload cloud instances', position: 'left'}}
                      reloadCallback={this.reloadCloudInstances}
                      offset={1}/>
        <div className={`${styles.container}`}>
          <CloudHostsList/>
        </div>
      </MainLayout>
    );
  }

}

const mapDispatchToProps: DispatchToProps = {
  reloadCloudHosts,
};

export default connect(null, mapDispatchToProps)(CloudHosts);
