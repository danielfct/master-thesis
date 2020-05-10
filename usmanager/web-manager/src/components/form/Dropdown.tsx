import React, {createRef} from "react";
import M from "materialize-css";

interface Props<T> {
  className?: string;
  id: string;
  name: string;
  value: any;
  disabled?: boolean;
  dropdown: {defaultValue?: string | number, values: T[], optionToString?: (v: T) => string};
  onChange: (e: React.FormEvent<HTMLSelectElement>) => void;
  onBlur?: (e: React.FormEvent<HTMLSelectElement>) => void;
}

export class Dropdown<T> extends React.Component<Props<T>, {}> {

  private dropdown = createRef<HTMLSelectElement>();

  private initDropdown = (): void => {
    M.FormSelect.init(this.dropdown.current as Element);
  };

  componentDidMount(): void {
    this.initDropdown();
  }

  public componentDidUpdate(prevProps: Readonly<Props<T>>, prevState: Readonly<{}>, snapshot?: any): void {
    this.initDropdown();
  }

  render() {
    const {className, id, name, value, disabled, onChange, onBlur, dropdown} = this.props;
    let valueString = value === undefined ? "" : value;
    valueString = typeof valueString === 'object' ? JSON.stringify(valueString) : valueString.toString();
    return (
      <select
        className={className}
        id={id}
        name={name}
        value={valueString}
        disabled={disabled}
        onChange={onChange}
        onBlur={onBlur}
        ref={this.dropdown}>
        {<>
          {dropdown.defaultValue && (
            <option key={dropdown.defaultValue} value="" disabled hidden>
              {dropdown.defaultValue}
            </option>
          )}
          {dropdown.values.map((option, index) => {

            return (
                <option key={index} value={typeof option !== 'string' || typeof option !== 'boolean' ? JSON.stringify(option) : option}>
                  {typeof option == 'object'
                    // @ts-ignore force error if optionToString is not provided when options are of type object
                    ? dropdown.optionToString(option)
                    // @ts-ignore
                    : option.toString()}
                </option>
              );
            }
          )}
        </>}
      </select>
    )
  }

}
