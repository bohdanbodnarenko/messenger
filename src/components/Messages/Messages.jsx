import React, { Component, Fragment } from "react";
import { connect } from "react-redux";


import { Segment, CommentGroup, Label } from "semantic-ui-react";
import MessagesHeader from "./MessagesHeader/MessagesHeader";
import MessageForm from "./MessageForm/MessageForm";
import firebase from "../../firebase";
import Message from "./Message/Message";

export class Messages extends Component {
  state = {
    messagesRef: firebase.database().ref("messages"),
    privateMessagesRef: firebase.database().ref("privateMessages"),
    messages: [],
    messagesLoading: true,
    numUniqueUsers: "",
    searchResults: [],
    searchKey: "",
  };

    componentDidMount() {
      // if (this.props.channel ) {
    //   this.addListeners(this.props.channel.id);
      // }
    }

  componentWillReceiveProps(nextProps) {
    if (nextProps.channel && nextProps.user) {
      this.addListeners(nextProps.channel.id);
    }
  }

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
    return (
      <Fragment>
        <MessagesHeader
          search={this.handleSearchChange}
          channelName={this.displayChannelName(this.props.channel)}
          numUniqueUsers={this.state.numUniqueUsers}
          isPrivate={this.props.isPrivate}
        />
        <Segment>
          <CommentGroup className="messages">
            {this.state.messages.length > 0 ? (
              this.state.searchKey ? (
                this.displayMessages(this.state.searchResults)
              ) : (
                this.displayMessages(this.state.messages)
              )
            ) : (
              <Label
                style={{ color: "#fff", background: "#e6186d" }}
                size="big"
                content="No messages yet!"
              />
            )}
          </CommentGroup>
        </Segment>
        <MessageForm
          channel={this.props.channel}
          user={this.props.user}
          messagesRef={this.getMessagesRef()}
          isPrivate={this.props.isPrivate}
        />
      </Fragment>
    );
  }
}

const mapStateToProps = state => {
    return {
      currentChannel: state.channel.currentChannel,
    };
  };

export default connect(mapStateToProps)(Messages);
