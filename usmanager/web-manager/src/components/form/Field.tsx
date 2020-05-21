import React from "react";
import {mapLabelToIcon} from "../../utils/image";
import {camelCaseToSentenceCase} from "../../utils/text";
import M from "materialize-css";
import {FormContext, IErrors, IFormContext, IValues} from "./Form";
import {TextBox} from "./TextBox";
import {MultilineTextBox} from "./MultilineTextBox";
import {Datepicker} from "./Datepicker";
import {Timepicker} from "./Timepicker";
import {NumberBox} from "./NumberBox";
import {Dropdown} from "./Dropdown";
import {CheckboxList} from "./CheckboxList";
import checkboxListStyles from "./CheckboxList.module.css";

export interface IValidation {
  rule: (values: IValues, id: keyof IValues, args: any) => string;
  args?: any;
}

export interface FieldProps<T = string> {
  id: string;
  type?: "textbox" | "datebox" | "numberbox" | "multilinetextbox" | "collapsible" | "dropdown" | "datepicker"
    | "timepicker" | "list";
  label?: string;
  value?: any;
  dropdown?: { defaultValue: string, values: T[], optionToString?: (v: T) => string, selectCallback?: (value: any) => void };
  number?: { min: number, max: number };
  validation?: IValidation;
  icon?: boolean;
  disabled?: boolean;
}

export const getTypeFromValue = (value: any): string =>
  value === undefined
  || value === ''
  || typeof value === 'boolean'
  || typeof value === 'string' && !value.trim().length
  || isNaN(value)
    ? 'text' : 'number';

export default class Field<T> extends React.Component<FieldProps<T>> {

  private updateField = () =>
    M.updateTextFields();

  componentDidMount(): void {
    this.updateField();
  }

  public componentDidUpdate(prevProps: Readonly<FieldProps<T>>, prevState: Readonly<{}>, snapshot?: any): void {
    this.updateField();
  }

  private onChange = (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
                      id: string, formContext: IFormContext): void => {
    let value;
    try {
      value = JSON.parse(e.currentTarget.value);
    } catch (_) {
      value = e.currentTarget.value;
    }
    formContext.setValue(id, value);
  };

  private onSelect = (value: string, id: string, formContext: IFormContext) => {
    formContext.setValue(id, value);
  };

  private onBlur = (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
                    id: string, formContext: IFormContext): void =>
    formContext.validate(id);

  private onCheck = (listId: keyof IValues, itemId: string, checked: boolean, formContext: IFormContext) => {
    if (checked) {
      formContext.addValue(listId, itemId);
    }
    else {
      formContext.removeValue(listId, itemId);
    }
  };

  private getDateStringFromTimestamp = (value: number) => {
    const date = new Date(value * 1000);
    return `${date.toLocaleDateString("pt")} ${date.toLocaleTimeString("pt") }`
  };

  render() {
    const {id, type, label, dropdown, number, icon, disabled} = this.props;
    const getError = (errors: IErrors): string => (errors ? errors[id] : "");
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
            <div key={id}
                 className={type !== 'list' ? `input-field col s12` : `input-field col s12 ${checkboxListStyles.listWrapper}`}
                 style={icon !== undefined && !icon ? {marginLeft: '10px'} : undefined}>
              {label && type !== "list" && (
                <>
                  {(icon === undefined || icon) &&
                   <i className="material-icons prefix">{mapLabelToIcon(label)}</i>}
                  <label className="active" htmlFor={id}>
                    {camelCaseToSentenceCase(label)}
                  </label>
                </>
              )}
              {(!type || type.toLowerCase() === "textbox") && (
                <TextBox className={getEditorClassname(formContext.errors, !formContext.isEditing, formContext.values[id])}
                         id={id}
                         name={id}
                         value={(formContext.values[id] && formContext.values[id].toString()) || ''}
                         disabled={disabled || !formContext.isEditing}
                         onChange={e => this.onChange(e, id, formContext)}
                         onBlur={e => this.onBlur(e, id, formContext)}/>
              )}
              {type && type.toLowerCase() === "datebox" && (
                <TextBox className={getEditorClassname(formContext.errors, !formContext.isEditing, formContext.values[id])}
                         id={id}
                         name={id}
                         value={this.getDateStringFromTimestamp(formContext.values[id])}
                         disabled={disabled || !formContext.isEditing}
                         onChange={e => this.onChange(e, id, formContext)}
                         onBlur={e => this.onBlur(e, id, formContext)}/>
              )}
              {type && type.toLowerCase() === "numberbox" && (
                <NumberBox className={getEditorClassname(formContext.errors, !formContext.isEditing, formContext.values[id])}
                           id={id}
                           name={id}
                           value={formContext.values[id]}
                           min={number && number.min}
                           max={number && number.max}
                           disabled={disabled || !formContext.isEditing}
                           onChange={e => this.onChange(e, id, formContext)}
                           onBlur={e => this.onBlur(e, id, formContext)}/>
              )}
              {type && type.toLowerCase() === "multilinetextbox" && (
                <MultilineTextBox className={getEditorClassname(formContext.errors, !formContext.isEditing, formContext.values[id])}
                                  id={id}
                                  name={id}
                                  value={formContext.values[id]}
                                  disabled={disabled || !formContext.isEditing}
                                  onChange={e => this.onChange(e, id, formContext)}
                                  onBlur={e => this.onBlur(e, id, formContext)}/>
              )}
              {type && type.toLowerCase() === "dropdown" && dropdown && (
                <Dropdown className={getEditorClassname(formContext.errors, !formContext.isEditing, formContext.values[id])}
                          id={id}
                          name={id}
                          value={formContext.values[id]}
                          disabled={disabled || !formContext.isEditing}
                          onChange={e => { this.onChange(e, id, formContext); dropdown?.selectCallback?.((e.target as HTMLSelectElement).value) }}
                          onBlur={e => this.onBlur(e, id, formContext)}
                          dropdown={dropdown}/>
              )}
              {(type && type.toLowerCase() === "datepicker") && (
                <Datepicker className={getEditorClassname(formContext.errors, !formContext.isEditing, formContext.values[id])}
                            id={id}
                            name={id}
                            value={formContext.values[id]}
                            disabled={disabled || !formContext.isEditing}
                            onSelect={date => this.onSelect(date, id, formContext)}/>
              )}
              {(type && type.toLowerCase() === "timepicker") && (
                <Timepicker className={getEditorClassname(formContext.errors, !formContext.isEditing, formContext.values[id])}
                            id={id}
                            name={id}
                            value={formContext.values[id]}
                            disabled={disabled || !formContext?.isEditing}
                            onSelect={value => this.onSelect(value, id, formContext)}/>
              )}
              {(type && type.toLowerCase() === "list") && (
                <CheckboxList id={id}
                              name={id}
                              values={this.props.value}
                              disabled={disabled || !formContext?.isEditing}
                              onCheck={(listId, itemId, checked) => this.onCheck(listId, itemId, checked, formContext)}/>
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