import React, { Component } from "react";
import { Segment, Header, Icon, Input } from "semantic-ui-react";
import HeaderSubHeader from "semantic-ui-react/dist/commonjs/elements/Header/HeaderSubheader";

export class MessagesHeader extends Component {
  render() {
    return (
      <Segment clearing>
        <Header fluid="true" as="h2" floated="left" style={{ marginBottom: 0 }}>
          <span>
            # {this.props.channelName}
            <Icon name="star outline" color="black" />
          </span>
          <HeaderSubHeader>{this.props.numUniqueUsers}</HeaderSubHeader>
        </Header>
        <Header floated="right">
          <Input
            onChange={this.props.search()}
            size="mini"
            icon="search"
            name="searchItem"
            placeholder="Search Messages"
          />
        </Header>
      </Segment>
    );
  }
}

export default MessagesHeader;
