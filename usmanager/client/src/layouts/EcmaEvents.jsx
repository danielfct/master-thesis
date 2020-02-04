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
import Header from "../components/header/header.jsx";
import Footer from "../components/footer/footer.jsx";
import Sidebar from "../components/sidebar/sidebar.jsx";
import {Redirect, Route, Switch} from 'react-router-dom';

import sidebarRoutes from "../routes/sidebar.jsx";
import routes from "../routes/ecmaEvents.jsx";

import "./EcmaEvents.css"

const switchRoutes = (
    <Switch>
        {routes.map((prop, key) => {
            if (prop.redirect) {
                return <Redirect from={prop.path} to={prop.to} key={key} />;
            } else {
                return <Route exact path={prop.path} component={prop.component} key={key} />;
            }
        })}
    </Switch>
);

function EcmaEvents(props) { //TODO props type
    return (
        <div className="wrapper">
            <Sidebar
                routes={sidebarRoutes}
                location={props.location}
            />
            <div className="mainPanel">
                <Header
                    routes={routes}
                    location={props.location}
                />
                <div className="content">
                    <div className="container">{switchRoutes}</div>
                </div>
                <Footer/>
            </div>
        </div>
    );
}

export default EcmaEvents
