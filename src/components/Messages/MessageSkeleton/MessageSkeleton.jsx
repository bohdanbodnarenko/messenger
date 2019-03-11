import React from "react";
import "./styles.css";

const MessageSkeleton = props => {
  return (
    <div className="skeleton">
      <div className="skeleton-avatar" />
      <div className="skeleton-author" />
      <div className="skeleton-details" />
    </div>
  );
};

export default MessageSkeleton;
