import BaseComponent from "../BaseComponent";
import React, {createRef} from "react";
import M from "materialize-css";
import Form, {IFields, IValues} from "../form/Form";
import ScrollBar from "react-perfect-scrollbar";

interface InputDialogProps {
  title: string;
  fields: IFields,
  values: IValues,
  confirmCallback: (input: any) => void;
}

type Props = InputDialogProps;

export default class InputDialog extends BaseComponent<Props, {}> {

  private modal = createRef<HTMLDivElement>();
  private scrollbar: (ScrollBar | null) = null;

  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<{}>, snapshot?: any): void {
    M.Modal.init(this.modal.current as Element, { preventScrolling: false });
    this.scrollbar?.updateScroll();
  }

  componentDidMount(): void {
    this.scrollbar?.updateScroll();
  }

  private confirmCallback = () =>
    this.props.confirmCallback('test'); //TODO

  render() {
    const {title, fields, values, children} = this.props;
    return (
      <div>
        <div id="input-dialog" className='modal dialog' ref={this.modal}>
          {/*//TODO fix scrollbar*/}
          <ScrollBar ref = {(ref) => { this.scrollbar = ref; }}
                     component='div'>
            <div className="modal-content">

              <div className='modal-title'>{title}</div>
              <Form id='inputDialog'
                    fields={fields}
                    values={values}
                    showControls={false}>
                {children}
              </Form>
            </div>
            <div className='modal-footer dialog-footer'>
              <button className="modal-close waves-effect waves-red btn-flat white-text">
                Cancel
              </button>
              <button className="modal-close waves-effect waves-green btn-flat white-text"
                      onClick={this.confirmCallback}>
                Confirm
              </button>
            </div>
          </ScrollBar>
        </div>
      </div>
    );
  }

}