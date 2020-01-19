import * as React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import './App.css';
import {ReactCookieProps, withCookies} from 'react-cookie';
import routes from "./routes/index.jsx";

class App extends React.Component<ReactCookieProps, any> {

    constructor(props: ReactCookieProps) {
        super(props);
    }

    public render() {
        return (
            <BrowserRouter basename={"/ecmaEvents"}>
                <Switch>
                    {routes.map((prop, key) => {
                        return (
                            <Route path={prop.path}
                                   render={(props) => (<prop.component {...props} cookies={this.props.cookies}/>)}
                                   key={key} />
                        )
                    })}
                </Switch>
            </BrowserRouter>
        );
    }
}

export default withCookies(App);
