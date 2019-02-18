import React, { Component } from "react";
import { Link } from "react-router-dom";

import { Dropdown, Image, HeaderSubheader } from "semantic-ui-react";

import * as Icons from "@material-ui/icons/";

import styled from "styled-components";

import firebase from "../../../firebase";

const SideWrapper = styled.div`
  display: grid;
  grid-column: 100%;
  grid-row: 20% 50%;
  justify-content: center;
  align-items: center;
`;

const Header = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;
export class UserPanel extends Component {
  dropdownOptions = [
    {
      key: "user",
      value: "user",
      text: (
        <span>
          Signed in as <strong>{this.props.user.displayName}</strong>
        </span>
      ),
      disabled: true
    },
    {
      key: "avatar",
      value: "avatar",
      text: <span>Change Avatar</span>
    },
    {
      key: "signOut",
      value: "signOut",
      text: <span onClick={this.handleSignOut}>Sign Out</span>
    }
  ];
  handleSignOut = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        alert("Log out successful!");
        // this.props.history.push('/')
      });
  };

  handleChange = () => (event, data) => {
    switch (data.value) {
      case "signOut":
        this.handleSignOut();
        break;
      default:
        break;
    }
  };

  render() {
    return (
      <SideWrapper>
        <Link to="/">
          <Header>
            <Icons.ScatterPlot
              style={{
                width: 40,
                height: 40,
                color: "#0FACF3",
                marginRight: "10px"
              }}
            />
            <h1 style={{ color: "#36F1CD" }}>Social Network</h1>
          </Header>
        </Link>
        <Header style={{ padding: "0.25em" }} as="h4" inverted>
          <Dropdown
            onChange={this.handleChange()}
            trigger={
              <span>
                <Image
                  size="mini"
                  src={this.props.user.photoURL}
                  spaced="right"
                  avatar
                />
                {this.props.user.displayName}
              </span>
            }
            options={this.dropdownOptions}
          />
          <HeaderSubheader />
        </Header>
      </SideWrapper>
    );
  }
}

export default UserPanel;
