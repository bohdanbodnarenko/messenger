import React, { Component } from "react";
import { Sidebar, Menu, Divider, Button } from "semantic-ui-react";

import styled from "styled-components";

const SideBar = styled.div`
  /* width: 3vw; */
  /* height: 100vh; */
  /* position: absolute;
  left: 0;
  top: 0; */
  /* z-index: 1000; */
  background: #3c4859;
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
