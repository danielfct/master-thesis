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

export interface IValidation {
  rule: (values: IValues, fieldName: string, args: any) => string;
  args?: any;
}

export interface FieldProps {
  id: string;
  type?: "textbox" | "multilinetextbox" | "dropdown" | "datepicker" | "timepicker";
  label?: string;
  options?: { defaultValue: string, values: string[] };
  validation?: IValidation;
  icon?: boolean;
}

export const getTypeFromValue = (value: any): string =>
  value === undefined || value === '' || isNaN(value) ? 'text' : 'number';

export default class Field extends React.Component<FieldProps> {

  componentDidMount(): void {
    M.updateTextFields();
  }

  public componentDidUpdate(prevProps: Readonly<FieldProps>, prevState: Readonly<{}>, snapshot?: any): void {
    M.updateTextFields();
  }

  private onChange = (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
                      id: string, formContext: IFormContext): void =>
    formContext.setValues({ [id]: e.currentTarget.value });

  private onSelect = (value: string, id: string, formContext: IFormContext) => {
    formContext.setValues({ [id]: value });
    formContext.validate(id);
  };

  private onBlur = (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
                    id: string, formContext: IFormContext): void =>
    formContext.validate(id);

  render() {
    const {id, type, label, options, icon} = this.props;
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
                 className={`input-field col s12`}
                 style={icon != undefined && !icon ? {marginLeft: '10px'} : undefined}>
              {label && (
                <>
                  {(icon == undefined || icon) &&
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
                         value={formContext.values[id]}
                         disabled={!formContext.isEditing}
                         onChange={e => this.onChange(e, id, formContext)}
                         onBlur={e => this.onBlur(e, id, formContext)}/>
              )}
              {type && type.toLowerCase() === "multilinetextbox" && (
                <MultilineTextBox className={getEditorClassname(formContext.errors, !formContext.isEditing, formContext.values[id])}
                                  id={id}
                                  name={id}
                                  value={formContext.values[id]}
                                  disabled={!formContext.isEditing}
                                  onChange={e => this.onChange(e, id, formContext)}
                                  onBlur={e => this.onBlur(e, id, formContext)}/>
              )}
              {type && type.toLowerCase() === "dropdown" && (
                <Dropdown className={getEditorClassname(formContext.errors, !formContext.isEditing, formContext.values[id])}
                          id={id}
                          name={id}
                          value={formContext.values[id]}
                          disabled={!formContext.isEditing}
                          onChange={e => this.onChange(e, id, formContext)}
                          onBlur={e => this.onBlur(e, id, formContext)}
                          options={options}/>
              )}
              {(type && type.toLowerCase() === "datepicker") && (
                <Datepicker className={getEditorClassname(formContext.errors, !formContext.isEditing, formContext.values[id])}
                            id={id}
                            name={id}
                            value={formContext.values[id]}
                            disabled={!formContext.isEditing}
                            onSelect={value => this.onSelect(value, id, formContext)}/>
              )}
              {(type && type.toLowerCase() === "timepicker") && (
                <Timepicker className={getEditorClassname(formContext.errors, !formContext.isEditing, formContext.values[id])}
                            id={id}
                            name={id}
                            value={formContext.values[id]}
                            disabled={!formContext?.isEditing}
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