import React, {createRef} from "react";
import M from "materialize-css";
import {capitalize} from "../../../utils/text";

interface Props {
  className: string;
  id: string;
  name: string;
  value: string;
  disabled?: boolean;
  options?: {defaultValue: string, values: string[]};
  onChange: (e: React.FormEvent<HTMLSelectElement>) => void;
  onBlur: (e: React.FormEvent<HTMLSelectElement>) => void;
}

export class Dropdown extends React.Component<Props, {}> {

  private dropdown = createRef<HTMLSelectElement>();

  private initDropdown = (): void => {
    M.FormSelect.init(this.dropdown.current as Element);
  };

  componentDidMount(): void {
    this.initDropdown();
  }

  public componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<{}>, snapshot?: any): void {
    this.initDropdown();
  }

  render() {
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
            <option key={options.defaultValue} value="" selected disabled hidden>
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
