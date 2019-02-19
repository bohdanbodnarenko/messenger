import React, { Component } from "react";
import { Divider, Button } from "semantic-ui-react";

import styled from "styled-components";

const SideBar = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  background: #00171f;
`;
export class ColorPanel extends Component {
  render() {
    return (
      <SideBar>
        <Divider />
        <Button icon="add" size="small" style={{ background: "#81d2e0" }} />
      </SideBar>
    );
  }
}

export default ColorPanel;
