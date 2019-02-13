import React, { Component } from "react";
import {
  Grid,
  GridColumn,
  GridRow,
  Header,
  HeaderContent,
  Icon,
  Dropdown,
  Image,
  HeaderSubheader,
} from "semantic-ui-react";
import firebase from "../../../firebase";

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
      <Grid style={{ background: "#5c3a58" }}>
        <GridColumn>
          <GridRow style={{ padding: "1.2em", margin: "0" }}>
            <Header inverted floated="left" as="h2">
              <Icon name="globe" />
              <HeaderContent>Social Network</HeaderContent>
            </Header>
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
          </GridRow>
        </GridColumn>
      </Grid>
    );
  }
}

export default UserPanel;
