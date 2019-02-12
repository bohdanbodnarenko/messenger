import React, { Component } from "react";
import "./App.css";
import { connect } from "react-redux";

import { Grid, GridColumn } from "semantic-ui-react";
import ColorPanel from "./ColorPanel/ColorPanel";
import SidePanel from "./SidePanel/SidePanel";
import Messages from "./Messages/Messages";
import MetaPanel from "./MetaPanel/MetaPalel";

class App extends Component {
  render() {
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
          />
        </GridColumn>
        <GridColumn width={4}>
          <MetaPanel />
        </GridColumn>
      </Grid>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.user.currentUser,
    currentChannel: state.channel.currentChannel
  };
};

export default connect(mapStateToProps)(App);
