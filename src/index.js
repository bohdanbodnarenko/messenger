import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import {
    BrowserRouter,
    Switch,
    Route
} from 'react-router-dom'

import Login from './components/Auth/Login';
import Register from './components/Auth/Register';

const app = (
    <BrowserRouter>
        <Switch>
            <Route path='/login' component={Login} />
            <Route path='/register' component={Register} />
            <Route path='/' component={App} /> 
        </Switch>
    </BrowserRouter>
)

ReactDOM.render( app , document.getElementById('root'));