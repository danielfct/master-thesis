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

import React from "react";
import "./DeleteButton.css";

interface Props {
    tooltip: string;
    delete: boolean;
}

interface State {
    isEditing: boolean;
}

export default class ActionButtons extends React.Component<Props, State> {

    onClickEdit = () =>
        this.setState({ isEditing: true });

    onClickCancel = () =>
        this.setState({ isEditing: false });

    render = () =>
        <div>
            {
                this.state.isEditing
                    ? <div className="fixed-action-edit-btn tooltipped"
                           data-position="left" data-tooltip={`Edit ${this.props.tooltip}`}
                           onClick={this.onClickEdit}>
                        <a className="waves-effect waves-light btn-floating grey darken-3">
                            {/*TODO use grid instead of fixed position*/}
                            <i className="large material-icons">edit</i>
                        </a>
                    </div>
                    : <div className="fixed-action-cancel-btn tooltipped" data-position="left" data-tooltip={'Cancel'}
                           onClick={this.onClickCancel}>
                        <a className="waves-effect waves-light btn-floating grey darken-3">
                            <i className="large material-icons">cancel</i>
                        </a>
                    </div>
            }
            {
                this.props.delete &&
                <div>
                  <div className="fixed-action-delete-btn tooltipped" data-position="left"
                       data-tooltip={`Delete ${this.props.tooltip}`}>
                    <a className="waves-effect waves-light btn-floating grey darken-3">
                      <i className="large material-icons">delete</i>
                    </a>
                  </div>
                </div>
            }
        </div>
}