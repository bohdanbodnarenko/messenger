import React, { Component } from "react";
import UserPanel from "./UserPanel/UserPanel";
import Channels from "./Channels/Channels";
import DirectMessages from "./DirectMessages/DirectMessages";
import FavouriteChannels from "./FavouriteChannels/FavouriteChannels";
import Spinner from "../../UI/Spinner";
import styled from "styled-components";
import { withStyles, Tabs, Tab, Paper } from "@material-ui/core";
import * as Icons from "@material-ui/icons";

const Menu = styled.div`
  padding: 20px;
  background: ${props => props.background};
  font-size: 1.2rem;
  display: grid;
  grid-template-columns: 100%;
  grid-template-rows: 15% 75% 8%;
  grid-row-gap: 15px;
`;

const styles = theme => ({
  tabsRoot: {
    borderTop: "0.5px solid #e8e8e8"
  },
  tabsIndicator: {
    backgroundColor: "#1890ff"
  },
  tabRoot: {
    textTransform: "initial",
    minWidth: "32%",
    "&:hover": {
      color: "#40a9ff",
      opacity: 1
    },
    "&$tabSelected": {
      color: "#1890ff",
      fontWeight: theme.typography.fontWeightMedium
    },
    "&:focus": {
      color: "#40a9ff"
    }
  },
  tabSelected: {},
  typography: {
    padding: theme.spacing.unit * 3
  }
});

export class SidePanel extends Component {
  state = {
    tabValue: 0,
    value: 0
  };
  handleChange = (event, value) => {
    this.setState({ value });
  };
  render() {
    if (!this.props.user) {
      return <Spinner />;
    }
    const { value } = this.state;
    const { classes, primary, accent } = this.props;
    return (
      <Menu background={primary}>
        <UserPanel color={accent} user={this.props.user} />
        {value === 0 && <FavouriteChannels user={this.props.user} />}
        {value === 1 && <Channels user={this.props.user} />}
        {value === 2 && <DirectMessages user={this.props.user} />}
        <Tabs
          
          value={value}
          onChange={this.handleChange}
          variant="fullWidth"
          classes={{
            root: classes.tabsRoot,
            indicator: classes.tabsIndicator
          }}
        >
          <Tab
            disableRipple
            icon={<Icons.Star />}
            classes={{ root: classes.tabRoot, selected: classes.tabSelected }}
          />
          <Tab
            disableRipple
            icon={<Icons.ChatRounded />}
            classes={{ root: classes.tabRoot, selected: classes.tabSelected }}
          />
          <Tab
            disableRipple
            icon={<Icons.PeopleOutlineRounded />}
            classes={{ root: classes.tabRoot, selected: classes.tabSelected }}
          />
        </Tabs>
      </Menu>
    );
  }
}

export default withStyles(styles)(SidePanel);
