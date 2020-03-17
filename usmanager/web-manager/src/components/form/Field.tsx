import React from "react";
import {mapLabelToIcon} from "../../utils/image";
import {camelCaseToSentenceCase} from "../../utils/text";
import M from "materialize-css";
import {FormContext, IErrors, IFormContext, IValues} from "./Form";
import {TextBox} from "./TextBox";
import {MultilineTextBox} from "./MultilineTextBox";
import {Dropdown} from "./Dropdown";
import {Datepicker} from "./Datepicker";
import {Timepicker} from "./Timepicker";
import {NumberBox} from "./NumberBox";
import { assign } from "lodash";

export interface IValidation {
  rule: (values: IValues, fieldName: string, args: any) => string;
  args?: any;
}

export interface FieldProps {
  id: string[];
  type?: "textbox" | "datebox" | "numberbox" | "multilinetextbox" | "collapsible" | "dropdown" | "datepicker" | "timepicker";
  label?: string;
  dropdown?: { defaultValue: string, values: string[], selectCallback?: (value: any) => void };
  validation?: IValidation;
  icon?: boolean;
  disabled?: boolean;
}

export const getTypeFromValue = (value: any): string =>
  value === undefined || value === '' || typeof value === 'boolean' || isNaN(value) ? 'text' : 'number';

export default class Field extends React.Component<FieldProps> {

  componentDidMount(): void {
    M.updateTextFields();
  }

  public componentDidUpdate(prevProps: Readonly<FieldProps>, prevState: Readonly<{}>, snapshot?: any): void {
    M.updateTextFields();
  }

  private onChange = (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
                      id: string[], formContext: IFormContext): void => {
    const values = this.buildValueObjectFromId(id, e.currentTarget.value);
    formContext.setValues(values, id.length > 1 ? id[0] : undefined);
  };

  private onSelect = (value: string, id: string[], formContext: IFormContext) => {
    const values = this.buildValueObjectFromId(id, value);
    formContext.setValues(values);
    formContext.validate(id[0]);
  };

  private onBlur = (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
                    id: string[], formContext: IFormContext): void =>
    formContext.validate(id[0]);

  private getDateStringFromTimestamp = (value: number) => {
    const date = new Date(value * 1000);
    return `${date.toLocaleDateString("pt")} ${date.toLocaleTimeString("pt") }`
  };

  private buildValueObjectFromId = (id: string[], value: string) => {
    const reversedIds = [...id].reverse();
    const values = reversedIds.reduce( ( values: IValues, key, index ) => {
      if (index == 0) {
        values[key] = value;
      }
      else {
        values[key] = { [reversedIds[index-1]]: values[reversedIds[index-1]] };
      }
      return values;
    }, {} );
    const keys = Object.keys(values);
    for (let i = 0; i < keys.length - 1; i++) {
      delete values[keys[i]];
    }
    return values;
  };

  private getFormValueFromId = (values: IValues, id: string[]) => {
    let value;
    for (let i = 0; i < id.length; i++) {
      value = i == 0 ? values[id[i]] : value?.[id[i]];
    }
    return value;
  };

