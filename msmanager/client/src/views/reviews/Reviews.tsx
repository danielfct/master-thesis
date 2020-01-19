import * as React from 'react';
import { Fragment } from 'react';
import { connect } from 'react-redux';
import { modalStatusChanged } from '../../actions/modals';
import { itemSelected } from '../../actions/items';
import { fetchUrl } from '../../utils/Utils';
import ListWithControllers from '../../components/list/ListWithControllers';
import { IReview } from '../../reducers/items';

import {
  Modal,
  Button,
  Panel,
  ButtonToolbar,
  ControlLabel,
  FormControl
} from 'react-bootstrap';

export interface IReviewProps {
  changeModalStatus: (status: boolean) => void;
  modalOpen: boolean;
  itemSelected: any;
  selectItem: (item: any) => void;
}

class ReviewsList extends React.Component<IReviewProps,any> {

  constructor(props: IReviewProps) {
    super(props);
    this.state = { title: "", text: "", summary: "", classification: "", creationDate: "" }
  }

  public componentWillReceiveProps(nextProps: IReviewProps) {
    if (nextProps.itemSelected) {
      const { title, text, summary, classification, creationDate } = nextProps.itemSelected;
      this.setState({ title, text, summary, classification, creationDate });
    }
  }

  public render() {
    return (
        <Fragment>
          <ListWithControllers
              fetchFrom="/reviews.json"
              embeddedArray="reviews"
              show={this.show}
              predicate={this.predicate}
              handleAdd={() => this.handleModal(true,true)}
              handleUpdate={() => this.handleModal(true,false)}
              handleDelete={this.deleteReview}
          />
          {
            this.props.modalOpen &&
            <Modal.Dialog>
              <Modal.Header>
                <Modal.Title>Update review</Modal.Title>
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
                <ControlLabel>Summary</ControlLabel>
                <FormControl
                    componentClass="textarea"
                    name="summary"
                    value={this.state.summary}
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
        text: "",
        summary: "",
        classification: "",
        creationDate: ""
      });
    }
    this.props.changeModalStatus(openModal);
  };

  private handleSave = () => {
    if (this.props.itemSelected.id) {
      this.updateReview()
    } else {
      this.createReview()
    }
  };

  private createReview = () => {
    const formData = new FormData();
    const { title, text, summary, classification, creationDate }  = this.state;
    formData.append('title', title);
    formData.append('text', text);
    formData.append('summary', summary);
    formData.append('classification', classification);
    formData.append('creationDate', creationDate);
    fetchUrl('./reviews.json', 'POST', formData, 'Created with success!', this.handleModal);
  };

  private updateReview = () => {
    const formData = new FormData();
    const { title, text, summary, classification, creationDate }  = this.state;
    formData.append('title', title);
    formData.append('text', text);
    formData.append('summary', summary);
    formData.append('classification', classification);
    formData.append('creationDate', creationDate);
    fetchUrl('./reviews.json', 'PUT', formData, 'Updated with success!', this.handleModal);
  };

  private deleteReview = () => {
    // const { id } = this.props.proposalSelected;
    fetchUrl('./reviews.json', 'DELETE', new FormData(), 'Deleted with success!', this.handleModal);
  };

  private onChange = (e: any) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  private predicate = (c:IReview,s:string) => (String(c.title)+String(c.text)).indexOf(s) !== -1;

  private show = (p: IReview) =>
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
            <Button onClick={this.deleteReview}>Apagar</Button>
          </ButtonToolbar>
        </Panel.Body>
      </div>
}

const mapStateToProps = (state: any) => {
    console.log('reviews', state);
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

export default connect(mapStateToProps, mapDispatchToProps)(ReviewsList);
