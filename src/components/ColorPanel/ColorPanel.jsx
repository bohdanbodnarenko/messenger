import React, { Component } from "react";
import { connect } from "react-redux";

import firebase from "../../firebase";
import * as Colors from "react-color";
import styled from "styled-components";
import {
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  Button,
  IconButton
} from "@material-ui/core";
import CustomButton from "../../UI/CustomButton";
import { AddCircleOutlineRounded, Refresh } from "@material-ui/icons";
import { setColors, setDefaultColors } from "../../store/actions";

const SideBar = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  background: #00171f;
`;

const ColorContainer = styled.div`
  position: relative;
  overflow: hidden;
  width: 35px;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 9px;
  color: #fff;
`;

const ColorSquare = styled.div`
  width: 35px;
  height: 35px;
  background: ${props => props.color};
`;

const ColorOverlay = styled.div`
  width: 85px;
  height: 35px;
  transform: rotate(225deg);
  background: ${props => props.color};
`;

export class ColorPanel extends Component {
  state = {
    userColors: [],
    user: this.props.user,
    modal: false,
    primary: "#22194d",
    secondary: "#5f094d",
    accent: "#00A8E8",
    usersRef: firebase.database().ref("users")
  };

  openModal = () => {
    this.setState({ modal: true });
  };

  setPrimary = ({ hex }) => {
    this.setState({ primary: hex });
  };

  setSecondary = ({ hex }) => {
    this.setState({ secondary: hex });
  };
  setAccent = ({ hex }) => {
    this.setState({ accent: hex });
  };

  closeModal = () => {
    this.setState({ modal: false });
  };

  handleSaveColors = () => {
    if (this.state.primary && this.state.secondary) {
      const { primary, secondary, accent } = this.state;
      this.state.usersRef
        .child(`${this.state.user.uid}/colors`)
        .push()
        .update({
          primary,
          secondary,
          accent
        })
        .then(() => {
          this.closeModal();
        })
        .catch(err => console.error(err));
    }
  };

  componentDidMount = () => {
    if (this.state.user) {
      this.addListener(this.state.user.uid);
    }
  };

  addListener = userId => {
    let userColors = [];
    this.state.usersRef.child(`${userId}/colors`).on("child_added", snap => {
      userColors.unshift(snap.val());
      this.setState({ userColors });
    });
  };

  displayUserColors = colors =>
    colors.length > 0 &&
    colors.map((color, index) => (
      <ColorContainer
        onClick={this.setColors(color.primary, color.secondary, color.accent)}
        key={index}
      >
        <ColorSquare color={color.primary}>
          <ColorOverlay color={color.secondary} />
        </ColorSquare>
      </ColorContainer>
    ));

  setColors = (primary, secondary, accent) => () => {
    this.props.setColors(primary, secondary, accent);
  };

  render() {
    const { modal, primary, secondary, accent, userColors } = this.state;
    return (
      <SideBar>
        <Button
          onClick={this.openModal}
          style={{ background: "#81d2e0", margin: "15px 0" }}
        >
          <AddCircleOutlineRounded />
        </Button>
        <IconButton
          style={{ color: "#fff" }}
          onClick={this.props.setDefaultColor}
        >
          <Refresh style={{ margin: "auto" }} />
        </IconButton>

        {this.displayUserColors(userColors)}
        <Dialog onClose={this.closeModal} open={modal}>
          <DialogTitle>Choose Colors</DialogTitle>
          <DialogContent>
            <h2>Primary Color</h2>
            <Colors.BlockPicker
              color={primary}
              onChange={this.setPrimary}
              width="350"
            />
            <h2>Secondary Color</h2>
            <Colors.BlockPicker
              color={secondary}
              onChange={this.setSecondary}
              width="350"
            />
            <h2>Accent Color</h2>
            <Colors.BlockPicker
              color={accent}
              onChange={this.setAccent}
              width="350"
            />
          </DialogContent>
          <DialogActions>
            <CustomButton success click={this.handleSaveColors}>
              Save Colors
            </CustomButton>
            <CustomButton cancel click={this.closeModal}>
              Close
            </CustomButton>
          </DialogActions>
        </Dialog>
      </SideBar>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setColors: (primary, secondary, accent) =>
      dispatch(setColors(primary, secondary, accent)),
    setDefaultColor: () => dispatch(setDefaultColors())
  };
};

export default connect(
  null,
  mapDispatchToProps
)(ColorPanel);
