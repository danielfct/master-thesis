import React, {createRef} from "react";
import M, { TimepickerOptions } from "materialize-css";

interface Props {
  className?: string;
  id: string;
  name: string;
  value: string;
  disabled?: boolean;
  options?: Partial<TimepickerOptions>;
  onChange: (e: React.FormEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FormEvent<HTMLInputElement>) => void;
}

export class Timepicker extends React.Component<Props, {}> {

  private timepicker = createRef<HTMLInputElement>();

  private initTimepicker = (): void => {
    M.Timepicker.init(this.timepicker.current as Element, {
      twelveHour: false,
      ...this.props.options
    });
  };

  componentDidMount(): void {
    this.initTimepicker();
  }

  public componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<{}>, snapshot?: any): void {
    this.initTimepicker();
  }

  render() {
    const {className, id, name, value, disabled, onChange, onBlur} = this.props;
    return (
      <input type="text"
             className={`timepicker ${className}`}
             id={id}
             name={name}
             value={value}
             disabled={disabled}
             onChange={onChange}
             onBlur={onBlur}
             ref={this.timepicker}
      />

    )
  }

}