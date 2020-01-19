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
