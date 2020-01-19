import * as React from 'react';
import { Fragment } from 'react';
import { connect } from 'react-redux';
import { modalStatusChanged } from '../../../actions/modals';
import { itemSelected } from '../../../actions/items';
import { fetchUrl } from '../../../utils/Utils';
import ListWithControllers from '../../../components/list/ListWithControllers';
import { IComment } from '../../../reducers/items'

import {
  Modal,
  Button,
  Panel,
  ButtonToolbar,
  ControlLabel,
  FormControl
} from 'react-bootstrap';

export interface ICommentProps {
  changeModalStatus: (status: boolean) => void;
  modalOpen: boolean;
  itemSelected: any;
  selectItem: (item: any) => void;
}

class CommentsList extends React.Component<ICommentProps,any> {

  constructor(props: ICommentProps) {
    super(props);
    this.state = { title: "", text: "" }
  }

  public componentWillReceiveProps(nextProps: ICommentProps) {
    if (nextProps.itemSelected) {
      const { title, text } = nextProps.itemSelected;
      this.setState({ title, text });
    }
  }

  public render() {
    return (
        <Fragment>
          <ListWithControllers
              fetchFrom="/comments.json"
              embeddedArray="comments"
              show={this.show}
              predicate={this.predicate}
              handleAdd={() => this.handleModal(true,true)}
              handleUpdate={() => this.handleModal(true,false)}
              handleDelete={this.deleteComment}
          />
          {
            this.props.modalOpen &&
            <Modal.Dialog>
              <Modal.Header>
                <Modal.Title>Update comment</Modal.Title>
              </Modal.Header>

              <Modal.Body>
                <ControlLabel>Title</ControlLabel>
                <FormControl
                    name="title"
                    type="text"
                    label="Title"
                    value={this.state.title}
                    onChange={this.onChange}
                />
                <ControlLabel>Text</ControlLabel>
                <FormControl
                    componentClass="textarea"
                    name="text"
                    value={this.state.text}
                    onChange={this.onChange}
                />
              </Modal.Body>

              <Modal.Footer>
                <Button onClick={() => this.handleModal(false,false)}>Close</Button>
                <Button onClick={this.handleSave} bsStyle="primary">Save changes</Button>
              </Modal.Footer>
            </Modal.Dialog>
          }
        </Fragment>
    );
  }

  private handleModal = (openModal: boolean, toCreate: boolean) => {
    if (toCreate) {
      this.props.selectItem({
        id: -1,
        title: "",
        text: ""
      });
    }
    this.props.changeModalStatus(openModal);
  };

  private handleSave = () => {
    if (this.props.itemSelected.id) {
      this.updateComment()
    } else {
      this.createComment()
    }
  };

  private createComment = () => {
    const formData = new FormData();
    const { title, text }  = this.state;
    formData.append('title', title);
    formData.append('text', text);
    fetchUrl('./comments.json', 'POST', formData, 'Created with success!', this.handleModal);
  };

  private updateComment = () => {
    const formData = new FormData();
    const { title, text }  = this.state;
    formData.append('title', title);
    formData.append('text', text);
    fetchUrl('./comments.json', 'PUT', formData, 'Updated with success!', this.handleModal);
  };

  private deleteComment = () => {
    fetchUrl('./comments.json', 'DELETE', new FormData(), 'Deleted with success!', this.handleModal);
  };

  private onChange = (e: any) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  private predicate = (c:IComment,s:string) => (String(c.title)+String(c.text)).indexOf(s) !== -1;

  private show = (p: any) =>
      <div>
        <Panel.Heading>
          <Panel.Title toggle>{p.title}</Panel.Title>
        </Panel.Heading>
        <Panel.Body>
          {p.text}
        </Panel.Body>
        <Panel.Body collapsible>
          <ButtonToolbar>
            <Button onClick={() => this.handleModal(true,false)}>Atualizar</Button>
            <Button onClick={this.deleteComment}>Apagar</Button>
          </ButtonToolbar>
        </Panel.Body>
      </div>
}

const mapStateToProps = (state: any) => {
  return {
    modalOpen: state.modalStatusChanged,
    itemSelected: state.itemSelected,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    changeModalStatus: (status: boolean) => dispatch(modalStatusChanged(status)),
    selectItem: (item: any) => dispatch(itemSelected(item))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CommentsList);
