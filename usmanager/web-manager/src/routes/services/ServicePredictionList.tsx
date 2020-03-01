import React from "react";
import {IService} from "./Service";
import Data from "../../components/IData";
import BaseComponent from "../../components/BaseComponent";
import ListItem from "../../components/list/ListItem";
import styles from "../../components/list/ListItem.module.css";
import {Link} from "react-router-dom";
import ControlledList from "../../components/list/ControlledList";
import {ReduxState} from "../../reducers";
import {bindActionCreators} from "redux";
import {
  addServiceDependency, addServicePrediction,
  loadServiceDependencies,
  loadServicePredictions,
  loadServices,
  removeServiceDependencies, removeServicePredictions
} from "../../actions";
import {connect} from "react-redux";

export interface IPrediction extends Data {
  name: string;
  description: string;
  startDate: string;   //TODO type?
  startTime: string;   //TODO type?
  endDate: string;   //TODO type?
  endTime: string;   //TODO type?
  minReplicas: number;
}

interface StateToProps {
  isLoading: boolean;
  error?: string | null;
  predictions: string[];
}

interface DispatchToProps {
  loadServicePredictions: (serviceName: string) => void;
  removeServicePredictions: (serviceName: string, predictions: string[]) => void;
  addServicePrediction: (serviceName: string, prediction: string) => void;
}

interface ServicePredictionListProps {
  service: IService | Partial<IService>;
  newPredictions: string[];
  onAddServicePrediction: (prediction: string) => void;
  onRemoveServicePredictions: (prediction: string[]) => void;
}

type Props = StateToProps & DispatchToProps & ServicePredictionListProps;

class ServicePredictionList extends BaseComponent<Props, {}> {

  componentDidMount(): void {
    const {serviceName} = this.props.service;
    if (serviceName) {
      this.props.loadServicePredictions(serviceName);
    }
  }

  private prediction = (index: number, prediction: string, separate: boolean, checked: boolean,
                        handleCheckbox: (event: React.ChangeEvent<HTMLInputElement>) => void): JSX.Element =>
    <ListItem key={index} separate={separate}>
      <div className={`${styles.itemContent}`}>
        <label>
          <input id={prediction}
                 type="checkbox"
                 onChange={handleCheckbox}
                 checked={checked}/>
          <span id={'checkbox'}>{prediction}</span>
        </label>
      </div>
      {/*<Link to={`/services/${dependency}`}
            className={`${styles.link}`}/>*/}
    </ListItem>;

  private onAdd = (prediction: string): void =>
    this.props.onAddServicePrediction(prediction);

  private onRemove = (predictions: string[]) =>
    this.props.onRemoveServicePredictions(predictions);

  private onDeleteSuccess = (predictions: string[]): void => {
    const {serviceName} = this.props.service;
    if (serviceName) {
      this.props.removeServicePredictions(serviceName, predictions);
    }
  };

  private onDeleteFailure = (reason: string): void =>
    super.toast(`Unable to delete prediction`, 10000, reason, true);

  render() {
    return <ControlledList isLoading={this.props.isLoading}
                           error={this.props.error}
                           emptyMessage={`Predictions list is empty`}
                           data={this.props.predictions}
                           /*dropdown={{title: 'Add dependency', empty: 'No more dependencies to add', data: this.getSelectableServicesNames()}}*/
                           show={this.prediction}
                           onAdd={this.onAdd}
                           onRemove={this.onRemove}
                           onDelete={{
                             url: `services/${this.props.service.serviceName}/predictions`,
                             successCallback: this.onDeleteSuccess,
                             failureCallback: this.onDeleteFailure
                           }}/>;

  }

}

function mapStateToProps(state: ReduxState, ownProps: ServicePredictionListProps): StateToProps {
  const serviceName = ownProps.service.serviceName;
  const service = serviceName && state.entities.services.data[serviceName];
  const predictions = service && service.predictions;
  return {
    isLoading: state.entities.services.isLoadingPredictions,
    error: state.entities.services.loadPredictionsError,
    predictions: predictions || [],
  }
}

const mapDispatchToProps = (dispatch: any): DispatchToProps =>
  bindActionCreators({
    loadServicePredictions,
    addServicePrediction,
    removeServicePredictions,
  }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ServicePredictionList);