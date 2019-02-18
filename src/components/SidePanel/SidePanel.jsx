import React, { Component } from "react";
import UserPanel from "./UserPanel/UserPanel";
import Channels from "./Channels/Channels";
import DirectMessages from "./DirectMessages/DirectMessages";
import FavouriteChannels from "./FavouriteChannels/FavouriteChannels";
import Spinner from "../../UI/Spinner";
import styled from "styled-components";

const Menu = styled.div`
  padding: 20px;
  background: #4c6085;
  font-size: 1.2rem;
`;

export class SidePanel extends Component {
  render() {
    if (!this.props.user) {
      return <Spinner />;
    }
    return (
      <Menu>
        <UserPanel user={this.props.user} />
        <FavouriteChannels user={this.props.user} />
        <Channels user={this.props.user} />
        <DirectMessages user={this.props.user} />
      </Menu>
    );
  }
}

export default SidePanel;
