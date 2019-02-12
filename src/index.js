import React, { Component } from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import { BrowserRouter, Switch, Route, withRouter } from "react-router-dom";

import firebase from "./firebase";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";

import { Provider, connect } from "react-redux";
import store from "./store/store";
import { setUser, clearUser } from "./store/actions";
import Spinner from "./UI/Spinner";

class Root extends Component {
  componentDidMount = () => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.props.setUser(user);
        this.props.history.push("/");
      } else {
        this.props.history.push("/login");
        this.props.clearUser();
      }
    });
  };

  render() {
    return this.props.isLoading ? (
      <Spinner />
    ) : (
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/" component={App} />
      </Switch>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setUser: user => dispatch(setUser(user)),
    clearUser: ()=>dispatch(clearUser())
  };
};

const mapStateToProps = state => {
  return {
    isLoading: state.user.isLoading
  };
};

const RootWithRouter = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Root)
);

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <RootWithRouter />
    </BrowserRouter>
  </Provider>,
  document.getElementById("root")
);
