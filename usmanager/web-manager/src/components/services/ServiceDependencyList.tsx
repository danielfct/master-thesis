/*
 * MIT License
 *
 * Copyright (c) 2020 usmanager
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import React, {createRef} from "react";
import {ReduxState} from "../../reducers";
import {IService} from "./Service";
import {connect} from "react-redux";
import List from "../shared/List";
import {bindActionCreators} from "redux";
import {loadServiceDependencies, loadServices} from "../../actions";
import ListItem from "../shared/ListItem";
import './ServiceDependencyList.css'
import M from "materialize-css";
import PerfectScrollbar from "react-perfect-scrollbar";
import {deleteData, patchData} from "../../utils/rest";

export interface IServiceDependency extends IService {
}

interface StateToProps {
    dependencies: IServiceDependency[],
    services: string[];
}

interface DispatchToProps {
    loadServiceDependencies: (service: IService) => void;
    loadServices: () => void;
}

interface ServiceDependencyProps {
    service: IService;
}

type Props = StateToProps & DispatchToProps & ServiceDependencyProps;

interface State {
    [key: string]: boolean;
}

const GLOBAL_CHECKBOX_ID = "GLOBAL_CHECKBOX";

class ServiceDependencyList extends React.Component<Props, State> {

    private dropdown = createRef<HTMLAnchorElement>();
    private globalCheckbox = createRef<HTMLInputElement>();

    constructor(props: Props) {
        super(props);
        this.state = this.props.dependencies.reduce((state: any, dependency: IService) => {
            state[dependency.serviceName] = false;
            return state;
        }, {});
    }

    public componentDidMount(): void {
        this.props.loadServices();
        if (this.props.service) {
            this.props.loadServiceDependencies(this.props.service);
        }
        M.Dropdown.init(this.dropdown.current as Element);
    }

    public componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<{}>, snapshot?: any): void {
        if (prevProps.service && prevProps.service.serviceName != this.props.service.serviceName) {
            this.props.loadServiceDependencies(this.props.service);
        }
    }

    private handleCheckbox = ({target:{id, checked}}:any) => {
        if (id !== GLOBAL_CHECKBOX_ID) {
            this.setState({[id]: checked}, () => {
                if (this.globalCheckbox.current) {
                    this.globalCheckbox.current.checked = Object.values(this.state).every((checked: boolean) => checked);
                }
            });
        } else {
            this.setState(this.props.dependencies.reduce((newState: any, dependency: IService) => {
                const dependencyName = dependency.serviceName;
                newState[dependencyName] = checked;
                return newState;
            }, {}));
        }
    };

    private dependency = (dependency: IService) => {
        return <ListItem>
            <div className="row">
                <div className="col s12">
                    <p>
                        <label >
                            <input id={dependency.serviceName}
                                   type="checkbox"
                                   onChange={this.handleCheckbox}
                                   defaultChecked={this.state[dependency.serviceName]}/>
                            <span>{dependency.serviceName}</span>
                        </label>
                    </p>
                </div>
            </div>
        </ListItem>;
    };


    private empty = (): JSX.Element =>
        <div>empty</div>; //TODO

    private handleRemoveDependencies = () => {
        const toDelete = Object.entries(this.state).filter(([_, checked]) => checked).map(([name, _]) => name);
        const dependencies = this.props.dependencies.filter(dependency => toDelete.includes(dependency.serviceName));
        if (toDelete.length > 1) {
            const request = dependencies.join(" ");
            patchData(`http://localhost/services/${this.props.service.id}/dependencies`, request,() => {
                    M.toast({ html: '<div>Dependencies removed</div>' });
                },
                "delete");
        } else {
            const dependencyId = dependencies[0].id;
            deleteData(`http://localhost/services/100/dependencies/${dependencyId}`, () => {
                M.toast({ html: '<div>Dependency removed</div>' });
            });
        }
    };

    public render = () => {
        if (!this.props.dependencies) {
            return <div>Failed to fetch dependencies</div>;
        }
        const dependenciesNames = this.props.dependencies.map(d => d.serviceName);
        const selectableServices = this.props.services
            .filter(name => !this.props.service || name !== this.props.service.serviceName && !dependenciesNames.includes(name));
        const ServiceDependenciesList = List<IService>();
        return (
            <div>
                <div className="controls-container">
                    <p className="nolabel-checkbox">
                        <label>
                            <input id={GLOBAL_CHECKBOX_ID}
                                   type="checkbox"
                                   onChange={this.handleCheckbox}
                                   ref={this.globalCheckbox}/>
                            <span/>
                        </label>
                    </p>
                    <a className='dropdown-trigger control-btn btn-floating btn-flat btn-small waves-effect waves-light right tooltipped'
                       data-position="bottom" data-tooltip="New dependency"
                       data-target='dropdown1'
                       ref={this.dropdown}
                       tabIndex={0}>
                        <i className="material-icons">add</i>
                    </a>
                    <ul id='dropdown1' className='dropdown-content dropdown-services'>
                        <li className="disabled">
                            <a>Add dependency</a>
                        </li>
                        <PerfectScrollbar>
                            {selectableServices.map((service, index) =>
                                <li key={index}>
                                    <a>{service}</a>
                                </li>
                            )}
                        </PerfectScrollbar>
                    </ul>
                    <a className="control-btn btn-flat btn-small waves-effect waves-light red-text right"
                       tabIndex={0}
                       style={Object.values(this.state).some((checked: boolean) => checked) ? {transform: "scale(1)"} : {transform: "scale(0)"}}
                       onClick={this.handleRemoveDependencies}>
                        Remove
                    </a>
                </div>
                <ServiceDependenciesList
                    empty={this.empty}
                    list={this.props.dependencies}
                    show={this.dependency}
                    separator/>
            </div>
        )
    }

}

function mapStateToProps(state: ReduxState, ownProps: ServiceDependencyProps): StateToProps {
    const service = ownProps.service && state.entities.services[ownProps.service.serviceName];
    const dependencies = service && service.dependencies;
    return {
        dependencies: dependencies && dependencies.map(dependency => state.entities.services[dependency]) || [],
        services: Object.keys(state.entities.services)
    }
}

const mapDispatchToProps = (dispatch: any): DispatchToProps =>
    bindActionCreators({ loadServiceDependencies, loadServices }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ServiceDependencyList);