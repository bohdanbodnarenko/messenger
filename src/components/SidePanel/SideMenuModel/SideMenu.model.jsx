import React from "react";
import { List } from "@material-ui/core";

const SideMenu = props => {
  return (
    <div style={{ marginBottom: "12px" }}>
      <List>{props.children}</List>
    </div>
  );
};

export default SideMenu;
