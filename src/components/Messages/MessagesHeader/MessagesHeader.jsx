import React, { Component } from "react";

import { Segment, Header, Icon, Input } from "semantic-ui-react";
import {
  Paper,
  TextField,
  createMuiTheme,
  MuiThemeProvider,
  withStyles
} from "@material-ui/core";
import styled from "styled-components";
import * as Icons from "@material-ui/icons";
import { green } from "@material-ui/core/colors";

const NameWrapper = styled.div`
  font-size: 2.1em;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: #fff;
  font-weight: 500;
`;

const Wrapper = styled.div`
  padding: 15px;
  background: #00171f;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
// const theme = createMuiTheme({
//   palette: {
//     primary: green
//   },
//   multilineColor:{
//     color:green
//   }
// });
const styles = {
  input: {
    color: "#fff"
  }
};
export class MessagesHeader extends Component {
  render() {
    console.log(this.props)
    const { classes } = this.props;
    return (
      <Wrapper>
        <NameWrapper style={{ marginBottom: 0 }}>
          <div className="centered">
            {this.props.channelName}
            {this.props.isPrivate ? (
              <Icons.Person style={{ color: "#fff" }} />
            ) : this.props.isChannelStarred ? (
              <Icons.StarRounded
                onClick={this.props.handleStar}
                style={{
                  cursor: "pointer",
                  color: "#FFD166"
                }}
              />
            ) : (
              <Icons.StarBorderRounded
                onClick={this.props.handleStar}
                style={{
                  cursor: "pointer",
                  color: "#fff"
                }}
              />
            )}
          </div>
          <span style={{ fontSize: ".6em", marginTop: "15px" }}>
            {this.props.numUniqueUsers}
          </span>
        </NameWrapper>
        {/* <MuiThemeProvider theme={theme}> */}
        <TextField
          onChange={this.props.search()}
          icon="search"
          variant="outlined"
          name="searchItem"
          placeholder="Search Messages"
          InputProps={{
            className: classes.input
          }}
        />
        {/* </MuiThemeProvider> */}
      </Wrapper>
    );
  }
}

export default withStyles(styles)(MessagesHeader);
