import React, {createRef} from "react";
import M from "materialize-css";
import styles from './ConfirmDialog.module.css';

interface Props {
  message: string;
  cancel?: boolean;
  cancelCallback?: () => void;
  confirm?: boolean;
  confirmCallback?: () => void;
}

export default class ConfirmDialog extends React.Component<Props, {}> {

  private modal = createRef<HTMLDivElement>();

  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<{}>, snapshot?: any): void {
    M.Modal.init(this.modal.current as Element, { startingTop: '38.5%', endingTop: '38.5%', preventScrolling:false });
  }

  render = () =>
    <div>
      {/*<button data-target="confirm-dialog" className="btn-flat modal-trigger white-text">Modal</button>*/}
      <div id="confirm-dialog" className={`modal ${styles.confirmDialog}`} ref={this.modal}>
        <div className="modal-content">
          <h5>Are you sure you want to <div className={`${styles.message}`}>{this.props.message}?</div></h5>
        </div>
        <div className={`modal-footer ${styles.footer}`}>
          <button className="modal-close waves-effect waves-red btn-flat white-text"
                  onClick={this.props.cancelCallback}>
            No
          </button>
          <button className="modal-close waves-effect waves-green btn-flat white-text"
                  onClick={this.props.confirmCallback}>
            Absolutely
          </button>
        </div>
      </div>
    </div>
}