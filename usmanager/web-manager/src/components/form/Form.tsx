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

import React, {createRef, FormEvent} from "react";
import {deleteData, postData, putData} from "../../utils/api";
import M from "materialize-css";
import styles from './Form.module.css';
import {RouteComponentProps, withRouter} from "react-router";
import {getTypeFromValue, FieldProps, IValidation} from "./Field";
import {camelCaseToSentenceCase} from "../../utils/text";
import ConfirmDialog from "../dialogs/ConfirmDialog";
import { isEqual, isEqualWith } from "lodash";

export interface IFields {
  [key: string]: FieldProps;
}

export interface IValues {
  [key: string]: any;
}

export interface IErrors {
  [key: string]: string;
}

type restOperation = {
  url: string,
  successCallback: (reply?: any, args?: any) => void,
  failureCallback: (reason: string, args?: any) => void
}

interface FormPageProps {
  id: string;
  fields: IFields;
  values: IValues;
  isNew: boolean;
  showSaveButton?: boolean;
  post: restOperation;
  put: restOperation;
  delete?: restOperation;
}

type Props = FormPageProps & RouteComponentProps;

interface State {
  values: IValues;
  errors: IErrors;
  isEditing: boolean;
  showSaveButton: boolean;
}

export interface IFormContext extends State {
  setValues: (values: IValues) => void;
  validate: (fieldName: string) => void;
}

export const FormContext =
  React.createContext<IFormContext | null>(null);

export const required = (values: IValues, fieldName: string): string =>
  values[fieldName] === undefined || values[fieldName] === null || values[fieldName] === ""
    ? `${camelCaseToSentenceCase(fieldName)} is required`
    : "";

export const min = (values: IValues, fieldName: string, args: any): string =>
  values[fieldName] < args
    ? `Required minimum value of ${args}`
    : "";

export const number = (values: IValues, fieldName: string): string =>
  getTypeFromValue(values[fieldName]) !== 'number'
    ? `${camelCaseToSentenceCase(fieldName)} is a number`
    : "";

export const requiredAndNumberAndMin = (values: IValues, fieldName: string, args: any) =>
  required(values, fieldName) || number(values, fieldName) || min(values, fieldName, args);

class Form extends React.Component<Props, State> {

  state: State = {
    values: this.props.values,
    errors: {},
    isEditing: this.props.isNew,
    showSaveButton: false,
  };

  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any): void {
    if (prevProps.showSaveButton != this.props.showSaveButton || prevState.values != this.state.values) {
      this.setState({
        showSaveButton: this.props.showSaveButton
          || this.props.isNew
          || !isEqualWith(this.props.values, this.state.values, (first, second) =>
            ((typeof first == 'boolean' && typeof second == 'string' && first.toString() == second)
              || (typeof first == 'string' && typeof second == 'boolean') && first == second.toString()
              || (typeof first == 'number' && typeof second == 'string') && first.toString() == second
              || (typeof first == 'string' && typeof second == 'number') && first == second.toString()) || undefined)
      })
    }
  }

  private validate = (fieldName: string): string => {
    const {fields} = this.props;
    const field: FieldProps | undefined = fields[fieldName];
    const validation: IValidation | undefined = field!.validation;
    const newError: string = validation ? validation.rule(this.state.values, fieldName, validation.args) : "";
    this.setState({ errors: { ...this.state.errors, [fieldName]: newError } });
    return newError;
  };

  private validateForm(): boolean {
    const errors: IErrors = {};
    Object.keys(this.props.fields).map((fieldName: string) => {
      errors[fieldName] = this.validate(fieldName);
    });
    this.setState({ errors });
    return this.isValid(errors);
  }

  private isValid = (errors: IErrors) =>
    Object.values(errors).every(error => !error);

  private onClickEdit = (): void => {
    this.setState(prevState => ({ isEditing: !prevState.isEditing }));
  };

  private onClickDelete = (): void => {
    const args = this.state.values[this.props.id];
    if (this.props.delete) {
      deleteData(this.props.delete.url,
        () => this.props.delete?.successCallback(args),
        () => this.props.delete?.failureCallback(args));
    }
  };

  private handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (!this.validateForm()) {
      return;
    }
    const {id, isNew, post, put} = this.props;
    const args = this.state.values[id];
    if (isNew) {
      postData(post.url, this.state.values,
        () => post.successCallback(args),
        () => post.failureCallback(args));
    }
    else {
      putData(put.url, this.state.values,
        () => put.successCallback(args),
        () => put.failureCallback(args));
    }
  };


  private setValues = (values: IValues) => {
    this.setState({ values: { ...this.state.values, ...values } });
  };


  render() {
    const context: IFormContext = {
      ...this.state,
      setValues: this.setValues,
      validate: this.validate
    };
    const {showSaveButton} = this.state;
    const {children} = this.props;
    return (
      <>
        <ConfirmDialog message={`delete ${this.props.values[this.props.id]}`} confirmCallback={this.onClickDelete}/>
        <form onSubmit={this.handleSubmit} noValidate>
          <div className={`controlsContainer`}>
            {this.props.isNew
              ?
              <button className={`${styles.controlButton} btn-flat btn-small waves-effect waves-light green-text right slide`}
                      type="submit">
                Save
              </button>
              :
              <div>
                <button className={`btn-floating btn-flat btn-small waves-effect waves-black right tooltipped`}
                        data-position="bottom" data-tooltip="Edit"
                        type="button"
                        onClick={this.onClickEdit}>
                  <i className="large material-icons">edit</i>
                </button>
                <div className={`${styles.controlButton}`}>
                  <button className={`modal-trigger btn-flat btn-small waves-effect waves-black red-text`}
                          type="button"
                          data-target="confirm-dialog">
                    Delete
                  </button>
                  <button className={`btn-flat btn-small waves-effect waves-black green-text slide`}
                          style={showSaveButton ? {transform: "scale(1)"} : {transform: "scale(0)"}}
                          type="submit">
                    Save
                  </button>
                </div>
              </div>
            }
          </div>
          <div className={`${styles.content}`}>
            <FormContext.Provider value={context}>
              {children}
            </FormContext.Provider>
          </div>
        </form>
      </>
    )
  }
}

export default withRouter(Form);