  render() {
    const {id, type, label, dropdown, icon, disabled} = this.props;
    const getError = (errors: IErrors): string => (errors ? errors[id[0]] : "");
    const getEditorClassname = (errors: IErrors, disabled: boolean, value: string): string => {
      const hasErrors = getError(errors);
      if (hasErrors) {
        return "invalidate-field";
      }
      else if (!hasErrors && !disabled && (getTypeFromValue(value) !== 'text' || value)) {
        return "validate-field";
      }
      else {
        return "no-validation-field";
      }
    };
    return (
      <FormContext.Consumer>
        {(formContext: IFormContext | null) => (
          formContext && (
            <div key={id[0]}
                 className={`input-field col s12`}
                 style={icon != undefined && !icon ? {marginLeft: '10px'} : undefined}>
              {label && (
                <>
                  {(icon == undefined || icon) &&
                  <i className="material-icons prefix">{mapLabelToIcon(label)}</i>}
                  <label className="active" htmlFor={id[0]}>
                    {camelCaseToSentenceCase(label)}
                  </label>
                </>
              )}
              {(!type || type.toLowerCase() === "textbox") && (
                <TextBox className={getEditorClassname(formContext.errors, !formContext.isEditing, this.getFormValueFromId(formContext.values, id))}
                         id={id[0]}
                         name={id[0]}
                         value={this.getFormValueFromId(formContext.values, id).toString()}
                         disabled={disabled || !formContext.isEditing}
                         onChange={e => this.onChange(e, id, formContext)}
                         onBlur={e => this.onBlur(e, id, formContext)}/>
              )}
              {type && type.toLowerCase() === "datebox" && (
                <TextBox className={getEditorClassname(formContext.errors, !formContext.isEditing, this.getFormValueFromId(formContext.values, id))}
                         id={id[0]}
                         name={id[0]}
                         value={this.getDateStringFromTimestamp(this.getFormValueFromId(formContext.values, id))}
                         disabled={disabled || !formContext.isEditing}
                         onChange={e => this.onChange(e, id, formContext)}
                         onBlur={e => this.onBlur(e, id, formContext)}/>
              )}
              {type && type.toLowerCase() === "numberbox" && (
                <NumberBox className={getEditorClassname(formContext.errors, !formContext.isEditing, this.getFormValueFromId(formContext.values, id))}
                           id={id[0]}
                           name={id[0]}
                           value={this.getFormValueFromId(formContext.values, id)}
                           disabled={disabled || !formContext.isEditing}
                           onChange={e => this.onChange(e, id, formContext)}
                           onBlur={e => this.onBlur(e, id, formContext)}/>
              )}
              {type && type.toLowerCase() === "multilinetextbox" && (
                <MultilineTextBox className={getEditorClassname(formContext.errors, !formContext.isEditing, this.getFormValueFromId(formContext.values, id))}
                                  id={id[0]}
                                  name={id[0]}
                                  value={this.getFormValueFromId(formContext.values, id)}
                                  disabled={disabled || !formContext.isEditing}
                                  onChange={e => this.onChange(e, id, formContext)}
                                  onBlur={e => this.onBlur(e, id, formContext)}/>
              )}
              {type && type.toLowerCase() === "dropdown" && (
                <Dropdown className={getEditorClassname(formContext.errors, !formContext.isEditing, this.getFormValueFromId(formContext.values, id))}
                          id={id[0]}
                          name={id[0]}
                          value={this.getFormValueFromId(formContext.values, id)}
                          disabled={disabled || !formContext.isEditing}
                          onChange={e => { this.onChange(e, id, formContext); dropdown?.selectCallback?.((e.target as HTMLSelectElement).value) }}
                          onBlur={e => this.onBlur(e, id, formContext)}
                          dropdown={dropdown}/>
              )}
              {(type && type.toLowerCase() === "datepicker") && (
                <Datepicker className={getEditorClassname(formContext.errors, !formContext.isEditing, this.getFormValueFromId(formContext.values, id))}
                            id={id[0]}
                            name={id[0]}
                            value={this.getFormValueFromId(formContext.values, id)}
                            disabled={disabled || !formContext.isEditing}
                            onSelect={date => this.onSelect(date, id, formContext)}/>
              )}
              {(type && type.toLowerCase() === "timepicker") && (
                <Timepicker className={getEditorClassname(formContext.errors, !formContext.isEditing, this.getFormValueFromId(formContext.values, id))}
                            id={id[0]}
                            name={id[0]}
                            value={this.getFormValueFromId(formContext.values, id)}
                            disabled={disabled || !formContext?.isEditing}
                            onSelect={value => this.onSelect(value, id, formContext)}/>
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