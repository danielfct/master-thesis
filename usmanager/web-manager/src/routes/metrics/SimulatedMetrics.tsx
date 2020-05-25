/*
 * Copyright (c) 2020 usmanager
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import React, {createRef} from 'react';
import MainLayout from '../../views/mainLayout/MainLayout';
import AddButton from "../../components/form/AddButton";
import styles from './SimulatedMetrics.module.css'
import M from "materialize-css";
import Collapsible from "../../components/collapsible/Collapsible";
import BaseComponent from "../../components/BaseComponent";
import SimulatedHostMetricsList from "./hosts/SimulatedHostMetricsList";
import SimulatedServiceMetricsList from "./services/SimulatedServiceMetricsList";

export default class SimulatedMetrics extends BaseComponent<{}, {}> {

  private servicesCollapsible = createRef<HTMLUListElement>();
  private containersCollapsible = createRef<HTMLUListElement>();
  private hostCollapsible = createRef<HTMLUListElement>();

  componentDidMount(): void {
    this.init();
  }

  private init = () => {
    M.Collapsible.init(this.servicesCollapsible.current as Element);
    M.Collapsible.init(this.containersCollapsible.current as Element);
    M.Collapsible.init(this.hostCollapsible.current as Element);
  };

  render = () =>
    <MainLayout>
      <AddButton tooltip={'Add simulated metric'} dropdown={{
        id: 'simulatedMetrics',
        title: 'Simulated metric',
        data: [
          {text: 'Host', pathname: '/simulated-metrics/hosts/new_metric?new=true'},
          {text: 'Service', pathname: '/simulated-metrics/services/new_metric?new=true'},
          {text: 'Container', pathname: '/simulated-metrics/containers/new_metric?new=true'},
        ],
      }}/>
      <div className={`${styles.container}`}>
        <Collapsible id={"hostssCollapsible"}
                     title={'Hosts'}
                     active
                     headerClassname={styles.collapsibleSubtitle}
                     bodyClassname={styles.collapsibleCardList}>
          <SimulatedHostMetricsList/>
        </Collapsible>
      </div>
      <div className={`${styles.container}`}>
        <Collapsible id={"servicesCollapsible"}
                     title={'Services'}
                     active
                     headerClassname={styles.collapsibleSubtitle}
                     bodyClassname={styles.collapsibleCardList}>
          <SimulatedServiceMetricsList/>
        </Collapsible>
      </div>
      {/* <div className={`${styles.container}`}>
        <Collapsible id={"containersCollapsible"}
                     title={'Containers'}
                     active
                     headerClassname={styles.collapsibleSubtitle}
                     bodyClassname={styles.collapsibleCardList}>
          <SimulatedContainerMetricsList/>
        </Collapsible>
      </div>*/}
    </MainLayout>

}
