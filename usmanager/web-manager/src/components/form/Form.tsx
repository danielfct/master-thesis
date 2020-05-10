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
import {deleteData, postData, putData} from "../../utils/api";
import styles from './Form.module.css';
import {RouteComponentProps, withRouter} from "react-router";
import {getTypeFromValue, FieldProps, IValidation} from "./Field";
import {camelCaseToSentenceCase} from "../../utils/text";
import ConfirmDialog from "../dialogs/ConfirmDialog";
import {isEqualWith} from "lodash";
import ActionProgressBar from "./ActionProgressBar";

export type RestOperation = {
  textButton?: string,
  url: string,
  successCallback: (reply?: any, args?: any) => void,
  failureCallback: (reason: string, args?: any) => void
}

export interface IFields {
  [key: string]: FieldProps;
}

export interface IValues {
  [key: string]: any;
}

export interface IErrors {
  [key: string]: string;
}

interface FormPageProps {
  id: string;
  fields: IFields;
  values: IValues;
  isNew?: boolean;
  showSaveButton?: boolean;
  post?: RestOperation;
  put?: RestOperation;
  delete?: RestOperation;
  controlsMode?: 'top' | 'modal';
  onModalConfirm?: (values: IValues) => void;
  saveEntities?: (args: any) => void;
  editable?: boolean;
  deletable?: boolean;
  customButtons?: JSX.Element;
  loading?: boolean;
}

type Props = FormPageProps & RouteComponentProps;

interface State {
  values: IValues;
  savedValues: IValues;
  errors: IErrors;
  isEditing: boolean;
  saveRequired: boolean;
  isLoading: boolean;
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

export const notAllowed = (values: IValues, fieldName: string, args: any[]): string =>
  args.indexOf(values[fieldName].toLowerCase()) !== -1
    ? `${values[fieldName]} is not allowed`
    : "";

export const min = (values: IValues, fieldName: string, args: any): string =>
  values[fieldName] < args
    ? `Required minimum value of ${args}`
    : "";

export const max = (values: IValues, fieldName: string, args: any): string =>
  values[fieldName] > args
    ? `Required maximum value of ${args}`
    : "";

export const number = (values: IValues, fieldName: string): string =>
  getTypeFromValue(values[fieldName]) !== 'number'
    ? `${camelCaseToSentenceCase(fieldName)} is a number`
    : "";

export const requiredAndNotAllowed = (values: IValues, fieldName: string, args: any[]) =>
  required(values, fieldName) || notAllowed(values, fieldName, args);

export const requiredAndNumberAndMin = (values: IValues, fieldName: string, args: any) =>
  required(values, fieldName) || number(values, fieldName) || min(values, fieldName, args);

export const requiredAndNumberAndMax = (values: IValues, fieldName: string, args: any) =>
  required(values, fieldName) || number(values, fieldName) || max(values, fieldName, args);

export const requiredAndNumberAndMinAndMax = (values: IValues, fieldName: string, args: any) =>
  required(values, fieldName) || number(values, fieldName) || min(values, fieldName, args[0]) || max(values, fieldName, args[1]);

class Form extends React.Component<Props, State> {

  state: State = {
    values: this.props.values,
    savedValues: this.props.values,
    errors: {},
    isEditing: this.props.isNew === undefined || this.props.isNew,
    saveRequired: false,
    isLoading: !!this.props.loading,
  };

  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any): void {
    if (prevProps.showSaveButton !== this.props.showSaveButton
        || prevState.values !== this.state.values
        || prevState.savedValues !== this.state.savedValues) {
      this.setState({
        saveRequired: this.props.showSaveButton || this.props.isNew || this.saveRequired()
      })
    }
    if (prevProps.values !== this.props.values) {
      this.setState(Object.keys(this.props.values).reduce((state: State, data: string) => {
        if (!!this.props.values[data]) {
          state.values[data] = this.props.values[data];
        }
        return state;
      }, this.state));
    }
    if (prevProps.loading !== this.props.loading) {
      this.setState({isLoading: !!this.props.loading});
    }
  }

  private saveRequired = () => {
    return !isEqualWith(this.state.savedValues, this.state.values, (first, second) =>
      ((typeof first === 'boolean' && typeof second === 'string' && first.toString() === second)
      || (typeof first === 'string' && typeof second === 'boolean') && first === second.toString()
      || (typeof first === 'number' && typeof second === 'string') && first.toString() === second
      || (typeof first === 'string' && typeof second === 'number') && first === second.toString()) || undefined);
  };

  private validate = (fieldName: string): string => {
    const {fields} = this.props;
    const field: FieldProps | undefined = fields[fieldName];
    const validation: IValidation | undefined = field!.validation;
    const newError: string = validation ? validation.rule(this.state.values, fieldName, validation.args) : "";
    this.setState({errors: {...this.state.errors, [fieldName]: newError}});
    return newError;
  };

