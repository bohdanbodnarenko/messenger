import React, { Component } from "react";
import { connect } from "react-redux";

import firebase from "../../../firebase";
import { setCurrentChannel, setPrivateChannel } from "../../../store/actions";
import * as Icons from "@material-ui/icons";
import { ListItem, List } from "@material-ui/core";
import styled from "styled-components";

const ListWrapper = styled.div`
  max-height: 100%;
  overflow-y: scroll;
`;

export class DirectMessages extends Component {
  state = {
    users: [],
    activeChannel: null,
    user: this.props.user,
    usersRef: firebase.database().ref("users"),
    connectedRef: firebase.database().ref(".info/connected"),
    presenceRef: firebase.database().ref("presence"),
    open: false
  };

  componentDidMount() {
    if (this.state.user) {
      this.addListeners(this.state.user.uid);
    }
  }

  addStatusToUser = (uid, connected = true) => {
    const updatedUsers = this.state.users.reduce((acc, user) => {
      if (user.uid === uid) {
        user["status"] = `${connected ? "online" : "offline"}`;
      }
      return acc.concat(user);
    }, []);
    this.setState({ users: updatedUsers });
  };

  addListeners = uid => {
    let loadedUsers = [];
    this.state.usersRef.on("child_added", snap => {
      if (uid !== snap.key) {
        let user = snap.val();
        user["uid"] = snap.key;
        user["status"] = "offline";
        loadedUsers.push(user);
        this.setState({ users: loadedUsers });
      }
    });
    this.state.connectedRef.on("value", snap => {
      if (snap.val() === true) {
        const ref = this.state.presenceRef.child(uid);
        ref.set(true);
        ref.onDisconnect().remove(err => {
          if (err !== null) {
            console.error(err);
          }
        });
      }
    });
    this.state.presenceRef.on("child_added", snap => {
      if (uid !== snap.key) {
        this.addStatusToUser(snap.key);
      }
    });
    this.state.presenceRef.on("child_removed", snap => {
      if (uid !== snap.key) {
        this.addStatusToUser(snap.key, false);
      }
    });
  };

  isUserOnline = user => user.status === "online";

  changeChannel = user => {
    const channelId = this.getChannelId(user.uid);
    const channelData = {
      id: channelId,
      name: user.name
    };
    this.props.setCurrentChannel(channelData);
    this.props.setPrivateChannel(true);
    this.setActiveChannel(user.uid);
  };

  setActiveChannel = activeChannel => {
    this.setState({ activeChannel });
  };

  getChannelId = uid => {
    return uid < this.state.user.uid
      ? `${uid}/${this.state.user.uid}`
      : `${this.state.user.uid}/${uid}`;
  };

  toggleOpen = () => {
    this.setState({ open: !this.state.open });
  };
  render() {
    const { users } = this.state;
    return (
      <ListWrapper>
        <List>
          {users.map(user => (
            <ListItem
              key={user.uid}
              onClick={() => this.changeChannel(user)}
              className="link"
              style={{
                opacity: 0.7,
                fontStyle: "italic",
                width: "100%",
                height: "15%",
                marginBottom: "5px"
              }}
            >
              <Icons.Label
                style={{
                  color: this.isUserOnline(user) ? "#02C39A" : "#D90429"
                }}
              />
              {user.name}
              {/* <Icons.BlurCircularRounded /> */}
            </ListItem>
          ))}
        </List>
      </ListWrapper>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setCurrentChannel: channel => dispatch(setCurrentChannel(channel)),
    setPrivateChannel: isPrivate => dispatch(setPrivateChannel(isPrivate))
  };
};

export default connect(
  null,
  mapDispatchToProps
)(DirectMessages);
