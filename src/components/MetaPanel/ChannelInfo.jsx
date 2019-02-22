import React, { Component } from "react";
import {
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
  List
} from "@material-ui/core";
import * as Icons from "@material-ui/icons";
import styled from "styled-components";

const Wrapper = styled.div`
  font-size: 1.5em;
  color: #000;
  text-align: center;
  padding: 10px;
`;

export class ChannelInfo extends Component {
  state = {
    expanded: null
  };

  handleChange = panel => (event, expanded) => {
    this.setState({
      expanded: expanded ? panel : false
    });
  };

  displayTopPosters = userPosts => {
    return Object.entries(userPosts)
      .sort((a, b) => b.count - a.count)
      .map(([key, val], i) => (
        <ListItem key={i}>
          <ListItemAvatar>
            <Avatar src={val.avatar} />
          </ListItemAvatar>
          <ListItemText
            primary={key}
            secondary={<span>{val.count} posts</span>}
          />
        </ListItem>
      ));
  };

  render() {
    const { expanded } = this.state;
    return (
      <Wrapper>
        <h2 style={{ color: "#fff" }}>
          About {this.props.channel && this.props.channel.name}
        </h2>
        <ExpansionPanel
          expanded={expanded === "panel1"}
          onChange={this.handleChange("panel1")}
        >
          <ExpansionPanelSummary expandIcon={<Icons.ExpandMoreRounded />}>
            <span>
              <Icons.InfoOutlined />
            </span>
            Channel Details
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            {this.props.channel && this.props.channel.details}
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <ExpansionPanel
          expanded={expanded === "panel2"}
          onChange={this.handleChange("panel2")}
        >
          <ExpansionPanelSummary expandIcon={<Icons.ExpandMoreRounded />}>
            <span>
              <Icons.PeopleOutlineOutlined />
            </span>
            Top Posters
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <List>
              {this.props.userPosts &&
                this.displayTopPosters(this.props.userPosts)}
            </List>
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <ExpansionPanel
          expanded={expanded === "panel3"}
          onChange={this.handleChange("panel3")}
        >
          <ExpansionPanelSummary expandIcon={<Icons.ExpandMoreRounded />}>
            <span>
              <Icons.PersonOutlineRounded />
            </span>
            Creator
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <ListItem>
              <ListItemAvatar>
                <Avatar
                  src={
                    this.props.channel && this.props.channel.createdBy.avatar
                  }
                />
              </ListItemAvatar>
              <ListItemText
                primary={
                  this.props.channel && this.props.channel.createdBy.name
                }
              />
            </ListItem>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </Wrapper>
    );
  }
}

export default ChannelInfo;
