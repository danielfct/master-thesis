import * as React from "react";
import {Button, FormGroup, FormControl, ControlLabel, Jumbotron, ButtonGroup} from "react-bootstrap";
import "./Login.css";
import {Cookies} from "react-cookie";
import {connect} from "react-redux";
import {Link} from "react-router-dom";

interface ILogin {
  cookies: Cookies;
}

class Login extends React.Component<ILogin, any> {

  constructor(props: ILogin) {
    super(props);
    this.state = {
      username: "",
      password: ""
    };
  }

  public render() {
    return (
        <div className="Login">
          <Jumbotron className="loginHeader">
            <h2>Ecma Events</h2>
            <p>
              Plataforma para organização e gestão de eventos.
            </p>
          </Jumbotron>;
          <form onSubmit={this.handleSubmit}>
            <FormGroup controlId="username" bsSize="large">
              <ControlLabel>Username</ControlLabel>
              <FormControl
                  autoFocus
                  type="text"
                  value={this.state.username}
                  onChange={this.handleChange}
              />
            </FormGroup>
            <FormGroup controlId="password" bsSize="large">
              <ControlLabel>Password</ControlLabel>
              <FormControl
                  value={this.state.password}
                  onChange={this.handleChange}
                  type="password"
              />
            </FormGroup>

            <ButtonGroup>
              <Link to="/proposals">
                <Button
                    block
                    bsSize="large"
                    bsStyle="success"
                    disabled={!this.validateForm()}
                    type="submit"
                >
                  Entrar
                </Button>
              </Link>
            </ButtonGroup>
          </form>
        </div>
    );
  }

  private validateForm() {
    return this.state.username.length > 0 && this.state.password.length > 0;
  }

  private handleChange = (event: any) => {
    this.setState({
      [event.target.id]: event.target.value
    });
  };

  private handleSubmit = (event: any) => {
    event.preventDefault();
    const { username, password } = this.state;
    const { cookies } = this.props;
    cookies.set('session', btoa(username + ":" + password), { path: '/' });
  }

}

const mapStateToProps = (state: any, ownProps: any) => {
  return({
    state: {state},
    cookies: ownProps.cookies,
  });
};

export default connect(mapStateToProps, null)(Login);
