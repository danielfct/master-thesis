import React from 'react';
import {Provider} from "react-redux";
import configureStore from "./store/configureStore";
import root from "./containers/Root";

//TODO center content of main components
//TODO push footer to the bottom
//TODO apply redux to all components
//TODO change everything to ts

const App = () =>
    <Provider store={configureStore}>
        {root}
    </Provider>;

export default App;