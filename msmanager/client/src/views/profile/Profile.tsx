import * as React from 'react';
import { Fragment } from "react";
import {IUser} from "../../reducers/items";
import {userFetchData} from "../../actions/user";
import {connect} from "react-redux";
import {Button, ButtonGroup, ControlLabel, FormControl, FormGroup} from "react-bootstrap";
import {fetchUrl} from "../../utils/Utils";
import {ClipLoader} from "react-spinners";

interface IProfileProps {
    user: IUser;
    isLoading: boolean;
    hasErrored: boolean;
    fetchData: (id: string) => void;
}

class Profile extends React.Component<IProfileProps,any> {
    constructor(props: IProfileProps) {
        super(props);
        this.state = {
            username: "",
            password: "",
            email: "",
            firstName: "",
            lastName: "",
        };
    }

    public componentDidMount() {
        this.props.fetchData("7"); // TODO
    }

    public componentWillReceiveProps(nextProps: IProfileProps) {
        if (nextProps.user) {
            const { username, email, firstName, lastName} = nextProps.user;
            this.setState({ username, email, firstName, lastName });
        }
    }

    public render() {
        if (this.props.hasErrored) {
            return <p>Oops! Houve um erro ao carregar os dados.</p>;
        }
        if (this.props.isLoading) {
            return <ClipLoader/>;
        }

        const { user } = this.props;

        return (
            <Fragment>
                {
                    user &&
                    <div className="Profile">
                        <form onSubmit={this.handleSubmit}>
                            <FormGroup controlId="username">
                                <ControlLabel>Username</ControlLabel>
                                <FormControl
                                    autoFocus
                                    type="text"
                                    value={this.state.username}
                                    onChange={this.handleChange}
                                />
                            </FormGroup>
                            <FormGroup controlId="password">
                                <ControlLabel>Password</ControlLabel>
                                <FormControl
                                    value={this.state.password}
                                    onChange={this.handleChange}
                                    type="password"
                                />
                            </FormGroup>
                            <FormGroup controlId="email">
                                <ControlLabel>Endereço email</ControlLabel>
                                <FormControl
                                    autoFocus
                                    type="text"
                                    value={this.state.email}
                                    onChange={this.handleChange}
                                />
                            </FormGroup>
                            <FormGroup controlId="firstName">
                                <ControlLabel>Primeiro nome</ControlLabel>
                                <FormControl
                                    autoFocus
                                    type="text"
                                    value={this.state.firstName}
                                    onChange={this.handleChange}
                                />
                            </FormGroup>
                            <FormGroup controlId="lastName">
                                <ControlLabel>Último nome</ControlLabel>
                                <FormControl
                                    autoFocus
                                    type="text"
                                    value={this.state.lastName}
                                    onChange={this.handleChange}
                                />
                            </FormGroup>
                            <ButtonGroup>
                                <Button
                                    block
                                    bsStyle="success"
                                    disabled={!this.validateForm()}
                                    type="submit"
                                >
                                    Atualizar
                                </Button>
                            </ButtonGroup>
                        </form>
                    </div>
                }
            </Fragment>
        );
    }

    private validateForm() {
        return this.state.username && this.state.username.length > 0;
    }

    private handleChange = (event: any) => {
        this.setState({
            [event.target.id]: event.target.value
        });
    };

    private handleSubmit = (event: any) => {
        event.preventDefault();
        const formData = new FormData()
        const { firstName, lastName, username, email, password } = this.state;
        formData.append('id', this.props.user.id.toString());
        formData.append('firstName', firstName);
        formData.append('lastName', lastName);
        formData.append('username', username);
        formData.append('email', email);
        formData.append('password', password);
        fetchUrl('http://localhost:8080/users/'+this.props.user.id, 'PUT', formData, 'Updated with success!', this.updateSuccess);
    };

    private updateSuccess = () => {
        console.log("Ok, updated user");
    }
}

const mapStateToProps = (state: any) => {
    return {
        user: state.user,
        hasErrored: state.itemsHasErrored,
        isLoading: state.itemsIsLoading
    };
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        fetchData: (id: string) => dispatch(userFetchData(id))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