  private validateForm(): boolean {
    const errors: IErrors = {};
    Object.keys(this.props.fields).map((fieldName: string) => {
      errors[fieldName] = this.validate(fieldName);
    });
    this.setState({errors});
    return this.isValid(errors);
  }

  private isValid = (errors: IErrors) =>
    Object.values(errors).every(error => !error);

  private onClickEdit = (): void => {
    this.setState(prevState => ({isEditing: !prevState.isEditing}));
  };

  private onClickDelete = (): void => {
    const args = this.state.values[this.props.id];
    if (this.props.delete) {
      deleteData(this.props.delete.url,
        () => {
          this.props.delete?.successCallback(args);
          this.setState({isLoading: false});
        },
        (reply) => {
          this.props.delete?.failureCallback(reply, args);
          this.setState({isLoading: false});
        });
      this.setState({isLoading: true});
    }
  };

  private handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (!this.validateForm()) {
      return;
    }
    const {isNew, post, put, saveEntities} = this.props;
    const args = this.state.values;
    if (isNew) {
      if (post?.url) {
        postData(post.url, this.state.values,
          (reply) => {
            post.successCallback(reply, args);
            this.setState({savedValues: this.state.values, isLoading: false});
          },
          (reply) => {
            post.failureCallback(reply, args);
            this.setState({isLoading: false});
          });
        this.setState({isLoading: true});
      }
    } else {
      if (put?.url) {
        if (this.saveRequired()) {
          putData(put.url, this.state.values,
            () => {
              put.successCallback(args);
              this.setState({savedValues: this.state.values, isLoading: false});
            },
            (reply) => {
              put.failureCallback(reply, args);
              this.setState({isLoading: false});
            });
          this.setState({isLoading: true});
        } else {
          saveEntities?.(args);
        }
      }
    }
  };

  private setValues = (values: IValues) => {
    this.setState({ values: { ...this.state.values, ...values } });
  };

  private onModalConfirm = (event: React.FormEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (!this.validateForm()) {
      return;
    }
    this.props.onModalConfirm?.(this.state.values);
    this.clearValues();
  };

  private clearValues = () =>
    this.setState({values: this.props.values, errors: {}});

  render() {
    const context: IFormContext = {
      ...this.state,
      setValues: this.setValues,
      validate: this.validate
    };
    const {saveRequired, isLoading} = this.state;
    const {id, isNew, values, controlsMode, editable, deletable, customButtons, children} = this.props;
    return (
      <>
        <ConfirmDialog message={`delete ${values[id]}`} confirmCallback={this.onClickDelete}/>
        <form onSubmit={this.handleSubmit} noValidate>
          {(controlsMode === undefined || controlsMode === 'top') && (
            <div>
              <div className='controlsContainer noBorder'>
                {isNew
                  ?
                  <button
                    className={`${styles.controlButton} btn-flat btn-small waves-effect waves-light green-text left slide`}
                    type="submit">
                    {this.props.post?.textButton || 'Save'}
                  </button>
                  :
                  <div>
                    {(editable === undefined || editable) && (
                      <button className='btn-floating btn-flat btn-small waves-effect waves-light right tooltipped'
                              data-position="bottom" data-tooltip="Edit"
                              type="button"
                              onClick={this.onClickEdit}>
                        <i className="large material-icons">edit</i>
                      </button>
                    )}
                    <div className={`${styles.controlButton}`}>
                      {customButtons}
                      {(deletable === undefined || deletable) && (
                        <button className={`modal-trigger btn-flat btn-small waves-effect waves-light red-text`}
                                type="button"
                                data-target="confirm-dialog">
                          {this.props.delete?.textButton || 'Delete'}
                        </button>
                      )}
                      <button className={`btn-flat btn-small waves-effect waves-light green-text slide`}
                              style={saveRequired ? {transform: "scale(1)"} : {transform: "scale(0)"}}
                              type="submit">
                        Save
                      </button>
                    </div>
                  </div>
                }
              </div>
              <ActionProgressBar loading={isLoading}/>
            </div>
          )}
          <div className={`${styles.content}`}>
            <FormContext.Provider value={context}>
              {children}
            </FormContext.Provider>
          </div>
          {(controlsMode === 'modal') && (
            <div className='modal-footer dialog-footer'>
              <button className="waves-effect waves-light btn-flat red-text left"
                      type="button"
                      onClick={this.clearValues}>
                Clear
              </button>
              <button className="modal-close waves-effect waves-light btn-flat red-text"
                      type="button">
                Cancel
              </button>
              <button className="waves-effect waves-light btn-flat green-text"
                      type="button"
                      onClick={this.onModalConfirm}>
                Confirm
              </button>
            </div>
          )}
        </form>
      </>
    )
  }

}

export default withRouter(Form);
