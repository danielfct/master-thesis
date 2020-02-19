/*
 * MIT License
 *
 * Copyright (c) 2020 usmanager
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

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

    componentDidMount(): void {
        this.props.fetchData("7"); // TODO
    }

    public componentWillReceiveProps(nextProps: IProfileProps) {
        if (nextProps.user) {
            const { username, email, firstName, lastName} = nextProps.user;
            this.setState({ username, email, firstName, lastName });
        }
    }

    render() {
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
