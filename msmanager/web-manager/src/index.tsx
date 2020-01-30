import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'react-perfect-scrollbar/dist/css/styles.css';
import * as serviceWorker from './serviceWorker';
import Root from "./containers/Root";
import {BrowserRouter} from "react-router-dom";
import configureStore from "./store/configureStore";
import Footer from "./components/shared/Footer";
import {saveState} from "./store/localStorage";

// TODO implement labelToIcon function

const store = configureStore();

store.subscribe(() => {
    saveState(store.getState());
});

const body = [
    <BrowserRouter>
        <Root store={store}/>
    </BrowserRouter>,
    <Footer/>
];

ReactDOM.render(
    body,
    document.getElementById('body'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();