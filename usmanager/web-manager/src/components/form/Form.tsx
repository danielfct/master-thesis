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
import {deleteData, postData, putData} from "../../utils/api";
import styles from './Form.module.css';
import {RouteComponentProps, withRouter} from "react-router";
import {getTypeFromValue, FieldProps, IValidation} from "./Field";
import {camelCaseToSentenceCase, decodeHTML} from "../../utils/text";
import ConfirmDialog from "../dialogs/ConfirmDialog";
import {isEqualWith} from "lodash";
import ActionProgressBar from "./ActionProgressBar";
import PerfectScrollbar from "react-perfect-scrollbar";
import ScrollBar from "react-perfect-scrollbar";
import M from "materialize-css";

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

export interface IFormModal {
  id: string,
  title?: string,
  fields: IFields,
  values: IValues,
  position?: string,
  content: () => JSX.Element,
  onOpen?: (selected: any) => void,
  open?: boolean,
}

interface FormProps {
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
  dropdown?: { id: string, title: string, empty: string, data: string[]};
  saveEntities?: (args: any) => void;
  customButtons?: JSX.Element;
  loading?: boolean;
}

type Props = FormProps & RouteComponentProps;

interface State {
  values: IValues;
  savedValues: IValues;
  errors: IErrors;
  isEditing: boolean;
  saveRequired: boolean;
  isLoading: boolean;
}

export interface IFormContext extends State {
  setValue: (id: keyof IValues, value: any) => void;
  addValue: (id: keyof IValues, value: any) => void;
  removeValue: (id: keyof IValues, value: any) => void;
  validate: (id: keyof IValues) => void;
}

export const FormContext =
  React.createContext<IFormContext | null>(null);

export const required = (values: IValues, id: keyof IValues): string =>
  values[id] === undefined || values[id] === null || values[id] === ""
    ? `${camelCaseToSentenceCase(id as string)} is required`
    : "";

export const notAllowed = (values: IValues, id: keyof IValues, args: any[]): string =>
  args.indexOf(values[id].toLowerCase()) !== -1
    ? `${values[id]} is not allowed`
    : "";

export const min = (values: IValues, id: keyof IValues, args: any): string =>
  values[id] < args
    ? `Required minimum value of ${args}`
    : "";

export const max = (values: IValues, id: keyof IValues, args: any): string =>
  values[id] > args
    ? `Required maximum value of ${args}`
    : "";

export const number = (values: IValues, id: keyof IValues): string =>
  getTypeFromValue(values[id]) !== 'number'
    ? `${camelCaseToSentenceCase(id as string)} is a number`
    : "";

export const requiredAndNotAllowed = (values: IValues, id: keyof IValues, args: any[]) =>
  required(values, id) || notAllowed(values, id, args);

export const requiredAndNumberAndMin = (values: IValues, id: keyof IValues, args: any) =>
  required(values, id) || number(values, id) || min(values, id, args);

export const requiredAndNumberAndMax = (values: IValues, id: keyof IValues, args: any) =>
  required(values, id) || number(values, id) || max(values, id, args);

export const requiredAndNumberAndMinAndMax = (values: IValues, id: keyof IValues, args: any) =>
  required(values, id) || number(values, id) || min(values, id, args[0]) || max(values, id, args[1]);

class Form extends React.Component<Props, State> {

  private dropdown = createRef<HTMLButtonElement>();
  private scrollbar: (ScrollBar | null) = null;

  state: State = {
    values: this.props.values,
    savedValues: this.props.values,
    errors: {},
    isEditing: this.props.isNew === undefined || this.props.isNew,
    saveRequired: false,
    isLoading: !!this.props.loading,
  };

  componentDidMount(): void {
    this.initDropdown();
  }

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

