/* The available editors for the field */
import React, {createRef, useContext} from "react";
import {mapLabelToIcon} from "../../utils/image";
import {camelCaseToSentenceCase, capitalize} from "../../utils/text";
import M from "materialize-css";
import {IErrors, IFormContext, FormContext, IValues} from "./Form";

interface TextBoxProps {
  className: string;
  id: string;
  name: string;
  value?: string;
  disabled?: boolean;
  onChange: (e: React.FormEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FormEvent<HTMLInputElement>) => void;
}

export const getTypeFromValue = (value: any): string =>
  value === undefined || value === '' || isNaN(value) ? 'text' : 'number';

class TextBox extends React.Component<TextBoxProps, any> {

  public render(): any {
    const {className, id, name, value, disabled, onChange, onBlur} = this.props;
    return (
      <>
        <input
          className={className}
          style={className.includes('invalid') ? {borderBottom: "1px solid #F44336", boxShadow: "0 1px 0 0 #F44336"} : undefined}
          id={id}
          name={name}
          type={getTypeFromValue(value)}
          value={value}
          disabled={disabled}
          autoComplete="off"
          onChange={onChange}
          onBlur={onBlur}
        />
      </>
    )
  }

}

interface MultilinetextboxProps {
  className: string;
  id: string;
  name: string;
  value: string;
  disabled?: boolean;
  onChange: (e: React.FormEvent<HTMLTextAreaElement>) => void;
  onBlur: (e: React.FormEvent<HTMLTextAreaElement>) => void;
}

class MultilineTextBox extends React.Component<MultilinetextboxProps, {}> {

  public render(): any {
    const {className, id, name, value, disabled, onChange, onBlur} = this.props;
    return (
      <textarea
        className={className}
        id={id}
        name={name}
        value={value}
        disabled={disabled}
        onChange={onChange}
        onBlur={onBlur}
      />
    )
  }

}

interface DropdownProps {
  className: string;
  id: string;
  name: string;
  value: string;
  disabled?: boolean;
  options?: {defaultValue: string, values: string[]};
  onChange: (e: React.FormEvent<HTMLSelectElement>) => void;
  onBlur: (e: React.FormEvent<HTMLSelectElement>) => void;
}

class Dropdown extends React.Component<DropdownProps,{}> {

  private dropdown = createRef<HTMLSelectElement>();

  private initDropdown = (): void => {
    M.FormSelect.init(this.dropdown.current as Element);
  };

  componentDidMount(): void {
    this.initDropdown();
  }

  public componentDidUpdate(prevProps: Readonly<DropdownProps>, prevState: Readonly<{}>, snapshot?: any): void {
    this.initDropdown();
  }

  public render = () => {
    const {className, id, name, value, disabled, onChange, onBlur, options} = this.props;
    return (
      <select
        className={className}
        id={id}
        name={name}
        value={value}
        disabled={disabled}
        onChange={onChange}
        onBlur={onBlur}
        defaultValue={options && options.defaultValue}
        ref={this.dropdown}
      >
        {options && (
          <>
            <option key={options.defaultValue} disabled>
              {options.defaultValue}
            </option>
            {options.values.map(option =>
              <option key={option} value={option.toLowerCase()}>
                {capitalize(option)}
              </option>
            )}
          </>
        )}
      </select>
    )
  }

}

type FieldType = "textbox" | "multilinetextbox" | "dropdown";

export interface IValidation {
  rule: (values: IValues, fieldName: string, args: any) => string;
  args?: any;
}

export interface IFieldProps {
  id: string;
  type?: FieldType;
  label?: string;
  options?: {defaultValue: string, values: string[]};
  validation?: IValidation;
}

export default class Field extends React.Component<IFieldProps> {

  public componentDidMount(): void {
    M.updateTextFields();
  }

  public componentDidUpdate(prevProps: Readonly<MultilinetextboxProps>, prevState: Readonly<{}>, snapshot?: any): void {
    M.updateTextFields();
  }

  private onChange = (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
                      formContext: IFormContext, id: string): void =>
    formContext.setValues({ [id]: e.currentTarget.value });

  private onBlur = (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
                    formContext: IFormContext, id: string): void =>
    formContext.validate(id);

  render = () => {
    const {id, type, label, options} = this.props;
    const getError = (errors: IErrors): string => (errors ? errors[id] : "");
    const getEditorClassname = (errors: IErrors): string => getError(errors) ? "validate invalid" : "validate";
    return (
      <FormContext.Consumer>
        {(formContext: IFormContext | null) => (
          formContext && (
            <div key={id} className="input-field col s12">
              {label && (
                <>
                  <i className="material-icons prefix">{mapLabelToIcon(label)}</i>
                  <label className="active" htmlFor={id}>{camelCaseToSentenceCase(label)}</label>
                </>
              )}
              {(!type || type.toLowerCase() === "textbox") && (
                <TextBox className={getEditorClassname(formContext.errors)}
                         id={id}
                         name={id}
                         value={formContext?.values[id]}
                         disabled={!formContext?.isEditing}
                         onChange={e => this.onChange(e, formContext, id)}
                         onBlur={e => this.onBlur(e, formContext, id)}
                />
              )}
              {type && type.toLowerCase() === "multilinetextbox" && (
                <MultilineTextBox className={getEditorClassname(formContext.errors)}
                                  id={id}
                                  name={id}
                                  value={formContext?.values[id]}
                                  disabled={!formContext?.isEditing}
                                  onChange={e => this.onChange(e, formContext, id)}
                                  onBlur={e => this.onBlur(e, formContext, id)}

                />
              )}
              {type && type.toLowerCase() === "dropdown" && (
                <Dropdown className={getEditorClassname(formContext.errors)}
                          id={id}
                          name={id}
                          value={formContext?.values[id]}
                          disabled={!formContext?.isEditing}
                          onChange={e => this.onChange(e, formContext, id)}
                          onBlur={e => this.onBlur(e, formContext, id)}
                          options={options}
                />
              )}
              {getError(formContext.errors) && (
                <span className={"helper-text red-text darken-3"}>
                    {getError(formContext.errors)}
                  </span>
              )}
            </div>
          )
        )}
      </FormContext.Consumer>
    )
  }

}