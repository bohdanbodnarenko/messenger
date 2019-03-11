import React, { Component, Fragment } from "react";
import { connect } from "react-redux";

import MessagesHeader from "./MessagesHeader/MessagesHeader";
import MessageForm from "./MessageForm/MessageForm";
import firebase from "../../firebase";
import Message from "./Message/Message";
import { setUserPosts } from "../../store/actions";
import { Paper, Typography } from "@material-ui/core";
import styled from "styled-components";
import Typing from "./Typing/Typing";
import MessageSkeleton from "./MessageSkeleton/MessageSkeleton";

const MessagesWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 100%;
  grid-template-rows: 10% 85% 5%;
`;

const MessagesContainer = styled.div`
  border-radius: 0;
  box-shadow: none;
  max-height: 100%;
  background: ${props => props.background};
  overflow-y: scroll;
  padding-bottom: 15px;
`;

const SelectChannelWrapper = styled.div`
  background: ${props => props.background};
  color: ${props => props.color};
  border-radius: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const DotsWrapper = styled.div`
  margin-left: "9px";
  display: flex;
  align-items: center;
  color: ${props => props.color};
  margin-bottom: 0.5em;
`;
class Messages extends Component {
  state = {
    messagesRef: firebase.database().ref("messages"),
    privateMessagesRef: firebase.database().ref("privateMessages"),
    usersRef: firebase.database().ref("users"),
    typingRef: firebase.database().ref("typing"),
    messages: [],
    messagesLoading: true,
    numUniqueUsers: "",
    searchResults: [],
    searchKey: "",
    isChannelStarred: false,
    anchorEl: null,
    typingUsers: [],
    connectedRef: firebase.database().ref(".info/connected")
  };

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.channel &&
      nextProps.user &&
      nextProps.channel !== this.props.channel
    ) {
      this.addListeners(nextProps.channel.id);
      this.addUserStarsListener(nextProps.channel.id, nextProps.user.uid);
    }
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (this.messagesEnd) {
      this.messagesEnd.scrollIntoView({ behavior: "smooth" });
    }
  };

  addUserStarsListener = (channelId, uid) => {
    this.state.usersRef
      .child(uid)
      .child("starred")
      .once("value")
      .then(data => {
        if (data.val() !== null) {
          const channelIds = Object.keys(data.val());
          const prevStarred = channelIds.includes(channelId);
          this.setState({ isChannelStarred: prevStarred });
        }
      });
  };

  handleStar = () => {
    this.setState(
      {
        isChannelStarred: !this.state.isChannelStarred
      },
      () => this.starChannel()
    );
  };

  starChannel = () => {
    if (this.state.isChannelStarred) {
      this.state.usersRef.child(`${this.props.user.uid}/starred`).update({
        [this.props.channel.id]: {
          name: this.props.channel.name,
          details: this.props.channel.details,
          createdBy: {
            name: this.props.channel.createdBy.name,
            avatar: this.props.channel.createdBy.avatar
          }
        }
      });
    } else {
      this.state.usersRef
        .child(`${this.props.user.uid}/starred`)
        .child(this.props.channel.id)
        .remove(err => {
          if (err) {
            console.error(err);
          }
        });
    }
  };

  getMessagesRef = () => {
    return this.props.isPrivate
      ? this.state.privateMessagesRef
      : this.state.messagesRef;
  };

  addListeners = channelId => {
    this.addMessageListener(channelId);
    this.addTypingListener(channelId);
  };

  addTypingListener = channelId => {
    let typingUsers = [];
    this.state.typingRef.child(channelId).on("child_added", snap => {
      if (snap.key !== this.props.user.uid) {
        typingUsers = typingUsers.concat({
          id: snap.key,
          name: snap.val()
        });
        this.setState({ typingUsers });
      }
    });
    this.state.typingRef.child(channelId).on("child_removed", snap => {
      const index = typingUsers.findIndex(user => user.id === snap.key);
      if (index !== -1) {
        typingUsers = typingUsers.filter(user => user.id !== snap.key);
        this.setState({ typingUsers });
      }
    });

    this.state.connectedRef.on("value", snap => {
      if (snap.val() === true) {
        this.state.typingRef
          .child(channelId)
          .child(this.props.user.uid)
          .onDisconnect()
          .remove(err => {
            if (err) {
              console.error(err);
            }
          });
      }
    });
  };

  addMessageListener = channelId => {
    let loadedMessages = [];
    const ref = this.getMessagesRef();
    ref.child(channelId).on("child_added", snap => {
      loadedMessages.push(snap.val());
      this.countUniqueUsers(loadedMessages);
      this.countUserPosts(loadedMessages);
      this.setState({
        messages: loadedMessages,
        messagesLoading: false
      });
    });
    if (!loadedMessages.length > 0) {
      this.setState({
        messages: [],
        messagesLoading: false
      });
    }
  };

  countUserPosts = messages => {
    let userPosts = messages.reduce((acc, message) => {
      if (message.user.name in acc) {
        acc[message.user.name].count += 1;
      } else {
        acc[message.user.name] = {
          avatar: message.user.avatar,
          count: 1
        };
      }
      return acc;
    }, {});
    this.props.setUserPosts(userPosts);
  };

  handleSearchChange = () => event => {
    this.setState(
      {
        searchKey: event.target.value
      },
      () => this.handleSearchMessage()
    );
  };

  handleSearchMessage = () => {
    const channelMessages = [...this.state.messages];
    const regex = new RegExp(this.state.searchKey, "gi");
    this.setState({
      searchResults: channelMessages.filter(message => {
        if (message.content) {
          return message.content.match(regex);
        }
      })
    });
  };

  countUniqueUsers = messages => {
    const uniqueUsers = messages.reduce((acc, message) => {
      if (!acc.includes(message.user.name)) {
        acc.push(message.user.name);
      }
      return acc;
    }, []);
    this.setState({
      numUniqueUsers: `${uniqueUsers.length} user${
        uniqueUsers.length === 1 ? "" : "s"
      }`
    });
  };

  displayChannelName = channel => {
    return channel ? `${this.props.isPrivate ? "@" : "#"}${channel.name}` : "";
  };

  handleDelete = message => event => {
    console.log(message);
  };

  displayMessages = messages => {
    if (messages.length > 0) {
      return messages.map(message => (
        <Message
          handleDelete={this.handleDelete}
          handleRightClick={this.handleRightClick}
          anchorEl={this.state.anchorEl}
          key={message.timestamp}
          message={message}
          user={this.props.user}
          primary={this.props.primary}
          accent={this.props.accent}
        />
      ));
    }
  };

  displayTypingUsers = users => {
    return (
      users.length > 0 &&
      users.map(user => (
        <DotsWrapper key={user.id} color={this.props.accent}>
          <span className="user-typing">{user.name} is typing </span>
          <Typing />
        </DotsWrapper>
      ))
    );
  };

  displayMessageSkeleton = loading =>
    loading ? (
      <Fragment>
        {[...Array(10)].map((_, i) => (
          <MessageSkeleton key={i} />
        ))}
      </Fragment>
    ) : null;

  render() {
    if (this.props.channel) {
      return (
        <MessagesWrapper>
          <MessagesHeader
            color={this.props.primary}
            search={this.handleSearchChange}
            channel={this.props.channel}
            userPosts={this.props.userPosts}
            numUniqueUsers={this.state.numUniqueUsers}
            isPrivate={this.props.isPrivate}
            handleStar={this.handleStar}
            isChannelStarred={this.state.isChannelStarred}
          />
          <MessagesContainer background={this.props.secondary}>
            <div>
              {this.displayMessageSkeleton(this.state.messagesLoading)}
              {this.state.messages.length > 0 ? (
                this.state.searchKey ? (
                  this.displayMessages(this.state.searchResults)
                ) : (
                  this.displayMessages(this.state.messages)
                )
              ) : (
                <Paper style={{ color: "#fff", background: this.props.accent }}>
                  No messages yet!
                </Paper>
              )}
              {this.displayTypingUsers(this.state.typingUsers)}
              <div ref={node => (this.messagesEnd = node)} />
            </div>
          </MessagesContainer>
          <MessageForm
            channel={this.props.channel}
            user={this.props.user}
            messagesRef={this.getMessagesRef()}
            isPrivate={this.props.isPrivate}
          />
        </MessagesWrapper>
      );
    } else {
      return (
        <SelectChannelWrapper
          background={this.props.secondary}
          color={this.props.accent}
        >
          <h2>Please select channel</h2>
        </SelectChannelWrapper>
      );
    }
  }
}

const mapStateToProps = state => {
  return {
    currentChannel: state.channel.currentChannel
  };
};
const mapDispatchToProps = dispatch => {
  return {
    setUserPosts: userPosts => dispatch(setUserPosts(userPosts))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Messages);
