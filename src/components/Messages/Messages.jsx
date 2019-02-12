import React, { Component, Fragment } from "react";
import { Segment, CommentGroup } from "semantic-ui-react";
import MessagesHeader from "./MessagesHeader/MessagesHeader";
import MessageForm from "./MessageForm/MessageForm";
import firebase from "../../firebase";
import Message from "./Message/Message";

export class Messages extends Component {
  state = {
    messaegsRef: firebase.database().ref("messages"),
    messages: [],
    messagesLoading: true
  };

  componentDidMount() {
    if (this.props.channel && this.props.user) {
      console.log("yeah");
      this.addListeners(this.props.channel.id);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.channel && nextProps.user) {
      this.addListeners(nextProps.channel.id);
    }
  }

  addListeners = channedId => {
    this.addMessageListener(channedId);
  };

  addMessageListener = channedId => {
    let loadedMessages = [];
    this.state.messaegsRef.child(channedId).on("child_added", snap => {
      loadedMessages.push(snap.val());
      this.setState({
        messages: loadedMessages,
        messagesLoading: false
      });
    });
  };

  displayMessages = messages => {
    if (messages.length > 0) {
      return messages.map(message => (
        <Message
          key={message.timestamp + message.content}
          message={message}
          user={this.props.user}
        />
      ));
    }
  };

  render() {
    return (
      <Fragment>
        <MessagesHeader />
        <Segment>
          <CommentGroup className='messages'>
            {this.displayMessages(this.state.messages)}
          </CommentGroup>
        </Segment>
        <MessageForm
          channel={this.props.channel}
          user={this.props.user}
          messagesRef={this.state.messaegsRef}
        />
      </Fragment>
    );
  }
}

export default Messages;
