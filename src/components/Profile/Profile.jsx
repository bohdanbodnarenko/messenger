import React, { Component } from "react";

import styled from "styled-components";

const Wrapper = styled.div`
  position: fixed;
  width: 100vw;
  height: 100vh;
  background: red;
`;

export class Profile extends Component {
  render() {
    return <Wrapper>Profile</Wrapper>;
  }
}

export default Profile;
