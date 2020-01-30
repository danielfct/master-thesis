import Data from "../shared/IData";
import React from "react";
import {ReduxState} from "../../reducers";
import {IService} from "./Service";
import {connect} from "react-redux";
import List from "../shared/List";
import SimpleList from "../shared/SimpleList";
import {PagedList} from "../shared/PagedList";
import {bindActionCreators} from "redux";
import {loadServiceDependencies, selectEntity} from "../../actions";
import ListItem from "../shared/ListItem";
import {Link} from "react-router-dom";
import './ServiceDependencyList.css'

export interface IServiceDependency extends IService {
}

interface StateToProps {
    dependencies?: IServiceDependency[]
}

interface DispatchToProps {
    loadServiceDependencies: (service: IService) => void;
}

interface ServiceDependencyProps {
    service: IService;
}

type Props = StateToProps & DispatchToProps & ServiceDependencyProps;

class ServiceDependencyList extends React.Component<Props, {}> {

    public componentDidMount(): void {
        if (this.props.service.serviceName) {
            this.props.loadServiceDependencies(this.props.service);
        }
    }

    public componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<{}>, snapshot?: any): void {
        if (prevProps.service.serviceName != this.props.service.serviceName) {
            this.props.loadServiceDependencies(this.props.service);
        }
    }

    private dependency = (dependency: IService) =>
        <ListItem link={{ pathname: `/services/${dependency.serviceName}#details`, state: { service: dependency }}}>
            <div>{dependency.serviceName}</div>
        </ListItem>;


    private empty = (): JSX.Element =>
        <div>empty</div>; //TODO

    public render = () => {
        const List = SimpleList<IService>();
        if (!this.props.dependencies) {
            return <div>Failed to fetch dependencies</div>;
        }
        return (
            <div className="list-container">
                <List
                    empty={this.empty}
                    list={this.props.dependencies}
                    show={this.dependency}
                    separator/>
            </div>
        )
    }

}

function mapStateToProps(state: ReduxState, ownProps: ServiceDependencyProps): StateToProps {
    const service = state.entities.services[ownProps.service.serviceName];
    const dependencies = service && service.dependencies;
    return {
        dependencies: dependencies && dependencies.map(dependency => state.entities.services[dependency]) || []
    }
}

const mapDispatchToProps = (dispatch: any): DispatchToProps =>
    bindActionCreators({ loadServiceDependencies }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ServiceDependencyList);