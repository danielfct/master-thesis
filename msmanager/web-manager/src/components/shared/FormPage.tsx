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

import MainLayout from "./MainLayout";
import React, {createRef, FormEvent} from "react";
import {deleteData} from "../../utils/data";
import M from "materialize-css";
import './FormPage.css';
import {RouteComponentProps, withRouter} from "react-router";

interface FormPageProps {
    onEdit: () => void;
    post: { url: string, callback: () => void };
    delete?: { url: string, callback: () => void }
}

type Props = FormPageProps & RouteComponentProps;

interface State {
    isEditing: boolean;
}

class FormPage extends React.Component<Props, State> {

    private fab = createRef<HTMLDivElement>();

    constructor(props: Props) {
        super(props);
        this.state = { isEditing: !this.props.delete };
    }

    public componentDidMount(): void {
        M.FloatingActionButton.init(this.fab.current as Element, {
            direction: 'left',
            hoverEnabled: false
        });
    }

    private onClickEdit = (): void => {
        this.props.onEdit();
        this.setState({ isEditing: !this.state.isEditing });
    }

    private onClickDelete = (): void => {
        if (this.props.delete) {
            deleteData(this.props.delete.url, () => this.props.delete && this.props.delete.callback());
        }
    };

    private onSubmitForm = (event: FormEvent): void => {
        event.preventDefault();
        /*// @ts-ignore TODO
        let values = event.target[0].value;
        postData(
            this.props.postUrl,
            values,
            data => {
                /!* if (newService.id === 0) {
                     const title = document.title;
                     window.history.replaceState({}, title, '/services/service/' + data);
                 }*!/
                console.log(data);
                M.toast({ html: `<div>${this.props.title} saved successfully!</div>` });
            });*/
    };

    private isNew = (): boolean =>
        !this.props.delete;

    public render = () => {
        const {isEditing} = this.state;
        const {children} = this.props;
        return <MainLayout>
            {this.isNew()
                ? <div className="fixed-action-btn tooltipped"
                       data-position="left" data-tooltip="Save"
                       onClick={this.onSubmitForm}>
                    <a className="waves-effect waves-light btn-floating green darken-4" type="submit">
                        <i className="material-icons">save</i>
                    </a>
                </div>
                : <div>
                    <div className="fixed-action-small-btn tooltipped slide"
                         data-position="bottom" data-tooltip="Save"
                         onClick={this.onSubmitForm}
                         style={isEditing ? {transform: "translate(-85px, 0)"} : {transform: ""}}>
                        <a className="waves-effect waves-light btn-floating btn-small green darken-4" type="submit">
                            <i className="material-icons">save</i>
                        </a>
                    </div>
                    <div className="fixed-action-small-btn tooltipped slide"
                         data-position="bottom" data-tooltip="Delete"
                         onClick={this.onClickDelete}
                         style={isEditing ? {transform: "translate(-44px, 0)"} : {transform: ""}}>
                        <a className="waves-effect waves-light btn-floating btn-small red darken-4">
                            <i className="material-icons">delete</i>
                        </a>
                    </div>
                    <div className="fixed-action-btn tooltipped"
                         data-position="bottom" data-tooltip="Edit"
                         onClick={this.onClickEdit}>
                        <a className="waves-effect waves-light btn-floating grey darken-3">
                            <i className="large material-icons">edit</i>
                        </a>
                    </div>
                </div>
            }
            <form className="form container" onSubmit={this.onSubmitForm}>
                {children}
            </form>
        </MainLayout>
    }
}

export default withRouter(FormPage);
