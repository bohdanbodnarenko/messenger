import React, { Component } from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import { BrowserRouter, Route,Switch } from "react-router-dom";

import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";

import { Provider } from "react-redux";
import store from "./store/store";

const app = (
  <Provider store={store}>
      <BrowserRouter>
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/" component={App} />
      </Switch>
      </BrowserRouter>
  </Provider>
)

ReactDOM.render(
  app,
  document.getElementById("root")
);
