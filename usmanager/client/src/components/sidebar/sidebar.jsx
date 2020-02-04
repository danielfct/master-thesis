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
