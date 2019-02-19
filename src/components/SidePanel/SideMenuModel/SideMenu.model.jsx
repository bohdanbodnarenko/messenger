import React from "react";
import {
  ExpansionPanel,
  ExpansionPanelSummary,
  List,
  ExpansionPanelDetails
} from "@material-ui/core";
import * as Icons from "@material-ui/icons";

const SideMenu = props => {
  const { open } = props;
  return (
    <div>
      <ExpansionPanel
        style={{
          backgroundColor: "#003459",
          color: "#FFFFFF",
          boxShadow: "none",
          borderBottom: open ? "2px #FFFFFF solid" : "none",
          marginBottom: "12px"
        }}
        expanded={open}
      >
        <ExpansionPanelSummary
          style={{ height: "15%" }}
          onClick={props.toggleOpen}
          expandIcon={<Icons.ExpandMore style={{ color: "#FFFFFF" }} />}
        >
          <div className="centered">
            {props.icon}
            {props.name} ({props.length})
          </div>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails
          style={{ maxHeight: "300px", overflowY: "scroll", padding: "0" }}
        >
          <List>{props.children}</List>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </div>
  );
};

export default SideMenu;
