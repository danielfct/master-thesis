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

import React, {createRef} from 'react';
import M from 'materialize-css';
import {Redirect, RouteComponentProps} from 'react-router';
import {camelCaseToSentenceCase} from "../../utils/text";
import FormPage from "../shared/FormPage";
import {mapLabelToIcon} from "../../utils/image";
import IData from "../shared/IData";
import ServiceDependencyList from "./ServiceDependencyList";
import {loadServices} from "../../actions";
import {connect} from "react-redux";
import MainLayout from "../shared/MainLayout";

export interface IService extends IData {
    serviceName: string;
    dockerRepository: string;
    defaultExternalPort: number;
    defaultInternalPort: number;
    defaultDb: string;
    launchCommand: string;
    minReplics: number;
    maxReplics: number;
    outputLabel: string;
    serviceType: string;
    expectedMemoryConsumption: number;
    dependencies?: string[];
}

const defaultService: Partial<IService> = {
    serviceName: undefined,
    dockerRepository: undefined,
    defaultExternalPort: undefined,
    defaultInternalPort: undefined,
    defaultDb: undefined,
    launchCommand: undefined,
    minReplics: undefined,
    maxReplics: undefined,
    outputLabel: undefined,
    serviceType: undefined,
    expectedMemoryConsumption: undefined,
    dependencies: []
};

interface DispatchToProps {
    loadServices: (name?: string, requiredField?: string) => any;
}

type Props = DispatchToProps & RouteComponentProps;

interface State {
    service: IService;
    isEditing: boolean;
    redirect?: boolean;
}

class Service extends React.Component<Props, State> {

    private tabs = createRef<HTMLUListElement>();
    private dropdown = createRef<HTMLSelectElement>();

    constructor(props: Props) {
        super(props);
        this.state = {
            service: this.propsService() || defaultService,
            isEditing: !this.props.location.state || !this.props.location.state.service
        }
    }

    private propsService = () =>
        this.props.location.state && this.props.location.state.service;

    public componentDidMount(): void {
        const service = this.propsService();
        if (service) {
            this.props.loadServices(service.serviceName);
        }
        M.Tabs.init(this.tabs.current as Element);
        M.FormSelect.init(this.dropdown.current as Element);
        M.updateTextFields();
    }

    public componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any): void {
        const previousService = prevProps.location.state && prevProps.location.state.service;
        const newService = this.props.location.state && this.props.location.state.service;
        if (previousService !== newService) {
            this.setState({ service: newService, isEditing: false });
            M.Tabs.init(this.tabs.current as Element);
            M.updateTextFields();
            M.FormSelect.init(this.dropdown.current as Element);
        }
        if (prevState.isEditing !== this.state.isEditing) {
            M.updateTextFields();
            M.FormSelect.init(this.dropdown.current as Element);
        }
    }

    private onChange = ( { target: { id, value } }: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        this.setState(prevState => ({
            service: {
                ...prevState.service,
                [id]: value
            }
        }));
    };

    private onEdit = () =>
        this.setState(prevState => ({ isEditing: !prevState.isEditing }));

    private onPostSuccessful = () =>
        M.toast({html: `<div>Service ${this.state.service.serviceName} successfully saved!</div>`});

    private onDeleteSuccessful = () => {
        M.toast({html: `<div>Service ${this.state.service.serviceName} successfully removed!</div>`});
        this.setState({ redirect: true });
    };

    public render = () => {
        const service = this.props.location.state && this.props.location.state.service;
        if (this.state.redirect || (window.location.pathname !== "/services/new" && !service)) {
            return <Redirect to='/services'/>;
        }
        return <MainLayout>
            <div className="container">
                <ul className="tabs" ref={this.tabs}>
                    <li className="tab col s6"><a href="#details">Details</a></li>
                    <li className="tab col s6"><a href="#dependencies">Dependencies</a></li>
                </ul>
                <div className="tab-content col s12" id="details">
                    <FormPage new={!service}
                              onEdit={this.onEdit}
                              post={{url: '/services', callback: this.onPostSuccessful}}
                              delete={service && {url: `/services/${service.id}`, callback: this.onDeleteSuccessful}}
                    >
                        <div className="form-content">
                            {Object.entries(this.state.service)
                                .filter(([key, _]) => key !== 'id' && key !== 'dependencies')
                                .map(([key, value], index) =>
                                    <div key={index} className="input-field col s12">
                                        <i className="material-icons prefix">{mapLabelToIcon(key)}</i>
                                        <label className="active" htmlFor={key}>{camelCaseToSentenceCase(key)}</label>
                                        {key === 'serviceType'
                                            ? <select value={value} defaultValue="Choose service type" name={key} id={key}
                                                      onChange={this.onChange}
                                                      ref={this.dropdown}
                                                      disabled={!this.state.isEditing}>
                                                <option disabled>Choose service type</option>
                                                {/* TODO get from database?*/}
                                                <option value='frontend'>Frontend</option>
                                                <option value='backend'>Backend</option>
                                                <option value='database'>Database</option>
                                                <option value='system'>System</option>
                                            </select>
                                            : <input value={value} name={key} id={key}
                                                     type={!value || isNaN(value) ? "text" : "number"} autoComplete="off"
                                                     onChange={this.onChange}
                                                     disabled={!this.state.isEditing}/>
                                        }
                                    </div>
                                )
                            }
                        </div>
                    </FormPage>
                </div>
                <div className="tab-content" id="dependencies">
                    {<ServiceDependencyList service={service}/>}
                </div>
            </div>
        </MainLayout>
    }
}

const mapDispatchToProps: DispatchToProps = {
    loadServices,
};

export default connect(null, mapDispatchToProps)(Service);


{/*
<FormPage onEdit={this.onEdit}
          post={{url: '/services', callback: this.onPostSuccessful}}
          delete={!service
              ? undefined
              : {url: `/services/${service.id}`, callback: this.onDeleteSuccessful}}
>
    <div className="row">
        <ul className="tabs" ref={this.tabs}>
            <li className="tab col s6"><a href="#details">Details</a></li>
            <li className="tab col s6"><a href="#dependencies">Dependencies</a></li>
        </ul>
        <div className="col s12" id="details">
            {Object.entries(this.state.service)
                .filter(([key, _]) => key !== 'id' && key !== 'dependencies')
                .map(([key, value], index) =>
                    <div key={index} className="input-field col s12">
                        <i className="material-icons prefix">{mapLabelToIcon(key)}</i>
                        <label className="active" htmlFor={key}>{camelCaseToSentenceCase(key)}</label>
                        {key === 'serviceType'
                            ? <select value={value} defaultValue="Choose service type" name={key} id={key}
                                      onChange={this.onChange}
                                      ref={this.dropdown}
                                      disabled={!this.state.isEditing}>
                                <option disabled>Choose service type</option>
                                TODO get from database?
                                <option value='frontend'>Frontend</option>
                                <option value='backend'>Backend</option>
                                <option value='database'>Database</option>
                                <option value='system'>System</option>
                            </select>
                            : <input value={value} name={key} id={key}
                                     type={!value || isNaN(value) ? "text" : "number"} autoComplete="off"
                                     onChange={this.onChange}
                                     disabled={!this.state.isEditing}/>
                        }
                    </div>
                )
            }
        </div>
        <div id="dependencies">
            {<ServiceDependencyList service={service}/>}
        </div>
    </div>
</FormPage>*/}
