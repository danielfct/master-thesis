import BaseComponent from "../../components/BaseComponent";
import {IRegion} from "./Region";
import MainLayout from "../../views/mainLayout/MainLayout";
import React from "react";
import AddButton from "../../components/form/AddButton";
import styles from "./Regions.module.css";
import CardList from "../../components/list/CardList";
import RegionCard from "./RegionCard";
import {ReduxState} from "../../reducers";
import {loadRegions} from "../../actions";
import {connect} from "react-redux";

interface StateToProps {
  isLoading: boolean
  error?: string | null;
  regions: IRegion[];
}

interface DispatchToProps {
  loadRegions: (name?: string) => any;
}

type Props = StateToProps & DispatchToProps;

class Regions extends BaseComponent<Props, {}> {

  componentDidMount(): void {
    this.props.loadRegions();
  }

  private service = (region: IRegion): JSX.Element =>
    <RegionCard key={region.id} region={region}/>;

  private predicate = (region: IRegion, search: string): boolean =>
    region.name.includes(search) || region.description.includes(search);

  render() {
    return (
      <MainLayout>
        <AddButton tooltip={'Add region'} pathname={'/regions/new_region?new=true'}/>
        <div className={`${styles.container}`}>
          <CardList<IRegion>
            isLoading={this.props.isLoading}
            error={this.props.error}
            emptyMessage={"No regions to display"}
            list={this.props.regions}
            card={this.service}
            predicate={this.predicate}/>
        </div>
      </MainLayout>
    );
  }

}

const mapStateToProps = (state: ReduxState): StateToProps => (
  {
    isLoading: state.entities.regions?.isLoading,
    error: state.entities.regions?.error,
    regions: (state.entities.regions?.data && Object.values(state.entities.regions?.data)) || [],
  }
);

const mapDispatchToProps: DispatchToProps = {
  loadRegions,
};

export default connect(mapStateToProps, mapDispatchToProps)(Regions);