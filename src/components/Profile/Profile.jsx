import React, { Component } from 'react'
import { Grid, Segment } from 'semantic-ui-react';

export class Profile extends Component {
  render() {
      console.log(this.props)
    return (
      <Grid color='orange'>
        <Segment color='red'></Segment>
      </Grid>
    )
  }
}

export default Profile
