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
import BaseComponent from "../../components/BaseComponent";
import ListItem from "../../components/list/ListItem";
import styles from "../../components/list/ListItem.module.css";
import ControlledList from "../../components/list/ControlledList";
import {ReduxState} from "../../reducers";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {
  loadRegions
} from "../../actions";
import {IRegion} from "../region/Region";

interface StateToProps {
  regions: { [key: string]: IRegion };
}

interface DispatchToProps {
  loadRegions: () => any;
}

interface HostRuleListProps {
  addedRegions: string[];
  onAddRegion: (region: string) => void;
  onRemoveRegion: (region: string) => void;
}

type Props = StateToProps & DispatchToProps & HostRuleListProps;

class LoadBalancerRegionsList extends BaseComponent<Props, {}> {

  componentDidMount(): void {
    this.props.loadRegions();
  }

  private region = (index: number, region: string, separate: boolean, checked: boolean,
                    handleCheckbox: (event: React.ChangeEvent<HTMLInputElement>) => void): JSX.Element => {
    return (
      <ListItem key={index} separate={separate}>
        <div className={`${styles.listItemContent}`}>
          <label>
            <input id={region}
                   type="checkbox"
                   onChange={handleCheckbox}
                   checked={checked}/>
            <span id={'checkbox'}>
              {region}
            </span>
          </label>
        </div>
        {/* <Link to={`/regions/${region}`}
              className={`${styles.link} waves-effect`}>
          <i className={`${styles.linkIcon} material-icons right`}>link</i>
        </Link>*/}
      </ListItem>
    );
  };

  private onAdd = (region: string): void =>
    this.props.onAddRegion(region);

  private onRemove = (region: string) =>
    this.props.onRemoveRegion(region);

  private getSelectableRegions = () => {
    const {regions, addedRegions} = this.props;
    return Object.keys(regions).filter(region => /*!regionsNames.includes(name) &&*/ !addedRegions.includes(region));
  };

  render() {
    return <div></div>/*<ControlledList emptyMessage={`Regions list is empty`}
                           dataKey={[]} //TODO
                           dropdown={{
                             id: 'regions',
                             title: 'Add region',
                             empty: 'No more regions to add',
                             data: this.getSelectableRegions()
                           }}
                           show={this.region}
                           onAdd={this.onAdd}/>*/;
  }

}

function mapStateToProps(state: ReduxState, ownProps: HostRuleListProps): StateToProps {
  return {
    regions: state.entities.regions.data,
  }
}

const mapDispatchToProps = (dispatch: any): DispatchToProps =>
  bindActionCreators({
    loadRegions,
  }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(LoadBalancerRegionsList);