import React, { Component } from "react";

import { withStyles, Tabs, AppBar, Tab } from "@material-ui/core";
import * as Icons from "@material-ui/icons";
import { ChannelInfo } from "./ChannelInfo";
import Emoji from "./Emojis";

const styles = theme => ({
  indicator: {
    backgroundColor: "#00A8E8"
  },
  root: {
    backgroundColor: "#003459"
  }
});

export class MetaPanel extends Component {
  state = {
    expanded: null,
    tabValue: 0
  };

  handleTabChange = (event, value) => {
    this.setState({ tabValue: { value }.value });
  };

  componentWillReceiveProps = nextProps => {
    if (nextProps.isPrivate) {
      this.setState({ tabValue: 0 });
    }
  };

  render() {
    const { tabValue } = this.state;
    const { classes } = this.props;

    return (
      <div style={{ background: "#003459", borderLeft: ".5px #00171F solid" }}>
        <AppBar position="static">
          <Tabs
            classes={{ indicator: classes.indicator, root: classes.root }}
            value={tabValue}
            onChange={this.handleTabChange}
          >
            <Tab label="Emoji" />
            <Tab disabled={this.props.isPrivate} label="Channel Info" />
          </Tabs>
        </AppBar>
        {tabValue === 0 && <Emoji />}
        {tabValue === 1 && (
          <ChannelInfo
            userPosts={this.props.userPosts}
            channel={this.props.channel}
          />
        )}
      </div>
    );
  }
}

export default withStyles(styles)(MetaPanel);