    this.initDropdown();
  }

  private initDropdown = () =>
    M.Dropdown.init(this.dropdown.current as Element,
      {
        onOpenEnd: this.onOpenDropdown
      });

  private onOpenDropdown = () =>
    this.scrollbar?.updateScroll();

  private saveRequired = () => {
    return !isEqualWith(this.state.savedValues, this.state.values, (first, second) =>
      ((typeof first === 'boolean' && typeof second === 'string' && first.toString() === second)
      || (typeof first === 'string' && typeof second === 'boolean') && first === second.toString()
      || (typeof first === 'number' && typeof second === 'string') && first.toString() === second
      || (typeof first === 'string' && typeof second === 'number') && first === second.toString()) || undefined);
  };

  private validate = (id: keyof IValues): string => {
    const {fields} = this.props;
    const field: FieldProps | undefined = fields[id];
    const validation: IValidation | undefined = field!.validation;
    const newError: string = validation ? validation.rule(this.state.values, id, validation.args) : "";
    this.setState({errors: {...this.state.errors, [id]: newError}});
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
    const validate = this.validateForm();
    const {isNew, post, put, saveEntities} = this.props;
    const args = this.state.values;
    if (isNew) {
      if (post?.url) {
        if (validate) {
          postData(post.url, this.state.values,
            (reply, ) => {
              post.successCallback(reply, args);
              this.setState({savedValues: this.state.values, isLoading: false});
            },
            (reply) => {
              post.failureCallback(reply, args);
              this.setState({isLoading: false});
            });
          this.setState({isLoading: true});
        }
      }
    }
    else {
      if (put?.url) {
        if (validate) {
          if (this.saveRequired()) {
            putData(put.url, this.state.values,
              (reply) => {
                put.successCallback(reply, args);
                this.setState({savedValues: this.state.values, isLoading: false});
              },
              (reason) => {
                put.failureCallback(reason, args);
                this.setState({isLoading: false});
              });
            this.setState({isLoading: true});
          } else {
            saveEntities?.(args);
          }
        }
      }
    }
  };

  private setValue = (id: keyof IValues, value: IValues, validate?: boolean) => {
    const values = { [id] : value };
    if (validate === undefined || validate) {
      this.setState({ values: { ...this.state.values, ...values } }, () => this.validate(id as string));
    }
    else {
      this.setState({ values: { ...this.state.values, ...values } });
    }
  };

  private addValue = (id: keyof IValues, value: any) =>
    this.setValue(id, this.state.values[id] ? this.state.values[id].concat(value) : [value]);

  private removeValue = (id: keyof IValues, value: any) => {
    let values = this.state.values[id].filter((v: any) => v !== value);
    if (!values.length) {
      values = undefined;
    }
    this.setValue(id, values, false);
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

  private onAdd = (event: React.MouseEvent<HTMLLIElement>): void => {
    const data = decodeHTML((event.target as HTMLLIElement).innerHTML);
    // @ts-ignore
    this.setState({ [data]: { value: data, isChecked: false, isNew: true } });
    //TODO this.props.onAdd?.(data);
  };

  render() {
    const context: IFormContext = {
      ...this.state,
      setValue: this.setValue,
      addValue: this.addValue,
      removeValue: this.removeValue,
      validate: this.validate
    };
    const {saveRequired, isLoading} = this.state;
    const {id, isNew, values, controlsMode, put: editable, delete: deletable, customButtons, dropdown, children} = this.props;
    return (
      <>
        <ConfirmDialog message={`${this.props.delete?.textButton?.toLowerCase() || 'delete'} ${values[id]}`}
                       confirmCallback={this.onClickDelete}/>
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
                    {editable !== undefined && (
                      <button className='btn-floating btn-flat btn-small waves-effect waves-light right tooltipped'
                              data-position="bottom"
                              data-tooltip="Edit"
                              type="button"
                              onClick={this.onClickEdit}>
                        <i className="large material-icons">edit</i>
                      </button>)}
                    <div className={`${styles.controlButton}`}>
                      {customButtons}
                      {deletable !== undefined && (
                        <button className='modal-trigger btn-flat btn-small waves-effect waves-light red-text'
                                type="button"
                                data-target="confirm-dialog">
                          {this.props.delete?.textButton || 'Delete'}
                        </button>)}
                      <button className='btn-flat btn-small waves-effect waves-light green-text slide'
                              style={saveRequired ? {transform: "scale(1)"} : {transform: "scale(0)"}}
                              type="submit">
                        Save
                      </button>
                    </div>
                  </div>
                }
                {dropdown && (
                  <>
                    <button className={`dropdown-trigger btn-floating btn-flat btn-small waves-effect waves-light right tooltipped`}
                            data-position="bottom" data-tooltip={dropdown.title}
                            data-target={`dropdown-${dropdown.id}`}
                            ref={this.dropdown}>
                      <i className="material-icons">add</i>
                    </button>
                    <ul id={`dropdown-${dropdown.id}`}
                        className={`dropdown-content ${styles.dropdown}`}>
                      <li className={`${styles.disabled}`}>
                        <a className={`${!dropdown?.data.length ? styles.dropdownEmpty : undefined}`}>
                          {dropdown.data.length ? dropdown.title : dropdown.empty}
                        </a>
                      </li>
                      <PerfectScrollbar ref={(ref) => { this.scrollbar = ref; }}>
                        {dropdown.data.map((data, index) =>
                          <li key={index} onClick={this.onAdd}>
                            <a>
                              {data}
                            </a>
                          </li>
                        )}
                      </PerfectScrollbar>
                    </ul>
                  </>
                )}
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
