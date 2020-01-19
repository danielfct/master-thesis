import * as React from 'react';
import { Fragment } from 'react';
import { connect } from 'react-redux';
import { Panel, Label } from 'react-bootstrap';
import { userFetchData } from '../../actions/user';
import { IUser } from '../../reducers/items';
import {ClipLoader} from "react-spinners";

interface IUserDetailsProps {
    match: any;
    user: IUser;
    isLoading: boolean;
    hasErrored: boolean;
    fetchData: (id: string) => void;
}

class UserDetails extends React.Component<IUserDetailsProps,any> {
    constructor(props: IUserDetailsProps) {
        super(props);
    }

    public componentDidMount() {
        this.props.fetchData(this.props.match.params.id);
    }

    public render() {
        if (this.props.hasErrored) {
            return <p>Oops! Houve um erro ao carregar os dados.</p>;
        }
        if (this.props.isLoading) {
            return <ClipLoader/>;
        }

        const { user } = this.props;

        return (<Fragment>
            <Panel>
                {
                    user &&
                    <Fragment>
                        <Panel.Body>
                            <Label>Personal details</Label><br /><br />
                            <Label>First name:</Label> {user.firstName} <br />
                            <Label>Last name:</Label> {user.lastName} <br />
                            <Label>Username:</Label> {user.username} <br/>
                            <Label>Email:</Label> {user.email} <br/>
                            <Label>Role:</Label> {user.role} <br/>
                        </Panel.Body>
                        {
                            user.job &&
                            <Panel.Body>
                                <Fragment>
                                    <Label>Employee details</Label>
                                    <Label>Job:</Label> {user.job} <br />
                                    other fields...
                                </Fragment>
                            </Panel.Body>
                        }
                    </Fragment>
                }
            </Panel>
        </Fragment>);
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

export default connect(mapStateToProps, mapDispatchToProps)(UserDetails);
