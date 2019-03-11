import React, { Component } from "react";
import mime from "mime-types";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  InputBase,
  DialogActions,
  withStyles
} from "@material-ui/core";
import CustomButton from "./CustomButton";

const styles = {
  buttonSuccess: {
    color: "#02C39A",
    borderColor: "#02C39A"
  },
  buttonDanger: {
    color: "#D90429",
    borderColor: "#D90429"
  }
};

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
      const metadata = { contentType: mime.lookup(file.name) };
      this.props.uploadFile(file, metadata);
    }
  };

  isValid = filename => this.state.allowedTypes.includes(mime.lookup(filename));

  render() {
    return (
      <Dialog basic open={this.props.open} onClose={this.props.close}>
        <DialogTitle>Select an image File</DialogTitle>
        <DialogContent>
          <InputBase
            onChange={this.addFile()}
            label="File types: jpg, png"
            name="file"
            type="file"
          />
        </DialogContent>
        <DialogActions>
          <CustomButton click={this.sendFile} success>Send</CustomButton>
          <CustomButton click={this.props.close} cancel>Cancel</CustomButton>
        </DialogActions>
      </Dialog>
    );
  }
}

export default withStyles(styles)(FileModal);
