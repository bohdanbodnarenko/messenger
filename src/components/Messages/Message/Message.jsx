import React, { Fragment, Component } from "react";
import moment from "moment";
import { Avatar, MenuItem, Menu } from "@material-ui/core";
import styled from "styled-components";

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  padding: 0 10px;
  align-items: flex-end;
  justify-content: ${props => (props.own ? "flex-end" : "flex-start")};
`;

const MessageWrapper = styled.div`
  margin-top: 9px;
  min-width: 150px;
  max-width: 80%;
  min-height: 50px;
  border-radius: 15px;
  border-bottom-right-radius: ${props => (props.own ? 0 : "15px")};
  border-bottom-left-radius: ${props => (props.own ? "15px" : 0)};
  margin-right: ${props => (props.own ? "7px" : 0)};
  margin-left: ${props => (props.own ? 0 : "7px")};
  background: ${props => props.background};
  padding: ${props => (props.img ? "0" : "7px")};
  color: #fff;
  position: relative;
  overflow: hidden;
`;

const UserName = styled.span`
  font-size: 1em;
  font-weight: 600;
`;

const TimeStamp = styled.span`
  align-self: flex-end;
  color: #eee;
  opacity: 0.8;
  font-size: 1em;
`;
const Content = styled.span`
  font-size: 1.25em;
  padding-top: ${props => (props.own ? "8px" : "")};
  padding-left: ${props => (props.own ? "4px" : "")};
`;

const ContentImage = styled.img`
  padding: 0;
  position: relative;
  right: 0;
  top: 0;
  width: 40%;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
`;

class Message extends Component {
  state = {
    anchorEl: null
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  handleRightClick = event => {
    event.preventDefault();
    console.log(event.terget);
    this.setState({ anchorEl: event.currentTarget });
  };

  isOwnMessage = (message, user) => {
    return message.user.id === user.uid;
  };

  isImage = message => {
    return (
      message.hasOwnProperty("image") && !message.hasOwnProperty("content")
    );
  };

  render() {
    const { anchorEl } = this.state;

    return (
      <Wrapper own={this.isOwnMessage(this.props.message, this.props.user)}>
        {!this.isOwnMessage(this.props.message, this.props.user) ? (
          <Avatar src={this.props.message.user.avatar} />
        ) : null}
        <Menu
          id="right-click-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleClose}
        >
          <MenuItem onClick={this.handleCopy}>Copy Text</MenuItem>
          <MenuItem onClick={this.props.handleDelete(this.props.message)}>
            Delete Message
          </MenuItem>
        </Menu>
        <MessageWrapper
          background={
            this.isOwnMessage(this.props.message, this.props.user)
              ? this.props.primary
              : this.props.accent
          }
          onContextMenu={this.handleRightClick}
          img={this.isImage(this.props.message)}
          own={this.isOwnMessage(this.props.message, this.props.user)}
        >
          <ContentWrapper>
            {!this.isOwnMessage(this.props.message, this.props.user) ? (
              <UserName>{this.props.message.user.name}</UserName>
            ) : null}
            {this.isImage(this.props.message) ? (
              <ContentImage
                own={this.isOwnMessage(this.props.message, this.props.user)}
                src={this.props.message.image}
                className="message_image"
              />
            ) : (
              <Fragment>
                <Content
                  own={this.isOwnMessage(this.props.message, this.props.user)}
                >
                  {this.props.message.content}
                </Content>
                <TimeStamp
                  aria-owns={anchorEl ? "right-click-menu" : undefined}
                >
                  {moment(this.props.message.timestamp).fromNow()}
                </TimeStamp>
              </Fragment>
            )}
          </ContentWrapper>
        </MessageWrapper>
        {this.isOwnMessage(this.props.message, this.props.user) ? (
          <Avatar src={this.props.message.user.avatar} />
        ) : null}
      </Wrapper>
    );
  }
}

export default Message;
