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

  private scrollMaxHeight = document.body.clientHeight * 0.7;

  private scrollbar: (ScrollBar | null) = null;
  private modal = createRef<HTMLDivElement>();

  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<{}>, snapshot?: any): void {
    M.Modal.init(this.modal.current as Element, { preventScrolling: false, onOpenEnd: this.onModalOpen });
  }

  private onModalOpen = (): void => {
    this.scrollbar?.updateScroll();
  };

  private confirmCallback = (values: IValues): void => {
    let modal = M.Modal.getInstance(this.modal.current as Element);
    modal.close();
    this.props.confirmCallback(values);
  };

  render() {
    const {title, fields, values, children} = this.props;
    return (
      <div>
        <div id="input-dialog" className='modal dialog' ref={this.modal}>
          <ScrollBar ref={(ref) => { this.scrollbar = ref; }}
                     component={'div'}
                     style={{maxHeight: Math.floor(this.scrollMaxHeight)}}>
            <div className="modal-content">
              <div className='modal-title'>{title}</div>
              <Form id='inputDialog'
                    fields={fields}
                    values={values}
                    controlsMode={'form'}
                    onModalConfirm={this.confirmCallback}>
                {children}
              </Form>
            </div>
            {/*<div className='modal-footer dialog-footer'>
              <button className="modal-close waves-effect waves-light btn-flat red-text">
                Cancel
              </button>
              <button className="modal-close waves-effect waves-light btn-flat green-text"
                      type="submit"
                      onClick={this.confirmCallback}>
                Confirm
              </button>
            </div>*/}
          </ScrollBar>
        </div>
      </div>
    );
  }

}