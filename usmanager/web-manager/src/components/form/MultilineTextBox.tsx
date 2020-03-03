import React from "react";

interface Props {
  className: string;
  id: string;
  name: string;
  value: string;
  disabled?: boolean;
  onChange: (e: React.FormEvent<HTMLTextAreaElement>) => void;
  onBlur: (e: React.FormEvent<HTMLTextAreaElement>) => void;
}

export class MultilineTextBox extends React.Component<Props, {}> {

  render(): any {
    const {className, id, name, value, disabled, onChange, onBlur} = this.props;
    return (
      <textarea
        className={`materialize-textarea ${className}`}
        style={
          className.includes('invalid')
            ? { borderBottom: "1px solid #F44336", boxShadow: "0 1px 0 0 #F44336" }
            : undefined
        }
        id={id}
        name={name}
        value={value}
        disabled={disabled}
        onChange={onChange}
        onBlur={onBlur}/>
    )
  }

}
