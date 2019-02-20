import React, { Component, Fragment } from "react";
import { connect } from "react-redux";

import { Segment, CommentGroup, Label } from "semantic-ui-react";
import MessagesHeader from "./MessagesHeader/MessagesHeader";
import MessageForm from "./MessageForm/MessageForm";
import firebase from "../../firebase";
import Message from "./Message/Message";
import { setUserPosts } from "../../store/actions";
import { Paper, withStyles } from "@material-ui/core";
import styled from "styled-components";

const MessagesWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 100%;
  grid-template-rows: 10% 85% 5%;
`;

const styles = {
  root: {
    borderRadius: 0,
    boxShadow: "none",
    maxHeight: "100%",
    background: "#00171F",
    overflowY: "scroll",
    paddingBottom: "15px"
  }
};
export class Messages extends Component {
  state = {
    messagesRef: firebase.database().ref("messages"),
    privateMessagesRef: firebase.database().ref("privateMessages"),
    usersRef: firebase.database().ref("users"),
    messages: [],
    messagesLoading: true,
    numUniqueUsers: "",
    searchResults: [],
    searchKey: "",
    isChannelStarred: false
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.channel && nextProps.user) {
      this.addListeners(nextProps.channel.id);
      this.addUserStarsListener(nextProps.channel.id, nextProps.user.uid);
    }
  }

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

  displayMessages = messages => {
    if (messages.length > 0) {
      return messages.map(message => (
        <Message
          key={message.timestamp}
          message={message}
          user={this.props.user}
        />
      ));
    }
  };

  render() {
    const { classes } = this.props;
    return (
      <MessagesWrapper>
        <MessagesHeader
          search={this.handleSearchChange}
          channelName={this.props.channel && this.props.channel.name}
          numUniqueUsers={this.state.numUniqueUsers}
          isPrivate={this.props.isPrivate}
          handleStar={this.handleStar}
          isChannelStarred={this.state.isChannelStarred}
        />
        <Paper className={classes.root}>
          {this.state.messages.length > 0 ? (
            this.state.searchKey ? (
              this.displayMessages(this.state.searchResults)
            ) : (
              this.displayMessages(this.state.messages)
            )
          ) : (
            <Paper style={{ color: "#fff", background: "#e6186d" }}>
              No messages yet!
            </Paper>
          )}
        </Paper>
        <MessageForm
          channel={this.props.channel}
          user={this.props.user}
          messagesRef={this.getMessagesRef()}
          isPrivate={this.props.isPrivate}
        />
      </MessagesWrapper>
    );
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
)(withStyles(styles)(Messages));
