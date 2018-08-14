import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import * as RoutesModule from './routes';
let routes = RoutesModule.routes;

function renderApp() {

    // This code starts up the React app when it runs in a browser. It sets up the routing
    // configuration and injects the app into a DOM element.
    const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href')!;
    
    ReactDOM.render(
        <BrowserRouter children={ routes } basename={ baseUrl } />,
        document.getElementById('react-app')
    );
}

if (document.getElementById("react-app") !== null) {
    renderApp();
}