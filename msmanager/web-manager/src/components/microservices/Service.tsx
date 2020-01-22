/*
 * MIT License
 *
 * Copyright (c) 2020 msmanager
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

import React from 'react';
import M from 'materialize-css';
import {RouteComponentProps} from 'react-router';
import {getData} from "../../utils/data";
import IService from "./IService";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {camelCaseToSentenceCase} from "../../utils/text";
import FormPage from "../shared/FormPage";

interface StateToProps {
    service: IService;
    fetchError: TypeError;
    isEditing: boolean;
}

interface DispatchToProps {
    actions: { getData: (url: string) => void },
}

interface MatchParams {
    id: string;
}

type Props = StateToProps & DispatchToProps & RouteComponentProps<MatchParams>;

class Service extends React.Component<Props, {}> {

    public componentDidMount = () => {
        console.log(this.props.service)
        if (!this.props.service) {
            /*this.props.actions.getData(`http://localhost/services/${this.props.match.params.id}`); TODO*/
            this.props.actions.getData(`/service.json`);
        }
        this.props.actions.getData(`http://localhost/services/${this.props.match.params.id}/dependencies`);
        M.updateTextFields();
        M.FormSelect.init(document.querySelectorAll('select'));
    };

    public componentDidUpdate = () => {
        /* M.updateTextFields();
         M.Collapsible.init(document.querySelectorAll('.collapsible'));
         M.FormSelect.init(document.querySelectorAll('select'));*/
    };

    /*renderDependencies = () => {
        if (this.state.loadedDependencies) {
            let dependencies;
            if (this.state.dependencies.length > 0) {
                dependencies = this.state.dependencies.map(dependency => (
                    <li key={dependency.id}>
                        <div className="collapsible-header">{dependency.serviceName}</div>
                        <div className="collapsible-body">
                            <ServiceCard renderSimple={true} service={dependency}/>
                        </div>
                    </li>
                ));
            } else {
                dependencies = <div>No dependencies</div>;
            }
            return (
                <div>
                    <h5>Dependencies</h5>
                    <ul className="collapsible">
                        {dependencies}
                    </ul>
                </div>
            );
        }
    };*/

    /*onClickRemove = () => {
        deleteData(
            `http://localhostservices/${this.state.service.id}`,
            () => {
                this.setState({ isDeleted: true });
                M.toast({ html: '<div>IService config removed successfully!</div>' });
            });
    };

    onSubmitForm = event => {
        event.preventDefault();
        postData(
            'http://localhostservices',
            event.target[0].value,
            data => {
                const newService = this.state.service;
                if (newService.id === 0) {
                    const title = document.title;
                    window.history.replaceState({}, title, '/services/service/' + data);
                }
                newService.id = data;
                this.setState({ service: newService });
                M.toast({ html: '<div>IService saved successfully!</div>' });
            });
    };*/

    public render = () => {
        /*if (this.state.isDeleted) {
            return <Redirect to='/services'/>; TODO
        }*/
        if (this.props.service) {
            let content = (
                <div className='row'>
                    <div className="col s12">
                        <ul className="tabs">
                            <li className="tab col s6"><a href="#test1">Test 1</a></li>
                            <li className="tab col s6"><a className="active" href="#test2">Test 2</a></li>
                        </ul>
                    </div>
                    {this.props.service &&
                    Object.entries(this.props.service)
                        .filter(([key, _]) => key !== 'id')
                        .map(([key, value]) =>
                            <div className="input-field col s12">
                                {key !== 'serviceType'
                                    ? <input disabled={!this.props.isEditing} value={value} name={key} id={key}
                                             type={isNaN(value) ? "text" : "number"} autoComplete="off"/>
                                    : <select disabled={!this.props.isEditing} value={value} name={key} id={key}>
                                        {/*//TODO get from database?*/}
                                        <option>Choose service type</option>
                                        <option value='frontend'>Frontend</option>
                                        <option value='backend'>Backend</option>
                                        <option value='database'>Database</option>
                                        <option value='system'>System</option>
                                    </select>
                                }
                                <label htmlFor={key}>{camelCaseToSentenceCase(key)}</label>
                            </div>)}
                    }
                </div>
            );
            return <FormPage title={this.props.service.serviceName}
                             breadcrumbs={[{ title: 'Services', link: '/services' }]}
                             postUrl={'http://localhost/services'}
                             deleteUrl={`http://localhost/services/${this.props.service.id}`}
                             content={content}/>
        }
        if (this.props.fetchError) {
            return <p>{this.props.fetchError.message}</p>
        }
        return null;
    }
    /*{this.renderDependencies()}*/
}


const mapStateToProps = (state: any): StateToProps => (
    {
        service: state.items.itemSelected || (state.items.data && state.items.data[0]),
        fetchError: state.items.fetchError,
        isEditing: state.items.edit,
    }
);

const mapDispatchToProps = (dispatch: any): DispatchToProps => (
    {
        actions: bindActionCreators({ getData }, dispatch),
    }
);

export default connect(mapStateToProps, mapDispatchToProps)(Service);