import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from './store/ConfigureStore';
import App from './App';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import { CookiesProvider } from 'react-cookie';

const store = configureStore({});

ReactDOM.render(
    <CookiesProvider>
        <Provider store={store}>
            <App/>
        </Provider>
    </CookiesProvider>,
    document.getElementById('root') as HTMLElement
);
registerServiceWorker();
