import React, { Component } from "react";
import {
  Modal,
  ModalHeader,
  ModalContent,
  Input,
  ModalActions,
  Button,
  Icon
} from "semantic-ui-react";
import mime from "mime-types";
import { Dialog, DialogTitle } from "@material-ui/core";

class FileModal extends Component {
  state = {
    file: null,
    allowedTypes: ["image/jpeg", "image/png"]
  };

  addFile = () => event => {
    if (event.target.files[0]) {
      this.setState({ file: event.target.files[0] });
    }
  };

  sendFile = () => {
    const { file } = this.state;
    if (this.isValid(file.name)) {
        this.props.close();
        const metadata = {contentType:mime.lookup(file.name)}
        this.props.uploadFile(file,metadata)
    }
  };

  isValid = filename => this.state.allowedTypes.includes(mime.lookup(filename));

  render() {
    return (
      <Dialog basic open={this.props.open} onClose={this.props.close}>
        <DialogTitle>Select an image File</DialogTitle>
        <ModalContent>
          <Input
            onChange={this.addFile()}
            fluid
            label="File types: jpg, png"
            name="file"
            type="file"
          />
        </ModalContent>
        <ModalActions>
          <Button color="green" onClick={this.sendFile} inverted>
            <Icon name="checkmark" /> Send
          </Button>
          <Button color="red" inverted onClick={this.props.close}>
            <Icon name="remove" /> Close
          </Button>
        </ModalActions>
      </Dialog>
    );
  }
}

export default FileModal;
