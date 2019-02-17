import React, { Component } from "react";
import {
  Segment,
  Header,
  Accordion,
  AccordionTitle,
  Icon,
  AccordionContent,
  Image,
  List,
  ListItem,
  ListContent,
  ListHeader,
  ListDescription
} from "semantic-ui-react";

export class MetaPanel extends Component {
  state = {
    activeIndex: 0
  };

  displayTopPosters = userPosts => {
    return Object.entries(userPosts)
      .sort((a, b) => b.count - a.count)
      .map(([key, val], i) => (
        <ListItem key={i}>
          <Image avatar src={val.avatar} />
          <ListContent>
            <ListHeader as="a">{key}</ListHeader>
            <ListDescription>{val.count} posts</ListDescription>
          </ListContent>
        </ListItem>
      ));
  };

  setActiveIndex = (event, titleProps) => {
    const { imdex } = titleProps;
    const { activeIndex } = this.state;
    const newIndex = activeIndex === imdex ? -1 : imdex;
    this.setState({ activeIndex: newIndex });
  };

  render() {
    const { activeIndex } = this.state;

    if (this.props.isPrivate) return null;

    return (
      <Segment loading={!this.props.channel}>
        <Header as="h3" attached="top">
          About {this.props.channel && this.props.channel.name}
        </Header>
        <Accordion styled attached="true">
          <AccordionTitle
            imdex={0}
            active={activeIndex === 0}
            onClick={this.setActiveIndex}
          >
            <Icon name="dropdown" />
            <Icon name="info circle" />
            Channel Details
          </AccordionTitle>
          <AccordionContent active={activeIndex === 0}>
            {this.props.channel && this.props.channel.details}
          </AccordionContent>
          <AccordionTitle
            imdex={1}
            active={activeIndex === 1}
            onClick={this.setActiveIndex}
          >
            <Icon name="dropdown" />
            <Icon name="user circle" />
            Top Posters
          </AccordionTitle>
          <AccordionContent active={activeIndex === 1}>
            <List>
              {this.props.userPosts &&
                this.displayTopPosters(this.props.userPosts)}
            </List>
          </AccordionContent>
          <AccordionTitle
            imdex={2}
            active={activeIndex === 2}
            onClick={this.setActiveIndex}
          >
            <Icon name="dropdown" />
            <Icon name="pencil alternate" />
            Created By
          </AccordionTitle>
          <AccordionContent active={activeIndex === 2}>
            <Header as="h3">
              <Image
                avatar
                src={this.props.channel && this.props.channel.createdBy.avatar}
              />
              <span>
                {"  "}
                {this.props.channel && this.props.channel.createdBy.name}
              </span>
            </Header>
          </AccordionContent>
        </Accordion>
      </Segment>
    );
  }
}

export default MetaPanel;
