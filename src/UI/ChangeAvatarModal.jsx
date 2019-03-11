import React, { Component } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Input,
  DialogActions
} from "@material-ui/core";
import * as Icons from "@material-ui/icons";

import CustomButton from "./CustomButton";
import AvatarEditor from "react-avatar-editor";
import firebase from "../firebase";

class ChangeAvatarModal extends Component {
  state = {
    previewImage: "",
    croppedImage: "",
    blob: "",
    storageRef: firebase.storage().ref(),
    userRef: firebase.auth().currentUser,
    usersRef: firebase.database().ref("users"),
    metadata: {
      contentType: "image/jpeg"
    },
    uploadedCroppedImage: ""
  };

  handleFileChange = event => {
    const file = event.target.files[0];
    const reader = new FileReader();

    if (file) {
      reader.readAsDataURL(file);
      reader.addEventListener("load", () => {
        this.setState({ previewImage: reader.result });
      });
    }
  };

  handleCropImage = () => {
    if (this.avatarEditor) {
      this.avatarEditor.getImageScaledToCanvas().toBlob(blob => {
        let imageUrl = URL.createObjectURL(blob);
        this.setState({
          croppedImage: imageUrl,
          blob: blob
        });
      });
    }
  };

  uploadCroppImage = () => {
    const { storageRef, userRef, blob, metadata } = this.state;

    storageRef
      .child(`avatars/user-${userRef.uid}`)
      .put(blob, metadata)
      .then(snap => {
        snap.ref.getDownloadURL().then(downloadUrl => {
          this.setState({ uploadedCroppedImage: downloadUrl }, () =>
            this.changeAvatar()
          );
        });
      });
  };

  changeAvatar = () => {
    this.state.userRef
      .updateProfile({
        photoURL: this.state.uploadedCroppedImage
      })
      .then(() => console.log("Photo updated!"))
      .catch(err => console.error(err));

    this.state.usersRef
      .child(this.state.userRef.uid)
      .update({ avatar: this.state.uploadedCroppedImage })
      .then(() => console.log("Avatar updated!"))
      .catch(err => console.error(err));
  };

  render() {
    const { previewImage, blob, croppedImage } = this.state;
    return (
      <Dialog open={this.props.open} onClose={this.props.close}>
        <DialogTitle>Change Avatar</DialogTitle>
        <DialogContent>
          <Input type="file" onChange={this.handleFileChange} />
          {previewImage && (
            <AvatarEditor
              ref={node => (this.avatarEditor = node)}
              image={previewImage}
              width={150}
              height={150}
              border={10}
              borderRadius={100}
              scale={1.2}
            />
          )}
          {croppedImage && (
            <div className="centered">
              <img
                style={{
                  borderRadius: "50%",
                  margin: "3.5em auto",
                  width: "160px",
                  height: "160px"
                }}
                src={croppedImage}
              />
            </div>
          )}
        </DialogContent>
        <DialogActions>
          {croppedImage && (
            <CustomButton click={this.uploadCroppImage} success>
              Set Avatar
            </CustomButton>
          )}
          <CustomButton
            click={this.handleCropImage}
            icon={<Icons.AspectRatioRounded />}
            success
          >
            Preview
          </CustomButton>
          <CustomButton click={this.props.close} cancel>
            Cancel
          </CustomButton>
        </DialogActions>
      </Dialog>
    );
  }
}
export default ChangeAvatarModal;
