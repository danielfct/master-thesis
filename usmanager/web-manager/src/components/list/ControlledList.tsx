import React, {createRef} from "react";
import M from "materialize-css";
import List from "./List";
import styles from "./ControlledList.module.css";
import PerfectScrollbar from "react-perfect-scrollbar";
import BaseComponent from "../BaseComponent";
import {deleteData, patchData, RestOperation} from "../../utils/api";
import {decodeHTML} from "../../utils/text";
import InputDialog from "../dialogs/InputDialog";
import {IFields, IValues} from "../form/Form";

interface ControlledListProps {
  isLoading: boolean;
  error?: string | null;
  emptyMessage: string;
  data: string[];
  dropdown?: { id: string, title: string, empty: string, data: string[] };
  formModal?: { title: string, fields: IFields, values: IValues, content: JSX.Element };
  show: (index: number, element: string, separate: boolean, checked: boolean,
         handleCheckbox: (event: React.ChangeEvent<HTMLInputElement>) => void) => JSX.Element;
  onAdd?: (data: string) => void;
  onAddInput?: (input: IValues) => void;
  onRemove: (data: string[]) => void;
  onDelete: RestOperation;
}

type Props = ControlledListProps;

interface State {
  [key: string]: { isChecked: boolean, isNew: boolean } | undefined;
}

export default class ControlledList extends BaseComponent<Props, State> {

  private globalCheckbox = createRef<HTMLInputElement>();
  private dropdown = createRef<HTMLButtonElement>();

  state: State = {};

  componentDidMount(): void {
    M.Dropdown.init(this.dropdown.current as Element);
  }

  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any): void {
    if (this.globalCheckbox.current) {
      this.globalCheckbox.current.checked = Object.values(this.state)
                                                  .map(data => !data || data.isChecked)
                                                  .every(checked => checked);
    }
    if (prevProps.data !== this.props.data) {
      this.setState(this.props.data.reduce((state: State, data: string) => {
        state[data] = { isChecked: false, isNew: false };
        return state;
      }, {}));
    }
  }

  private handleGlobalCheckbox = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {checked} = event.target;
    this.setState(state => Object.entries(state).filter(([_, data]) => data).reduce((newState: State, [data, dataState]) => {
      newState[data] = { isChecked: checked, isNew: dataState?.isNew || false };
      return newState;
    }, {}));
  };

  private handleCheckbox = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {id: data, checked} = event.target;
    this.setState(state => ({[data]: { isChecked: checked, isNew: state[data]?.isNew || false } }));
  };

  private show = (data: string, index: number): JSX.Element => {
    const checked = this.state[data]?.isChecked || false;
    const separate = index != Object.entries(this.state).filter(([_, data]) => data).length - 1;
    return this.props.show(index, data, separate, checked, this.handleCheckbox)
  };

  private onAdd = (event: React.MouseEvent<HTMLLIElement>): void => {
    const data = decodeHTML((event.target as HTMLLIElement).innerHTML);
    this.setState({ [data]: { isChecked: false, isNew: true } });
    this.props.onAdd?.(data);
  };

  private onAddInput = (input: any): void => {
    this.props.onAddInput?.(input);
  };

  private onRemove = (): void => {
    const checkedData = Object.entries(this.state).filter(([_, data]) => data?.isChecked);
    const unpersistedData = checkedData.filter(([_, data]) => data?.isNew).map(([name, _]) => name);
    if (unpersistedData.length) {
      this.invalidateStateData(unpersistedData);
      this.props.onRemove(unpersistedData);
    }
    const persistedData = checkedData.filter(([_, data]) => !data?.isNew).map(([name, _]) => name);
    if (persistedData.length) {
      const {url} = this.props.onDelete;
      if (persistedData.length == 1) {
        deleteData(`${url}/${persistedData[0]}`,
          () => this.onDeleteSuccess(persistedData), this.onDeleteFailure);
      }
      else {
        patchData(url, persistedData,
          () => this.onDeleteSuccess(persistedData), this.onDeleteFailure, "delete");
      }
    }
  };

  private onDeleteSuccess = (data: string[]): void => {
    this.invalidateStateData(data);
    this.props.onDelete.successCallback(data);
  };

  private invalidateStateData = (data: string[]): void =>
    this.setState(data.reduce((state: State, data: string) => {
      state[data] = undefined;
      return state;
    }, {}));

  private onDeleteFailure = (reason: string): void =>
    this.props.onDelete.failureCallback(reason);

  render() {
    const {isLoading, error, emptyMessage, dropdown, formModal} = this.props;
    const data = Object.entries(this.state)
                       .filter(([_, data]) => data)
                       .map(([data, _]) => data);
    const DataList = List<string>();
    return (
      <div>
        <div className={`controlsContainer`}>
          {data.length > 0 && (
            <p className={`${styles.nolabelCheckbox}`}>
              <label>
                <input type="checkbox"
                       onChange={this.handleGlobalCheckbox}
                       ref={this.globalCheckbox}/>
                <span/>
              </label>
            </p>
          )}
          {dropdown && (
            <>
              <button className={`dropdown-trigger btn-floating btn-flat btn-small waves-effect waves-light right tooltipped`}
                      data-position="bottom" data-tooltip={dropdown.title}
                      data-target={`dropdown-${dropdown.id}`}
                      ref={this.dropdown}>
                <i className="material-icons">add</i>
              </button>
              <ul id={`dropdown-${dropdown.id}`}
                  className={`dropdown-content ${styles.dropdown}`}>
                <li className={`${styles.disabled}`}>
                  <a className={`${!dropdown?.data.length ? styles.dropdownEmpty : undefined}`}>
                    {dropdown.data.length ? dropdown.title : dropdown.empty}
                  </a>
                </li>
                <PerfectScrollbar>
                  {dropdown.data.map((data, index) =>
                    <li key={index} onClick={this.onAdd}>
                      <a>{data}</a>
                    </li>
                  )}
                </PerfectScrollbar>
              </ul>
            </>
          )}
          {formModal && (
            <>
              <button className={`modal-trigger btn-floating btn-flat btn-small waves-effect waves-light right tooltipped`}
                      data-position="bottom" data-tooltip={formModal.title}
                      data-target="input-dialog">
                <i className="material-icons">add</i>
              </button>
              <InputDialog title={formModal?.title}
                           fields={formModal?.fields}
                           values={formModal?.values}
                           confirmCallback={this.onAddInput}>
                {formModal?.content}
              </InputDialog>
            </>
          )}
          <button className="btn-flat btn-small waves-effect waves-light red-text right"
                  style={Object.values(this.state)
                               .map(dependency => dependency?.isChecked || false)
                               .some(checked => checked)
                    ? {transform: "scale(1)"}
                    : {transform: "scale(0)"}}
                  onClick={this.onRemove}>
            Remove
          </button>
        </div>
        <DataList
          isLoading={isLoading}
          error={error}
          emptyMessage={emptyMessage}
          list={data}
          show={this.show}/>
      </div>
    )
  }

}