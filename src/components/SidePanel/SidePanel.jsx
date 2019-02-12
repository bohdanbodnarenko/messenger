import React, { Component } from "react";
import { Menu } from "semantic-ui-react";
import UserPanel from "./UserPanel/UserPanel";
import Channels from "./Channels/Channels";

export class SidePanel extends Component {
  
  

  render() {
    return (
      <Menu
        size="large"
        inverted
        fixed="left"
        vertical
        style={{ background: "#5c3a58", fontSize: "1.2rem" }}
      >
        <UserPanel user={this.props.user} />
        <Channels user={this.props.user} />
      </Menu>
    );
  }
}

export default SidePanel;
