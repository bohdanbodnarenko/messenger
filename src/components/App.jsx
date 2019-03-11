import React, { Component } from "react";
import "./App.css";
import { connect } from "react-redux";

import ColorPanel from "./ColorPanel/ColorPanel";
import SidePanel from "./SidePanel/SidePanel";
import Messages from "./Messages/Messages";
import Spinner from "../UI/Spinner";
import styled from "styled-components";
import firebase from "../firebase";
import { setUser, clearUser } from "../store/actions";

const Main = styled.main`
  display: grid;
  grid-template-columns: 50px minmax(100px, 300px) minmax(250px, auto);
  grid-template-rows: 100vh;
  grid-gap: 0;
`;
class App extends Component {
  componentDidMount = () => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.props.setUser(user);
      } else {
        this.props.history.push("/login");
      }
    });
  };
  render() {
    if (this.props.user) {
      return (
        <Main columns="equal" className="app" style={{ background: "#eee" }}>
          <ColorPanel user={this.props.user} />
          <SidePanel
            primary={this.props.primaryColor}
            accent={this.props.accentColor}
            user={this.props.user ? this.props.user : null}
          />
          <Messages
            primary={this.props.primaryColor}
            secondary={this.props.secondaryColor}
            accent={this.props.accentColor}
            key={this.props.user && this.props.user.uid}
            channel={this.props.currentChannel}
            user={this.props.user}
            userPosts={this.props.userPosts}
            isPrivate={this.props.isPrivate}
          />
        </Main>
      );
    } else {
      return <Spinner />;
    }
  }
}

const mapStateToProps = state => {
  return {
    user: state.user.currentUser,
    currentChannel: state.channel.currentChannel,
    isPrivate: state.channel.isPrivate,
    userPosts: state.channel.userPosts,
    primaryColor: state.color.primary,
    secondaryColor: state.color.secondary,
    accentColor: state.color.accent
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setUser: user => dispatch(setUser(user)),
    clearUser: () => dispatch(clearUser())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
