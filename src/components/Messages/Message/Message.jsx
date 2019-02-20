import React, { Fragment } from "react";
import moment from "moment";
import { Paper, withStyles, Avatar } from "@material-ui/core";
import styled from "styled-components";

const Message = props => {
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
    color: #fff;
    background: ${props => (props.own ? "#003459" : "#24a1db")};
    padding: ${props => (props.img ? "0" : "7px")};
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
  `;

  const ContentWrapper = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
  `;

  const isImage = message => {
    return (
      message.hasOwnProperty("image") && !message.hasOwnProperty("content")
    );
  };

  const isOwnMessage = (message, user) => {
    return message.user.id === user.uid;
  };

  return (
    <Wrapper own={isOwnMessage(props.message, props.user)}>
      {!isOwnMessage(props.message, props.user) ? (
        <Avatar src={props.message.user.avatar} />
      ) : null}
      <MessageWrapper
        img={isImage(props.message)}
        own={isOwnMessage(props.message, props.user)}
      >
        <ContentWrapper>
          {!isOwnMessage(props.message, props.user) ? (
            <UserName>{props.message.user.name}</UserName>
          ) : null}
          {isImage(props.message) ? (
            <ContentImage
              own={isOwnMessage(props.message, props.user)}
              src={props.message.image}
              className="message_image"
            />
          ) : (
            <Fragment>
              <Content own={isOwnMessage(props.message, props.user)}>
                {props.message.content}
              </Content>
              <TimeStamp>{moment(props.message.timestamp).fromNow()}</TimeStamp>
            </Fragment>
          )}
        </ContentWrapper>
      </MessageWrapper>
      {isOwnMessage(props.message, props.user) ? (
        <Avatar src={props.message.user.avatar} />
      ) : null}
    </Wrapper>
  );
};

export default Message;
