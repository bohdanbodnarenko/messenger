import React, { Component } from "react";
import "./App.css";
import { connect } from "react-redux";

import { Grid, GridColumn } from "semantic-ui-react";
import ColorPanel from "./ColorPanel/ColorPanel";
import SidePanel from "./SidePanel/SidePanel";
import Messages from "./Messages/Messages";
import MetaPanel from "./MetaPanel/MetaPalel";
import Spinner from "../UI/Spinner";

import firebase from "../firebase";
import { setUser, clearUser } from "../store/actions";

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
        <Grid columns="equal" className="app" style={{ background: "#eee" }}>
          <ColorPanel />
          <SidePanel
            key={this.props.user && this.props.user.uid}
            user={this.props.user ? this.props.user : null}
          />
          <GridColumn style={{ marginLeft: 320 }}>
            <Messages
              key={this.props.user && this.props.user.uid}
              channel={this.props.currentChannel}
              user={this.props.user}
              isPrivate={this.props.isPrivate}
            />
          </GridColumn>
          <GridColumn width={4}>
            <MetaPanel />
          </GridColumn>
        </Grid>
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
    isPrivate: state.channel.isPrivate
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
