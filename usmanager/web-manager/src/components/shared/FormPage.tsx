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

import MainLayout from "./MainLayout";
import React, {createRef, FormEvent} from "react";
import {deleteData} from "../../utils/api";
import M from "materialize-css";
import './FormPage.css';
import {RouteComponentProps, withRouter} from "react-router";
import PerfectScrollbar from "react-perfect-scrollbar";

interface FormPageProps {
    onEdit: () => void;
    post: { url: string, callback: () => void };
    delete?: { url: string, callback: () => void };
    new?: boolean;
}

type Props = FormPageProps & RouteComponentProps;

interface State {
    isEditing: boolean;
}

class FormPage extends React.Component<Props, State> {

    private fab = createRef<HTMLDivElement>();

    constructor(props: Props) {
        super(props);
        this.state = { isEditing: this.props.new || false};
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
    };

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

    public render = () => {
        const {isEditing} = this.state;
        const {children} = this.props;
        return <form onSubmit={this.onSubmitForm}>
            <div className="form-controls-container">
                {this.props.new
                    ? <div className="row">
                        <a className="control-btn btn-flat btn-small waves-effect waves-light green-text right slide"
                           type="submit"
                           tabIndex={0}
                           onClick={this.onSubmitForm}>
                            Save
                        </a>
                    </div>
                    : <div className="row">
                        <a className="control-btn btn-floating btn-flat btn-small waves-effect waves-light right tooltipped"
                           data-position="bottom" data-tooltip="Edit"
                           onClick={this.onClickEdit}>
                            <i className="large material-icons">edit</i>
                        </a>
                        <a className="control-btn btn-flat btn-small waves-effect waves-light red-text right slide"
                           tabIndex={0}
                           style={isEditing ? {transform: "scale(1)"} : {transform: "scale(0)"}}
                           onClick={this.onClickDelete}>
                            Delete
                        </a>
                        <a className="control-btn btn-flat btn-small waves-effect waves-light green-text right slide"
                           type="submit"
                           tabIndex={0}
                           style={isEditing ? {transform: "scale(1)"} : {transform: "scale(0)"}}
                           onClick={this.onSubmitForm}>
                            Save
                        </a>
                    </div>
                }
            </div>
            {children}
        </form>
    }
}

export default withRouter(FormPage);
