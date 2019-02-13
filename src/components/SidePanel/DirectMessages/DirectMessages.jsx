import React, { Component } from "react";
import { connect } from "react-redux";

import { MenuMenu, MenuItem, Icon } from "semantic-ui-react";
import firebase from "../../../firebase";
import { setCurrentChannel, setPrivateChannel } from "../../../store/actions";

export class DirectMessages extends Component {
  state = {
    users: [],
    user: this.props.user,
    usersRef: firebase.database().ref("users"),
    connectedRef: firebase.database().ref(".info/connected"),
    presenceRef: firebase.database().ref("presence")
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
  };

  getChannelId = uid => {
    return uid < this.state.user.uid
      ? `${uid}/${this.state.user.uid}`
      : `${this.state.user.uid}/${uid}`;
  };
  render() {
    const { users } = this.state;
    return (
      <MenuMenu className="menu">
        <MenuItem>
          <span>
            <Icon name="users" /> Users
          </span>{" "}
          ({this.state.users.length})
        </MenuItem>
        {users.map(user => (
          <MenuItem
            key={user.uid}
            onClick={() => this.changeChannel(user)}
            style={{ opacity: 0.7, fontStyle: "italic" }}
          >
            <Icon
              name="circle"
              color={this.isUserOnline(user) ? "green" : "red"}
            />
            @ {user.name}
          </MenuItem>
        ))}
      </MenuMenu>
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
