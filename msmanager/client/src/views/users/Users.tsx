import * as React from 'react';
import { Fragment } from 'react';
import { connect } from 'react-redux';
import { modalStatusChanged } from '../../actions/modals';
import { itemSelected } from '../../actions/items';
import { fetchUrl } from '../../utils/Utils';
import ListWithControllers from '../../components/list/ListWithControllers';
import { IUser } from '../../reducers/items';

import {
  Modal,
  FormGroup,
  ControlLabel,
  FormControl,
  DropdownButton,
  MenuItem,
  Button,
  Panel, ButtonToolbar, ButtonGroup
} from 'react-bootstrap';
import {Link} from "react-router-dom";

export interface IUsersProps {
  changeModalStatus: (status: boolean) => void;
  modalOpen: boolean;
  itemSelected: any;
  selectItem: (item: any) => void;
}

class UsersList extends React.Component<IUsersProps,any> {

  constructor(props: IUsersProps) {
    super(props);
    this.state = { firstName: "", lastName: "", username: "", email: "", role: "",
    city: "", address: "", zipCode: "", homePhone: "", cellPhone: "",
    gender: "", salary: "", birthday: "" };
  }

  public componentWillReceiveProps = (nextProps: IUsersProps) => {
    if (nextProps.itemSelected) {
      const { firstName, lastName, username, email, role, city, address, zipCode,
        homePhone, cellPhone, gender, salary, birthday} = nextProps.itemSelected;

      this.setState({ firstName, lastName, username, email, role, city, address, zipCode,
        homePhone, cellPhone, gender, salary, birthday});
    }
  };

