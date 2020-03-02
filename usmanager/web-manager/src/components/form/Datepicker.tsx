import React, {createRef} from "react";
import M, { DatepickerOptions } from "materialize-css";

interface Props {
  className?: string;
  id: string;
  name: string;
  value: string;
  disabled?: boolean;
  options?: Partial<DatepickerOptions>;
  onChange: (e: React.FormEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FormEvent<HTMLInputElement>) => void;
}

export class Datepicker extends React.Component<Props, {}> {

  private datepicker = createRef<HTMLInputElement>();

  private initDatepicker = (): void => {
    M.Datepicker.init(this.datepicker.current as Element, {
      defaultDate: new Date(),
      format: 'dd/mm/yyyy',
      ...this.props.options
    });
  };

  componentDidMount(): void {
    this.initDatepicker();
  }

  public componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<{}>, snapshot?: any): void {
    this.initDatepicker();
  }

  render() {
    const {className, id, name, value, disabled, onChange, onBlur} = this.props;
    return (
      <input type="text"
             className={`datepicker ${className}`}
             id={id}
             name={name}
             value={value}
             disabled={disabled}
             onChange={onChange}
             onBlur={onBlur}
             ref={this.datepicker}
      />

    )
  }

}