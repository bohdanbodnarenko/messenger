import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";

import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import * as Icons from "@material-ui/icons/";

import styled from "styled-components";

import firebase from "../../../firebase";
import { IconButton, Avatar } from "@material-ui/core";
import ChangeAvatarModal from "../../../UI/ChangeAvatarModal";

const SideWrapper = styled.div`
  display: grid;
  grid-column: 100%;
  grid-row: 20% 50%;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
`;

const Header = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const AvatarWrapper = styled.div`
  display: flex;
  justify-content: center;
  color: #f0f3bd;
`;
export class UserPanel extends Component {
  state = {
    anchorEl: null,
    modal: false,
    previewImage: ""
  };
  handleSignOut = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        alert("Log out successful!");
        // this.props.history.push('/')
      });
  };

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  openModal = () => {
    this.setState({ modal: true });
  };

  closeModal = () => {
    this.setState({ modal: false });
  };

  handleClose = option => {
    switch (option) {
      case this.props.user.displayName:
        this.props.history.push(`/profile/${this.props.user.uid}`);
        break;
      case "Change Avatar":
        this.openModal();
        break;
      case "Log out":
        this.handleSignOut();
        break;

      default:
        break;
    }
    this.setState({ anchorEl: null });
  };

  render() {
    const options = [this.props.user.displayName, "Change Avatar", "Log out"];
    const { anchorEl } = this.state;
    const open = Boolean(anchorEl);
    return (
      <SideWrapper>
        <Link to="/">
          <Header>
            <Icons.BubbleChartRounded
              style={{
                width: 40,
                height: 40,
                color: this.props.color,
                marginRight: "10px"
              }}
            />
            <h1 style={{ color: this.props.color }}>Social Network</h1>
          </Header>
        </Link>
        <AvatarWrapper>
          <Link
            to={`/profile/${this.props.user.uid}`}
            style={{ marginRight: "15px" }}
          >
            <Avatar src={this.props.user.photoURL} />
          </Link>
          <span>
            <Link to={`/profile/${this.props.user.uid}`} className="link">
              {this.props.user.displayName}
            </Link>
            <IconButton
              aria-label="More"
              aria-owns={open ? "long-menu" : undefined}
              aria-haspopup="true"
              onClick={this.handleClick}
            >
              <MoreVertIcon className="link" />
            </IconButton>
          </span>
          <Menu
            id="long-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={this.handleClose}
            PaperProps={{
              style: {
                width: 200
              }
            }}
          >
            {options.map(option => (
              <MenuItem
                key={option}
                name={option}
                onClick={() => this.handleClose(option)}
              >
                {option}
              </MenuItem>
            ))}
          </Menu>
        </AvatarWrapper>
        <ChangeAvatarModal
          onFileChange={this.handleFileChange}
          open={this.state.modal}
          close={this.closeModal}
        />
      </SideWrapper>
    );
  }
}

export default withRouter(UserPanel);
