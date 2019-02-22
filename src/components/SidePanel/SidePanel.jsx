import React, { Component } from "react";
import UserPanel from "./UserPanel/UserPanel";
import Channels from "./Channels/Channels";
import DirectMessages from "./DirectMessages/DirectMessages";
import FavouriteChannels from "./FavouriteChannels/FavouriteChannels";
import Spinner from "../../UI/Spinner";
import styled from "styled-components";

const Menu = styled.div`
  padding: 20px;
  background: #003459;
  font-size: 1.2rem;
  display: grid;
  grid-template-columns: 100%;
  grid-template-rows: 150px minmax(150px, 80%);
  grid-row-gap: 15px;
`;

const PannelsWrapper = styled.div`
  background: red;
  height: 100%;
  width: 100%;
`;

export class SidePanel extends Component {
  render() {
    if (!this.props.user) {
      return <Spinner />;
    }
    return (
      <Menu>
        <UserPanel user={this.props.user} />
        <PannelsWrapper>
          <FavouriteChannels user={this.props.user} />
          <Channels user={this.props.user} />
          <DirectMessages user={this.props.user} />
        </PannelsWrapper>
      </Menu>
    );
  }
}

export default SidePanel;
