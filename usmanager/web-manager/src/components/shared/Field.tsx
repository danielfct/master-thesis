/* The available editors for the field */
import React, {createRef, useContext} from "react";
import {mapLabelToIcon} from "../../utils/image";
import {camelCaseToSentenceCase, capitalize} from "../../utils/text";
import M from "materialize-css";
import { IErrors, IFormContext, FormContext } from "./Form";

type FieldType = "textbox" | "multilinetextbox" | "dropdown";

export interface IFieldProps {
  id: string;
  type?: FieldType;
  label?: string;
  options?: {defaultValue: string, values: string[]};
  required?: boolean;
}

interface DropdownProps {
  id: string;
  name: string;
  value: string;
  disabled?: boolean;
  onChange: (e: React.FormEvent<HTMLSelectElement>) => void
  options?: {defaultValue: string, values: string[]};
}

class Dropdown extends React.Component<DropdownProps,{}> {

  private dropdown = createRef<HTMLSelectElement>();

  public componentDidUpdate(prevProps: Readonly<DropdownProps>, prevState: Readonly<{}>, snapshot?: any): void {
    M.FormSelect.init(this.dropdown.current as Element);
  }

  public render = () => {
    const {id, value, disabled, onChange, options} = this.props;
    return (
      <select
        id={id}
        name={id}
        value={value}
        disabled={disabled}
        onChange={onChange}
        onBlur={(e: React.FormEvent<HTMLSelectElement>) =>
          console.log(e) /* TODO: validate field value */
        }
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

interface TextBoxProps {
  id: string;
  value?: string;
  disabled?: boolean;
  onChange: (e: React.FormEvent<HTMLInputElement>) => void;
  required?: boolean
}

class TextBox extends React.Component<TextBoxProps, any> {

  public componentDidUpdate(prevProps: Readonly<IFieldProps>, prevState: Readonly<{}>, snapshot?: any): void {
    M.updateTextFields();
  }

  private getTypeFromValue = (value: any): string =>
    value === undefined || value === '' || isNaN(value) ? "text" : "number";

  public render(): any {
    const {id, value, disabled, onChange, required} = this.props;
    return (
      <input
        id={id}
        type={this.getTypeFromValue(value)}
        autoComplete="off"
        value={value}
        disabled={disabled}
        onChange={onChange}
        onBlur={(e: React.FormEvent<HTMLInputElement>) =>
          console.log(e) /* TODO: validate field value */
        }
        required={required}
      />
    )
  }

}

interface MultilinetextboxProps {
  id: string;
  value: string;
  disabled?: boolean;
  onChange: (e: React.FormEvent<HTMLTextAreaElement>) => void
}

class MultilineTextBox extends React.Component<MultilinetextboxProps, {}> {

  public componentDidUpdate(prevProps: Readonly<IFieldProps>, prevState: Readonly<{}>, snapshot?: any): void {
    M.updateTextFields();
  }

  public render(): any {
    const {id, value, disabled, onChange} = this.props;
    return (
      <textarea
        id={id}
        value={value}
        disabled={disabled}
        onChange={onChange}
        onBlur={(e: React.FormEvent<HTMLTextAreaElement>) =>
          console.log(e) /* TODO: validate field value */
        }
      />
    )
  }

}

export default class Field extends React.Component<IFieldProps> {
  render = () => {
    const {id, type, label, options, required} = this.props;
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
              {(!type || type!.toLowerCase() === "textbox") && (
                <TextBox id={id}
                         value={formContext?.values[id]}
                         disabled={!formContext?.isEditing}
                         onChange={(e: React.FormEvent<HTMLInputElement>) =>
                           formContext.setValues({ [id]: e.currentTarget.value })
                         }
                         required={required}
                />
              )}
              {type && type!.toLowerCase() === "multilinetextbox" && (
                <MultilineTextBox id={id}
                                  value={formContext?.values[id]}
                                  disabled={!formContext?.isEditing}
                                  onChange={(e: React.FormEvent<HTMLTextAreaElement>) =>
                                    formContext.setValues({ [id]: e.currentTarget.value })
                                  }
                />
              )}
              {type && type!.toLowerCase() === "dropdown" && (
                <Dropdown id={id} name={id} value={formContext?.values[id]}
                          disabled={!formContext?.isEditing}
                          onChange={(e: React.FormEvent<HTMLSelectElement>) =>
                            formContext.setValues({ [id]: e.currentTarget.value })
                          }
                          options={options}
                />
              )}
              {/* TODO - display validation error */}
            </div>
          )
        )}
      </FormContext.Consumer>
    )
  }

}