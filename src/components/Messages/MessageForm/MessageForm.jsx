import React, { Component } from "react";
import firebase from "../../../firebase";
import FileModal from "../../../UI/FileModal";
import uuidv4 from "uuid/v4";
import ProgressBar from "../../../UI/ProgressBar";
import styled from "styled-components";
import {
  InputBase,
  withStyles,
  Divider,
  Paper,
  IconButton
} from "@material-ui/core";
import * as Icons from "@material-ui/icons";

const Wrapper = styled.div`
  display: flex;
  background: #00171f;
  flex-direction: column;
`;

const styles = {
  root: {
    padding: "2px 4px",
    display: "flex",
    alignItems: "center",
    width: "100%"
  },
  input: {
    marginLeft: 8,
    flex: 1
  },
  iconButton: {
    padding: 10
  },
  divider: {
    width: 1,
    height: 28,
    margin: 4
  }
};
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

  getPath = () => {
    if (this.props.isPrivate) {
      return `chat/private-${this.state.channel.id}`;
    } else {
      return "chat/public";
    }
  };

  uploadFile = (file, metadata) => {
    const pathToUpload = this.props.channel.id;
    const ref = this.props.messagesRef;
    const filePath = `${this.getPath()}/${uuidv4()}.jpeg`;

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
    if (event.key === "Enter") {
      this.sendMessage();
    }
  };

  render() {
    const { message } = this.state;
    const { classes } = this.props;
    return (
      <Wrapper>
        <Paper className={classes.root} elevation={1}>
          <IconButton onClick={this.openModal} className={classes.iconButton}>
            <Icons.InsertLinkRounded />
          </IconButton>
          <Divider className={classes.divider} />
          <InputBase
            autoComplete={false}
            onKeyPress={this.handleKeyPress()}
            className={classes.input}
            placeholder="Write your message"
            onChange={this.handleChange()}
            name="message"
            value={message}
          />
          <Divider className={classes.divider} />
          <IconButton className={classes.iconButton}>
            <Icons.TagFacesRounded />
          </IconButton>
          <IconButton onClick={this.sendMessage} className={classes.iconButton}>
            <Icons.SendRounded />
          </IconButton>
        </Paper>
        <ProgressBar
          uploadState={this.state.uploadState}
          percentUploaded={this.state.percentUploaded}
        />
        <FileModal
          uploadFile={this.uploadFile}
          open={this.state.isModalOpen}
          close={this.closeModal}
        />
      </Wrapper>
    );
  }
}

export default withStyles(styles)(MessageForm);
