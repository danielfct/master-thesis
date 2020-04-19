import BaseComponent from "../BaseComponent";
import React, {createRef} from "react";
import M from "materialize-css";
import Form, {IFields, IValues} from "../form/Form";
import ScrollBar from "react-perfect-scrollbar";

interface InputDialogProps {
  id: string;
  title?: string;
  fields: IFields;
  values: IValues;
  position?: string;
  confirmCallback: (input: any) => void;
  open?: boolean;
}

type Props = InputDialogProps;

export default class InputDialog extends BaseComponent<Props, {}> {

  private scrollMaxHeight = document.body.clientHeight * 0.7;
  private scrollbar: (ScrollBar | null) = null;
  private modal = createRef<HTMLDivElement>();

  private initModal = (position?: string) =>
    M.Modal.init(this.modal.current as Element, {
      preventScrolling: false,
      startingTop: position,
      endingTop: position,
      onOpenEnd: this.onOpenModal
    });

  componentDidMount(): void {
    this.initModal(this.props.position);
  }

  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<{}>, snapshot?: any): void {
    this.initModal(prevProps.position);
    if (this.props.open) {
      let modal = M.Modal.getInstance(this.modal.current as Element);
      modal.open();
    }
  }

  private onOpenModal = (): void => {
    this.scrollbar?.updateScroll();
    M.updateTextFields();
  };

  private confirmCallback = (values: IValues): void => {
    let modal = M.Modal.getInstance(this.modal.current as Element);
    modal.close();
    this.props.confirmCallback(values);
  };

  render() {
    const {id, title, fields, values, children} = this.props;
    return (
      <div id={id} className='modal dialog' ref={this.modal}>
        <ScrollBar ref={(ref) => { this.scrollbar = ref; }}
                   component={'div'}
                   style={{maxHeight: Math.floor(this.scrollMaxHeight)}}>
          <div className="modal-content">
            {title && <div className='modal-title'>{title}</div>}
            <Form id='inputDialog'
                  fields={fields}
                  values={values}
                  controlsMode={'modal'}
                  onModalConfirm={this.confirmCallback}>
              {children}
            </Form>
          </div>
        </ScrollBar>
      </div>
    );
  }

}