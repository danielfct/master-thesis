import React from "react";

import "./header.css";
import Navbar from "react-bootstrap/lib/Navbar";
import Nav from "react-bootstrap/lib/Nav";
import NavDropdown from "react-bootstrap/lib/NavDropdown";
import MenuItem from "react-bootstrap/lib/MenuItem";
import { Link } from 'react-router-dom';

import avatar from "../../resources/images/avatar.jpg";
import signOut from "../../resources/icons/signOut.svg";
import { withCookies, Cookies } from 'react-cookie';

function Header(props) {

    function makeBrand() {
        let name;
        props.routes.map((route, key) => {
            if (route.path === props.location.pathname ||
                route.path.indexOf("proposals/:id/details") > -1 && props.location.pathname.indexOf("/proposals/") > -1 ||
                route.path.indexOf("users/:id/details") > -1 && props.location.pathname.indexOf("/users/") > -1 ||
                route.path.indexOf("companies/:id/details") > -1 && props.location.pathname.indexOf("/companies/") > -1) {
                name = route.name;
            }
            return null;
        });
        return name;
    }

    function logout() {
        const { cookies } = props;
        cookies.set('session', null, { path: '/' });
    }

    return (
        <Navbar collapseOnSelect center="true">
            <Navbar.Header>
                <Navbar.Brand>
                    <a>{makeBrand()}</a>
                </Navbar.Brand>
                <Navbar.Toggle />
            </Navbar.Header>
            <Navbar.Collapse>
                <Nav pullRight>
                    <NavDropdown eventKey={3}
                                 title={
                                     <img
                                         src={avatar}
                                         className="avatar"
                                         alt="profile"/>
                                 }
                                 id="basic-nav-dropdown"
                                 noCaret>
                        <MenuItem componentClass={Link} href="/myActivity" to="/myActivity" eventKey={3.1}>
                            A minha atividade
                        </MenuItem>
                        <MenuItem divider />
                        <MenuItem componentClass={Link} href="/profile" to="/profile" eventKey={3.2}>
                            Perfil
                        </MenuItem>
                        <MenuItem divider />
                        <MenuItem onClick={logout} componentClass={Link} href="/login" to="/login" eventKey={3.3}>
                            <img src={signOut} className="icon" alt="logo"/> Sair
                        </MenuItem>
                    </NavDropdown>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}

export default withCookies(Header)
