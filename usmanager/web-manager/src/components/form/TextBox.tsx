import React from "react";
import {getTypeFromValue} from "./Field";
import M from "materialize-css";

interface TextBoxProps {
  className: string;
  id: string;
  name: string;
  value?: any;
  disabled?: boolean;
  onChange: (e: React.FormEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FormEvent<HTMLInputElement>) => void;
}

export class TextBox extends React.Component<TextBoxProps, any> {

  componentDidUpdate(prevProps: Readonly<TextBoxProps>, prevState: Readonly<any>, snapshot?: any): void {
    M.updateTextFields();
  }

  render(): any {
    const {className, id, name, value, disabled, onChange, onBlur} = this.props;
    return (
      <input
        className={className}
        id={id}
        name={name}
        type="text"
        value={value}
        disabled={disabled}
        autoComplete="off"
        onChange={onChange}
        onBlur={onBlur}
        formNoValidate={true}/>
    )
  }

}
