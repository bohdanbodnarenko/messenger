import React from "react";
import {
  Comment,
  CommentAvatar,
  CommentContent,
  CommentAuthor,
  CommentMetadata,
  CommentText,
  Image
} from "semantic-ui-react";
import moment from "moment";
import { Paper, withStyles } from "@material-ui/core";

const isOwnMessage = (message, user) => {
  return message.user.id === user.uid ? "message__self" : "";
};
const styles = {
  root: {
    padding: "2px 4px",
    display: "flex",
    alignItems: "center",
    width: "100%"
  },
  input: {
    marginLeft: 8,
    flex: 1
  },
  iconButton: {
    padding: 10
  },
  divider: {
    width: 1,
    height: 28,
    margin: 4
  }
};
const Message = props => {
  const isImage = message => {
    return (
      message.hasOwnProperty("image") && !message.hasOwnProperty("content")
    );
  };

  const { classes } = props;

  return (
    <Paper>
      <CommentAvatar src={props.message.user.avatar} />
      <CommentContent className={isOwnMessage(props.message, props.user)}>
        <CommentAuthor as="a">{props.message.user.name}</CommentAuthor>
        <CommentMetadata>
          {moment(props.message.timestamp).fromNow()}
        </CommentMetadata>
        {isImage(props.message) ? (
          <Image src={props.message.image} className="message_image" />
        ) : (
          <CommentText>{props.message.content}</CommentText>
        )}
      </CommentContent>
    </Paper>
  );
};

export default withStyles(styles)(Message);
