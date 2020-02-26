import React from "react";
import {getTypeFromValue} from "./Field";

interface TextBoxProps {
  className: string;
  id: string;
  name: string;
  value?: string;
  disabled?: boolean;
  onChange: (e: React.FormEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FormEvent<HTMLInputElement>) => void;
}

export class TextBox extends React.Component<TextBoxProps, any> {

  render(): any {
    const {className, id, name, value, disabled, onChange, onBlur} = this.props;
    return (
      <>
        <input
          className={className}
          style={
            className.includes('invalid')
              ? { borderBottom: "1px solid #F44336", boxShadow: "0 1px 0 0 #F44336" }
              : undefined
          }
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
