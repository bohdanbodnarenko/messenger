import React, { Component } from "react";
import { connect } from "react-redux";

import firebase from "../../../firebase";
import { MenuMenu, MenuItem, Icon } from "semantic-ui-react";
import { setCurrentChannel, setPrivateChannel } from "../../../store/actions";

export class FavouriteChannels extends Component {
  state = {
    user: this.props.user,
    favouriteChannels: [],
    activeChannel: "",
    usersRef: firebase.database().ref("users")
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
        console.log(filteredChannels)
        this.setState({favouriteChannels:filteredChannels})
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
        <MenuItem
          key={channel.id}
          onClick={() => this.changeChannel(channel)}
          name={channel.name}
          style={{ opacity: 0.7 }}
          active={channel.id === this.state.activeChannel}
        >
          # {channel.name}
        </MenuItem>
      ));
    }
  };

  setActiveChannel = channel => {
    this.setState({ activeChannel: channel.id });
  };

  render() {
    const { favouriteChannels } = this.state;
    return (
      <MenuMenu className="menu">
        <MenuItem>
          <span>
            <Icon name="star" />
            Favourite
          </span>
          {"  "}({favouriteChannels.length}){" "}
          <Icon
            onClick={this.openModal}
            className="clickable-icon"
            name="add"
          />
        </MenuItem>
        {this.displayChannels(favouriteChannels)}
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
)(FavouriteChannels);
