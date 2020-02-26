import List from "../../components/list/List";
import MainLayout from "../../views/mainLayout/MainLayout";
import React from "react";
import {ReduxState} from "../../reducers";
import {bindActionCreators} from "redux";
import {loadLogs} from "../../actions";
import {connect} from "react-redux";
import {ILogs} from "./Logs";
import ListItem from "../../components/list/ListItem";
import styles from './LogsList.module.css';
import {IService} from "../services/Service";

interface StateToProps {
  isLoading: boolean;
  error?: string | null;
  logs: ILogs[];
}

interface DispatchToProps {
  loadLogs: () => void;
}

interface LogsListProps {

}

type Props = StateToProps & DispatchToProps & LogsListProps;

class LogsList extends React.Component<Props, {}> {

  componentDidMount(): void {
    this.loadData();
    setInterval(this.loadData, 5000);
  }

  async loadData() {
    try {
      const res = await this.props.loadLogs();
      console.log(res);
    } catch (e) {
      console.log(e);
    }
  }

  private log = (log: ILogs): JSX.Element =>
    <ListItem>
      <div className={`${styles.item}`}>
        <span className={`${styles.column}`}>
          {new Date(log.timestmp).toLocaleString()}
        </span>
        <span className={`${styles.column}`}>
          {log.levelString}
        </span>
        <span className={`${styles.column}`}>
          {log.formattedMessage}
        </span>
      </div>
    </ListItem>;


  private predicate = (logs: ILogs, search: string): boolean =>
    logs.formattedMessage.toLowerCase().includes(search) || logs.levelString.toLowerCase().includes(search);

  render = () => {
    const {isLoading, error, logs} = this.props;
    const LogsList = List<ILogs>();
    return (
      <div className={`${styles.list}`}>
        {/*<Reload></Reload>*/}
        <LogsList
          isLoading={isLoading}
          error={error}
          emptyMessage={'No logs to show'}
          list={logs}
          show={this.log}
          paginate={{ pagesize: 25}}
          predicate={this.predicate}/>
      </div>
    );
  }

}

const mapStateToProps = (state: ReduxState): StateToProps => (
  {
    isLoading: state.entities.logs.isLoading,
    error: state.entities.logs.error,
    logs: state.entities.logs && Object.values(state.entities.logs.data).reverse() || [],
  }
);

const mapDispatchToProps = (dispatch: any): DispatchToProps =>
  bindActionCreators({
    loadLogs
  }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(LogsList)