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
import React, {FormEvent} from "react";
import {deleteData, postData} from "../../utils/data";
import M from "materialize-css";
import './FormPage.css';

interface Props {
    title: string;
    breadcrumbs: [ { title: string, link: string } ];
    postUrl: string;
    deleteUrl: string;
}

interface State {
    isEditing: boolean;
}

export default class FormPage extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            isEditing: false
        };
    }

    onClickEdit = () => {
        this.setState({ isEditing: true });
    };

    onClickCancel = () => {
        this.setState({ isEditing: false });
    };

    onClickDelete = () => {
        deleteData(
            this.props.deleteUrl,
            () => {
                /*this.setState({ isDeleted: true });*/
                M.toast({ html: `<div>${this.props.title} removed successfully!</div>` });
            });
    };

    onSubmitForm = (event: FormEvent) => {
        event.preventDefault();
        // @ts-ignore TODO
        let values = event.target[0].value;
        postData(
            this.props.postUrl,
            values,
            data => {
                /* if (newService.id === 0) {
                     const title = document.title;
                     window.history.replaceState({}, title, '/services/service/' + data);
                 }*/
                console.log(data);
                M.toast({ html: `<div>${this.props.title} saved successfully!</div>` });
            });
    };

    render = () =>
        <MainLayout title={this.props.title} breadcrumbs={this.props.breadcrumbs}>
            <div>
                {
                    this.state.isEditing
                        ? <div>
                            <div className="fixed-action-btn tooltipped" data-position="left" data-tooltip={'Cancel'}
                                 onClick={this.onClickCancel}>
                                <a className="waves-effect waves-light btn-floating red darken-4">
                                    <i className="material-icons">cancel</i>
                                </a>
                            </div>
                            <div className="fixed-action-btn tooltipped two" data-position="left" data-tooltip={'Send'}
                                 onClick={this.onSubmitForm}>
                                <a className="waves-effect waves-light btn-floating green darken-4" type="submit">
                                    <i className="material-icons">send</i>
                                </a>
                            </div>
                        </div>
                        : <div className="fixed-action-btn tooltipped"
                               data-position="left" data-tooltip={`Edit ${this.props.title}`}
                               onClick={this.onClickEdit}>
                            <a className="waves-effect waves-light btn-floating grey darken-3">
                                {/*TODO use grid instead of fixed position*/}
                                <i className="large material-icons">edit</i>
                            </a>
                        </div>
                }
                {
                    /*this.props.item.id !== 0 &&
                    <div>
                      <div className="fixed-action-delete-btn tooltipped" data-position="left"
                           data-tooltip={`Delete ${this.props.title}`}
                           onClick={this.onClickDelete}>
                        <a className="waves-effect waves-light btn-floating grey darken-3">
                          <i className="large material-icons">delete</i>
                        </a>
                      </div>
                    </div>*/
                }
            </div>
            <form className="form container" onSubmit={this.onSubmitForm}>
                {this.props.children}
            </form>
        </MainLayout>
}