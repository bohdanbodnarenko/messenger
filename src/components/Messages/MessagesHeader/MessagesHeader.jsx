import React, { Component, Fragment } from "react";

import {
  TextField,
  withStyles,
  IconButton,
  Menu,
  ListItem,
  Avatar,
  ListItemText,
  ListItemAvatar,
  List
} from "@material-ui/core";
import styled from "styled-components";
import * as Icons from "@material-ui/icons";

const NameWrapper = styled.div`
  font-size: 2.1em;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: #fff;
  font-weight: 500;
`;

const Wrapper = styled.div`
  padding: 15px;
  border-left: 1px #000 solid;
  border-bottom: 1px #000 solid;
  background: ${props => props.background};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const styles = {
  input: {
    color: "#fff"
  }
};
export class MessagesHeader extends Component {
  state = {
    anchorEl: null
  };

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  displayTopPosters = userPosts => {
    return Object.entries(userPosts)
      .sort((a, b) => b.count - a.count)
      .map(([key, val], i) => (
        <ListItem key={i}>
          <ListItemAvatar>
            <Avatar
              style={{ width: "30px", height: "30px" }}
              src={val.avatar}
            />
          </ListItemAvatar>
          <ListItemText
            primary={key}
            secondary={<span>{val.count} posts</span>}
          />
        </ListItem>
      ));
  };

  render() {
    const { anchorEl } = this.state;
    const {
      classes,
      color,
      channel,
      isPrivate,
      isChannelStarred,
      numUniqueUsers,
      userPosts
    } = this.props;
    return (
      <Wrapper background={color}>
        <NameWrapper style={{ marginBottom: 0 }}>
          <div className="centered">
            {channel && channel.name}
            {isPrivate ? (
              <Icons.Person style={{ color: "#fff" }} />
            ) : isChannelStarred ? (
              <Icons.StarRounded
                onClick={this.props.handleStar}
                style={{
                  cursor: "pointer",
                  color: "#FFD166"
                }}
              />
            ) : (
              <Icons.StarBorderRounded
                onClick={this.props.handleStar}
                style={{
                  cursor: "pointer",
                  color: "#fff"
                }}
              />
            )}
          </div>
          <span style={{ fontSize: ".6em", marginTop: "15px" }}>
            {numUniqueUsers}
          </span>
        </NameWrapper>
        <div>
          <TextField
            onChange={this.props.search()}
            icon="search"
            variant="outlined"
            name="searchItem"
            placeholder="Search Messages"
            InputProps={{
              className: classes.input
            }}
          />
          {channel && userPosts && channel.createdBy ? (
            <Fragment>
              <IconButton
                disabled={!Boolean(channel)}
                aria-owns={anchorEl ? "info-menu" : undefined}
                aria-haspopup="true"
                onClick={this.handleClick}
              >
                <Icons.InfoOutlined style={{ color: "white" }} />
              </IconButton>
              <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={this.handleClose}
              >
                <ListItem style={{ outline: "none" }}>
                  <ListItemAvatar>
                    <Icons.Details />
                  </ListItemAvatar>
                  <ListItemText primary="Details" secondary={channel.details} />
                </ListItem>
                <ListItem style={{ outline: "none" }}>
                  <ListItemAvatar>
                    <Icons.PeopleOutlineRounded />
                  </ListItemAvatar>
                  <ListItemText
                    primary="Top Posters"
                    // secondary={<List>{this.displayTopPosters(userPosts)}</List>}
                  />
                  <div style={{ maxHeight: "50%", overflowY: "scroll" }}>
                    {this.displayTopPosters(userPosts)}
                  </div>
                </ListItem>
                <ListItem style={{ outline: "none" }}>
                  <ListItemAvatar>
                    <Icons.PersonOutlineRounded />
                  </ListItemAvatar>

                  <ListItemText
                    primary="Creator"
                    secondary={channel.createdBy.name}
                  />
                </ListItem>
              </Menu>
            </Fragment>
          ) : null}
        </div>
      </Wrapper>
    );
  }
}

export default withStyles(styles)(MessagesHeader);
