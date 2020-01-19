import React from "react";
import classNames from "classnames";
import { NavLink } from "react-router-dom";
import { Navbar, ListGroup, ListGroupItem } from "react-bootstrap"

import image from "../../resources/images/sidebar.jpg";
import logo from "../../logo.svg"

import "./sidebar.css"

function Sidebar(props) { //TODO props type

    const { routes, location } = props;

    const activeRoute = routeName => {
        return location.pathname.indexOf(routeName) > -1;
    };

    const links = (
        routes.map((prop, key) => {
            return (
                <NavLink
                    to={prop.path}
                    className="item"
                    activeClassName="active"
                    key={key}>
                    <ListGroupItem className={classNames("itemLink", {"blue": activeRoute(prop.path)})}>
                        <img src={prop.icon} className="itemIcon" alt="logo"/>
                        <div className={classNames("itemText", {"whiteFont": activeRoute(prop.path)})}>
                            {prop.name}
                        </div>
                    </ListGroupItem>
                </NavLink>
            );
        })
    );

    const brand = (
        <div className="logo">
            <div className="logoLink">
                <div className="logoImage">
                    <img src={logo} alt="logo" className="img" />
                </div>
                Ecma Events
            </div>
        </div>
    );

    return (
        <div>
            <Navbar className="drawerPaper">
                {brand}
                <div className="sidebarWrapper">
                    <ListGroup className="list">
                        {links}
                    </ListGroup>
                </div>
                <div className="background" style={{backgroundImage: "url(" + image + ")"}}/>
            </Navbar>
        </div>
    );
}

export default Sidebar
