import React, { Component } from "react";
import { Menu } from "semantic-ui-react";
import UserPanel from "./UserPanel/UserPanel";
import Channels from "./Channels/Channels";
import DirectMessages from "./DirectMessages/DirectMessages";
import FavouriteChannels from "./FavouriteChannels/FavouriteChannels";
import Spinner from "../../UI/Spinner";

export class SidePanel extends Component {
  render() {
    if (!this.props.user) {
      return <Spinner />;
    }
    return (
      <Menu
        size="large"
        inverted
        fixed="left"
        vertical
        style={{ background: "#5c3a58", fontSize: "1.2rem" }}
      >
        <UserPanel user={this.props.user} />
        <FavouriteChannels user={this.props.user} />
        <Channels user={this.props.user} />
        <DirectMessages user={this.props.user} />
      </Menu>
    );
  }
}

export default SidePanel;
