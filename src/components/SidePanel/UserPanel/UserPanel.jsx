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
  DropdownItem
} from "semantic-ui-react";
import firebase from "../../../firebase";

export class UserPanel extends Component {
  dropdownOprtions = [
    {
      key: "user",
      text: (
        <span>
          Signed in as <strong>{this.props.user.displayName}</strong>
        </span>
      ),
      disabled: true
    },
    {
      key: "avatar",
      text: <span>Change Avatar</span>
    },
    {
      key: "signOut",
      text: <span onClick={this.handleSignOut}>Sign Out</span>
    }
  ];

  handleSignOut = () => {
    console.log("object");
    firebase
      .auth()
      .signOut()
      .then(() => {
        alert("Log out successful!");
      });
  };

  render() {
    return (
      <Grid style={{ background: "#5c3a58" }}>
        <GridColumn>
          <GridRow style={{ padding: "1.2em", margin: "0" }}>
            <Header inverted floated="left" as="h2">
              <Icon name="code" />
              <HeaderContent>DevChat</HeaderContent>
            </Header>
            <Header style={{ padding: "0.25em" }} as="h4" inverted>
              <Dropdown
                trigger={
                  <span>
                    <Image
                      src={this.props.user.photoURL}
                      spaced="right"
                      avatar
                    />
                    {this.props.user.displayName}
                  </span>
                }
                options={this.dropdownOprtions}
              />
            </Header>
          </GridRow>
        </GridColumn>
      </Grid>
    );
  }
}

export default UserPanel;
