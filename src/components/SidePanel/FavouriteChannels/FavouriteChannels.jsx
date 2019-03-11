import React, { Component } from "react";
import { connect } from "react-redux";

import firebase from "../../../firebase";
// import { MenuMenu, MenuItem, Icon } from "semantic-ui-react";
import { setCurrentChannel, setPrivateChannel } from "../../../store/actions";
import { ListItem, List } from "@material-ui/core";
import * as Icons from "@material-ui/icons";
import styled from "styled-components";

const ListWrapper = styled.div`
  max-height: 100%;
  overflow-y: scroll;
`;

export class FavouriteChannels extends Component {
  state = {
    user: this.props.user,
    favouriteChannels: [],
    activeChannel: "",
    usersRef: firebase.database().ref("users"),
    open: false
  };

  componentDidMount = () => {
    if (this.state.user) {
      this.addListeners(this.state.user.uid);
    }
  };

  addListeners = uid => {
    this.state.usersRef
      .child(uid)
      .child("starred")
      .on("child_added", snap => {
        const starredChannel = { id: snap.key, ...snap.val() };
        this.setState({
          favouriteChannels: [...this.state.favouriteChannels, starredChannel]
        });
      });
    this.state.usersRef
      .child(uid)
      .child("starred")
      .on("child_removed", snap => {
        const channelToRemove = { id: snap.key, ...snap.val() };
        const filteredChannels = this.state.favouriteChannels.filter(
          channel => channel.id !== channelToRemove.id
        );
        this.setState({ favouriteChannels: filteredChannels });
      });
  };

  changeChannel = channel => {
    this.setActiveChannel(channel);
    this.props.setCurrentChannel(channel);
    this.props.setPrivateChannel(false);
  };

  displayChannels = channels => {
    if (channels.length > 0) {
      return channels.map(channel => (
        <ListItem
          className="link"
          key={channel.id}
          onClick={() => this.changeChannel(channel)}
          name={channel.name}
          style={{
            opacity: 0.7,
            width: "100%",
            height: "15%"
          }}
        >
          <Icons.ChatBubble />
          {channel.name}
        </ListItem>
      ));
    }
  };

  setActiveChannel = channel => {
    this.setState({ activeChannel: channel.id });
  };

  render() {
    const { favouriteChannels } = this.state;
    return (
      <ListWrapper>
        <List>{this.displayChannels(favouriteChannels)}</List>
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
)(FavouriteChannels);
