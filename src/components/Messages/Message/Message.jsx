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

const isOwnMessage = (message, user) => {
  return message.user.id === user.uid ? "message__self" : "";
};

const Message = props => {
  const isImage = message => {
    return (
      message.hasOwnProperty("image") && !message.hasOwnProperty("content")
    );
  };

  return (
    <Comment>
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
    </Comment>
  );
};

export default Message;
