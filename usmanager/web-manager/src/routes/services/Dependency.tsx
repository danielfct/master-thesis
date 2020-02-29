import ListItem from "../../components/list/ListItem";
import styles from "./ServiceDependencyList.module.css";
import React from "react";
import {IServiceDependency} from "./ServiceDependencyList";
import {RouteComponentProps, withRouter} from "react-router";

interface DependencyProps {
  dependency: string;
  separate?: boolean;
  checked: boolean;
  handleCheckbox: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

type Props = DependencyProps & RouteComponentProps;

class Dependency extends React.Component<Props, any> {

  private onDependencyClick = (e: any) => {
    const callerNode = (e.target as Element).nodeName.toLowerCase();
    if (callerNode !== 'span' && callerNode !== 'input') {
      e.preventDefault();
      this.props.history.push(`/services/${this.props.dependency}`);
    }
  };

  render() {
    const {separate, dependency, handleCheckbox, checked} = this.props;
    return (
      <div>
        <ListItem separate={separate}>
          <div className={`${styles.dependencyItemContent}`}>
            <label>
              <input id={dependency}
                     type="checkbox"
                     onChange={handleCheckbox}
                     checked={checked}/>
              <span id={'checkbox'}>{dependency}</span>
            </label>
          </div>
          <a href={`/services/${dependency}`}
             onClick={this.onDependencyClick}
             className={`${styles.link}`}/>
        </ListItem>
      </div>
    );
  }
}

export default withRouter(Dependency);

