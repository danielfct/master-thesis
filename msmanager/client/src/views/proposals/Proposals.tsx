import * as React from 'react';
import { Fragment } from 'react';
import { connect } from 'react-redux';
import { modalStatusChanged } from '../../actions/modals';
import { itemSelected } from '../../actions/items';
import { fetchUrl } from '../../utils/Utils';
import ListWithControllers from '../../components/list/ListWithControllers';
import { IProposal } from '../../reducers/items';

import {
    Button,
    Modal,/*
    DropdownButton,
    MenuItem,*/
    FormGroup,
    FormControl,
    ControlLabel,
    Panel, ButtonToolbar, ButtonGroup
} from 'react-bootstrap';
import {Link} from "react-router-dom";

export interface IProposalProps {
    changeModalStatus: (status: boolean) => void;
    modalOpen: boolean;
    itemSelected: any;
    selectItem: (item: any) => void;
}

class ProposalList extends React.Component<IProposalProps,any> {

    constructor(props: IProposalProps) {
        super(props);
        this.state = { title: "", description: "" }
    }

    public componentWillReceiveProps = (nextProps: IProposalProps) => {
        if (nextProps.itemSelected) {
            const { title, description, state } = nextProps.itemSelected;
            this.setState({ title, description, state });
        }
    };

    public render() {
        return (
            <Fragment>
                <ListWithControllers
                    fetchFrom="http://localhost:8080/proposals"
                    embeddedArray="proposals"
                    show={this.show}
                    predicate={this.predicate}
                    handleAdd={() => this.handleModal(true,true)}
                    handleUpdate={() => this.handleModal(true,false)}
                    handleDelete={this.deleteProposal}
                />
                {
                    this.props.modalOpen &&
                    <Modal.Dialog>
                        <Modal.Header>
                            <Modal.Title>{(this.props.itemSelected.id === -1 ? "Adicionar" : "Atualizar") + " Proposta"}
                            </Modal.Title>
                        </Modal.Header>

                        <Modal.Body>
                            <FormGroup>
                                <ControlLabel>Titulo</ControlLabel>
                                <FormControl
                                    name="title"
                                    type="text"
                                    label="Title"
                                    value={this.state.title}
                                    onChange={this.onChange}
                                />
                                <ControlLabel>Descrição</ControlLabel>
                                <FormControl
                                    componentClass="textarea"
                                    name="description"
                                    value={this.state.description}
                                    onChange={this.onChange}
                                />
                                {/* <DropdownButton
                                    id="dropdown-basic-0"
                                    name="state"
                                    onSelect={this.onDropdownChange}
                                    title={getStateValue(this.state.state)}>
                                    <MenuItem
                                        eventKey="PENDING_APPROVAL"
                                        active={this.state.state === "PENDING_APPROVAL"}>
                                        Pending approval
                                    </MenuItem>
                                    <MenuItem
                                        eventKey="APPROVED"
                                        active={this.state.state === "APPROVED"}>
                                        Approved
                                    </MenuItem>
                                </DropdownButton>*/}
                            </FormGroup>
                        </Modal.Body>

                        <Modal.Footer>
                            <Button onClick={() => this.handleModal(false,false)}>Cancelar</Button>
                            <Button onClick={this.handleSave} bsStyle="primary">Confirmar</Button>
                        </Modal.Footer>
                    </Modal.Dialog>
                }
            </Fragment>
        );
    }

    private handleModal = (openModal: boolean, toCreate: boolean) => {
        if (toCreate) {
            this.props.selectItem({
                id: undefined,
                title: "",
                description: "",
                state: "PENDING_APPROVAL",
                creationDate: "",
                _links: ""
            });
        }
        this.props.changeModalStatus(openModal);
    };

    private handleSave = () => {
        if (this.props.itemSelected.id) {
            this.updateProposal()
        } else {
            this.createProposal()
        }
    };

    private createProposal = () => {
      const proposal = { ...this.state, proposer: { id: 7 } };
      fetchUrl('http://localhost:8080/proposals', 'POST', proposal, 'Created with success!', this.handleModal);
    };

    private updateProposal = () => {
      const { id } = this.props.itemSelected;
      fetchUrl(`http://localhost:8080/proposals/${id}`,
        'PUT',
        { id, ...this.state },
        'Updated with success!',
        this.handleModal);
    };

    private deleteProposal = () => {
      const { id } = this.props.itemSelected;
      fetchUrl(`http://localhost:8080/proposals/${id}`, 'DELETE', this.state, 'Deleted with success!', this.handleModal);
    };

    private onChange = (e: any) => {
        this.setState({ [e.target.name]: e.target.value });
    };

    /*    private onDropdownChange = (e: any) => {
            this.setState({ state: e });
        };*/

    private predicate = (c:IProposal,s:string) => (String(c.title)+String(c.description)).indexOf(s) !== -1;

    private show = (p: any) =>
        <div>
            <Panel.Heading>
                <Panel.Title toggle>{p.title}</Panel.Title>
            </Panel.Heading>
            <Panel.Body>
                {p.description}
            </Panel.Body>
            <Panel.Body collapsible>
                <ButtonToolbar>
                    <Button onClick={() => this.handleModal(true,false)}>Atualizar</Button>
                    <Button onClick={this.deleteProposal}>Apagar</Button>
                    <ButtonGroup>
                        <Link to={`/proposals/${p.id}/details`}>
                            <Button>
                                Ver detalhes
                            </Button>
                        </Link>
                    </ButtonGroup>
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

export default connect(mapStateToProps, mapDispatchToProps)(ProposalList);
