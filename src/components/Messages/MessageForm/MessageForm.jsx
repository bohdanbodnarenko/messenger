import React, { Component } from "react";
import { Segment, Input, Button, ButtonGroup } from "semantic-ui-react";
import firebase from "../../../firebase";
import FileModal from "../../../UI/FileModal";
import uuidv4 from "uuid/v4";
import ProgressBar from "../../../UI/ProgressBar";

export class MessageForm extends Component {
  state = {
    storageRef: firebase.storage().ref(),
    uploadState: "",
    uploadTask: null,
    percentUploaded: 0,
    message: "",
    loading: false,
    error: "",
    isModalOpen: false
  };

  uploadFile = (file, metadata) => {
    const pathToUpload = this.props.channel.id;
    const ref = this.props.messagesRef;
    const filePath = `chat/public/${uuidv4()}.jpeg`;

    this.setState(
      {
        uploadState: "uploading",
        uploadTask: this.state.storageRef.child(filePath).put(file, metadata)
      },
      () => {
        this.state.uploadTask.on(
          "state_changed",
          snap => {
            const percentUploaded = Math.round(
              (snap.bytesTransferred / snap.totalBytes) * 100
            );
            console.log(percentUploaded);
            this.setState({ percentUploaded });
          },
          err => {
            console.error(err);
            this.setState({
              error: err.message,
              uploadState: "error",
              uploadTask: null
            });
          },
          () => {
            this.state.uploadTask.snapshot.ref
              .getDownloadURL()
              .then(url => {
                this.sendFileMessage(url, ref, pathToUpload);
              })
              .catch(err => {
                console.error(err);
                this.setState({
                  error: err.message,
                  uploadState: "error",
                  uploadTask: null
                });
              });
          }
        );
      }
    );
  };

  sendFileMessage = (url, ref, pathToUpload) => {
    ref
      .child(pathToUpload)
      .push()
      .set(this.createMessage(url))
      .then(() => {
        this.setState({ uploadState: "done" });
        // this.closeModal();
      })
      .catch(err => {
        console.error(err);
        this.setState({
          error: err.message
        });
      });
  };

  openModal = () => {
    this.setState({ isModalOpen: true });
  };
  closeModal = () => {
    this.setState({ isModalOpen: false });
  };

  handleChange = () => event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  createMessage = (fileUrl = null) => {
    let message = {
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      user: {
        id: this.props.user.uid,
        name: this.props.user.displayName,
        avatar: this.props.user.photoURL
      }
    };
    if (fileUrl !== null) {
      message["image"] = fileUrl;
    } else {
      message["content"] = this.state.message;
    }
    return message;
  };

  sendMessage = () => {
    const { messagesRef } = this.props;
    if (this.state.message) {
      messagesRef
        .child(this.props.channel.id)
        .push()
        .set(this.createMessage())
        .then(() => {
          this.setState({ loading: false, message: "", error: "" });
        })
        .catch(err => {
          console.error(err);
          this.setState({
            loading: false,
            error: err.message
          });
        });
    } else {
      this.setState({
        error: "Add a message"
      });
    }
  };

  handleKeyPress = () => event => {
    if (event.key==='Enter') {
        this.sendMessage()
    }
  }

  render() {
    const { message } = this.state;
    return (
      <Segment>
        <Input
          fluid
          value={message}
          name="message"
          style={{ marginBottom: "0.7em" }}
          label={<Button icon="add" />}
          labelPosition="right"
          onChange={this.handleChange()}
          className={this.state.error.includes("message") ? "error" : ""}
          placeholder="Write your message"
          onKeyPress={this.handleKeyPress()}
        />
        <ProgressBar
          uploadState={this.state.uploadState}
          percentUploaded={this.state.percentUploaded}
        />
        <ButtonGroup icon widths="2">
          <Button
            className={this.state.loading ? "loading" : ""}
            onClick={this.sendMessage}
            color="orange"
            content="Add Reply"
            labelPosition="left"
            icon="edit"
          />
          <Button
            color="teal"
            disabled={this.state.uploadState==='uploading'}
            onClick={this.openModal}
            content="Upload Media"
            labelPosition="right"
            icon="cloud upload"
          />
        </ButtonGroup>
        <FileModal
          uploadFile={this.uploadFile}
          open={this.state.isModalOpen}
          close={this.closeModal}
        />
      </Segment>
    );
  }
}

export default MessageForm;