  public render() {
    return (
        <Fragment>
          <ListWithControllers
              fetchFrom="http://localhost:8080/users"
              embeddedArray="employees"
              show={this.show}
              predicate={this.predicate}
              handleAdd={() => this.handleModal(true,true)}
              handleUpdate={() => this.handleModal(true,false)}
              handleDelete={this.deleteUser}
          />
          {
            this.props.modalOpen &&
            <Modal.Dialog>
              <Modal.Header>
                <Modal.Title>{(this.props.itemSelected.id === -1 ? "Adicionar" : "Atualizar") + " Utilizador"}
                </Modal.Title>
              </Modal.Header>

              <Modal.Body style={{maxHeight: 'calc(100vh - 210px)', overflowY: 'auto'}}>
                <FormGroup>
                  <ControlLabel>Primeiro nome</ControlLabel>
                  <FormControl
                      name="firstName"
                      type="text"
                      label="First name"
                      value={this.state.firstName}
                      onChange={this.onChange}
                  />
                  <ControlLabel>Último nome</ControlLabel>
                  <FormControl
                      name="lastName"
                      type="text"
                      label="Last name"
                      value={this.state.lastName}
                      onChange={this.onChange}
                  />
                  <ControlLabel>Username</ControlLabel>
                  <FormControl
                      name="userName"
                      type="text"
                      label="First name"
                      value={this.state.username}
                      onChange={this.onChange}
                  />
                  <ControlLabel>Endereço email</ControlLabel>
                  <FormControl
                      name="email"
                      type="text"
                      label="Email"
                      value={this.state.email}
                      onChange={this.onChange}
                  />
                  <ControlLabel>Permissões</ControlLabel>
                  <DropdownButton
                      className="dropdown"
                      id="dropdown-basic-0"
                      name="state"
                      onSelect={this.onRoleChange}
                      title={this.state.role}>
                    <MenuItem
                        eventKey="ROLE_COMPANY_ADMIN"
                        active={this.state.role === "ROLE_COMPANY_ADMIN"}>
                      ROLE_COMPANY_ADMIN
                    </MenuItem>
                    <MenuItem
                        eventKey="SYS_ADMIN"
                        active={this.state.role === "SYS_ADMIN"}>
                      SYS_ADMIN
                    </MenuItem>
                    <MenuItem
                        eventKey="STANDARD"
                        active={this.state.role === "STANDARD"}>
                      STANDARD
                    </MenuItem>
                  </DropdownButton><br />
                  <ControlLabel>Cidade</ControlLabel>
                  <FormControl
                      name="city"
                      type="text"
                      label="City"
                      value={this.state.city}
                      onChange={this.onChange}
                  />
                  <ControlLabel>Morada</ControlLabel>
                  <FormControl
                      name="address"
                      type="text"
                      label="Address"
                      value={this.state.address}
                      onChange={this.onChange}
                  />
                  <ControlLabel>Código postal</ControlLabel>
                  <FormControl
                      name="zipCode"
                      type="text"
                      label="Zipcode"
                      value={this.state.zipCode}
                      onChange={this.onChange}
                  />
                  <ControlLabel>Telemóvel</ControlLabel>
                  <FormControl
                      name="cellPhone"
                      type="text"
                      label="Cellphone"
                      value={this.state.cellPhone}
                      onChange={this.onChange}
                  />
                  <ControlLabel>Telefone</ControlLabel>
                  <FormControl
                      name="homePhone"
                      type="text"
                      label="Homephone"
                      value={this.state.homePhone}
                      onChange={this.onChange}
                  />
                  <ControlLabel>Género</ControlLabel>
                  <DropdownButton
                      className="dropdown"
                      id="dropdown-basic-0"
                      name="state"
                      onSelect={this.onGenderChange}
                      title={this.state.gender}>
                    <MenuItem
                        eventKey="MALE"
                        active={this.state.gender === "MALE"}>
                      MALE
                    </MenuItem>
                    <MenuItem
                        eventKey="FEMALE"
                        active={this.state.gender === "FEMALE"}>
                      FEMALE
                    </MenuItem>
                  </DropdownButton><br />
                  <ControlLabel>Salário</ControlLabel>
                  <FormControl
                      name="salary"
                      type="text"
                      label="Salary"
                      value={this.state.salary}
                      onChange={this.onChange}
                  />
                  <ControlLabel>Data de nascimento</ControlLabel>
                  <FormControl
                      name="birthday"
                      type="text"
                      label="Birthday"
                      value={this.state.birthday}
                      onChange={this.onChange}
                  />
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
        id: -1,
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        role: "",
        city: "",
        address: "",
        zipCode: "",
        homePhone: "",
        cellPhone: "",
        gender: "",
        salary: "",
        birthday: ""
      });
    }
    this.props.changeModalStatus(openModal);
  };

  private handleSave = () => {
    if (this.props.itemSelected.id) {
      this.updateUser()
    } else {
      this.createUser()
    }
  };

  private createUser = () => {
    fetchUrl('http://localhost:8080/users', 'POST', this.state, 'Created with success!', this.handleModal);
  };

  private updateUser = () => {
    const { id } = this.props.itemSelected;
    fetchUrl(`http://localhost:8080/users/${id}`,
      'PUT',
      { id, ...this.state },
      'Updated with success!',
      this.handleModal);
  };

  private deleteUser = () => {
    const { id } = this.props.itemSelected;
    fetchUrl(`http://localhost:8080/users/${id}`, 'DELETE', this.state, 'Deleted with success!', this.handleModal);
  };

  private onChange = (e: any) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  private onGenderChange = (e: any) => {
    this.setState({ gender: e });
  }

  private onRoleChange = (e: any) => {
    this.setState({ role: e });
  };

  private predicate = (c:IUser,s:string) =>
  (String(c.firstName)+String(c.lastName)+String(c.email)).indexOf(s) !== -1;

  private show = (p: any) =>
      <div>
        <Panel.Heading>
          <Panel.Title toggle>{p.firstName + " " + p.lastName}</Panel.Title>
        </Panel.Heading>
        <Panel.Body>
          {p.email + " (" + p.username + ")"}
        </Panel.Body>
        <Panel.Body collapsible>
          <ButtonToolbar>
            <Button onClick={() => this.handleModal(true,false)}>Atualizar</Button>
            <Button onClick={this.deleteUser}>Apagar</Button>
            <ButtonGroup>
              <Link to={`/users/${p.id}/details`}>
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

export default connect(mapStateToProps, mapDispatchToProps)(UsersList);
