import React from "react";
import M from "materialize-css";

interface TextBoxProps<T> {
  className: string;
  id: string;
  name: string;
  value?: any;
  disabled?: boolean;
  valueToString?: (v: T) => string
  onChange: (e: React.FormEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FormEvent<HTMLInputElement>) => void;
}

export class TextBox<T> extends React.Component<TextBoxProps<T>, any> {

  public componentDidUpdate(prevProps: Readonly<TextBoxProps<T>>, prevState: Readonly<any>, snapshot?: any): void {
    M.updateTextFields();
  }

  render(): any {
    const {className, id, name, value, disabled, valueToString, onChange, onBlur} = this.props;
    return (
      <input
        className={className}
        id={id}
        name={name}
        type="text"
        value={typeof value === 'object' && valueToString ? valueToString(value) : (value || '')}
        disabled={disabled}
        autoComplete="off"
        onChange={onChange}
        onBlur={onBlur}
        formNoValidate={true}/>
    )
  }

}
