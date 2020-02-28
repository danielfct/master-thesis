import React from "react";
import {IRegion} from "./Region";
import styles from "./RegionCard.module.css";
import {Link} from "react-router-dom";
import CardTitle from "../../components/list/CardTitle";
import PerfectScrollbar from "react-perfect-scrollbar";
import CardItem from "../../components/list/CardItem";

interface RegionCardProps {
  region: IRegion;
}

type Props = RegionCardProps;

export default class extends React.Component<Props, {}> {

  render() {
    const {region} = this.props;
    return (
      <div className={`col s6 m4 l3 ${styles.regionCard}`}>
        <div className={'hoverable'}>
          <Link to={{
            pathname: `/regions/${region.name}`,
            state: region}}>
            <CardTitle title={region.name}/>
            <div className={`card gridCard ${styles.regionCardContent}`}>
              <PerfectScrollbar>
                <div className='card-content'>
                  <CardItem key={'name'}
                            label={'Name'}
                            value={`${region.name}`}/>
                  <CardItem key={'description'}
                            label={'Description'}
                            value={`${region.description}`}/>
                  <CardItem key={'active'}
                            label={'Active'}
                            value={`${region.active.toString()}`}/>
                </div>
              </PerfectScrollbar>
            </div>
          </Link>
        </div>
      </div>
    );
  }

}