import React, { Component } from "react";
import { Link } from "react-router-dom";

import firebase from "../../firebase";
import {
  Grid,
  GridColumn,
  Header,
  Segment,
  FormInput,
  Icon,
  Button,
  Form,
  Message
} from "semantic-ui-react";
export class Login extends Component {
  state = {
    username: "",
    email: "",
    password: "",
    passwordConfirm: "",
    error: "",
    loading: false
  };

  handleChange = () => event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  isFormValid = ({ email, password }) => email && password;

  handleSubmit = () => event => {
    event.preventDefault();
    if (this.isFormValid(this.state)) {
      this.setState({ errors: [], loading: true });
      firebase
        .auth()
        .signInWithEmailAndPassword(this.state.email, this.state.password)
        .then(signedInUser => {
        })
        .catch(err => {
          console.error(err);
          this.setState({ error: err.message, loading: false });
        });
    }
  };

  render() {
    const { email, password, error, loading } = this.state;
    return (
      <Grid className="app" textAlign="center" verticalAlign="middle">
        <GridColumn style={{ maxWidth: 550 }}>
          <Header as="h1" icon color="violet" textAlign="center">
            <Icon name="puzzle piece" color="violet" />
            Login to Slack Clone
          </Header>
          <Form onSubmit={this.handleSubmit()}>
            <Segment stacked>
              <FormInput
                fluid
                name="email"
                icon="mail"
                iconPosition="left"
                placeholder="Email"
                type="email"
                value={email}
                className={
                  this.state.error.toLowerCase().includes("user")
                    ? "error"
                    : ""
                }
                onChange={this.handleChange()}
              />
              <FormInput
                fluid
                name="password"
                icon="lock"
                iconPosition="left"
                placeholder="Password"
                type="password"
                value={password}
                className={
                  this.state.error.toLowerCase().includes("password")
                    ? "error"
                    : ""
                }
                onChange={this.handleChange()}
              />
              <Button
                disabled={loading}
                className={loading ? "loading" : ""}
                color="violet"
                fluid
                size="large"
              >
                Submit
              </Button>
            </Segment>
          </Form>
          <Message>
            Don't have an account? <Link to="/register">Register</Link>
          </Message>
          {this.state.error.length > 0 ? (
            <Message error>
              <h3>Error</h3>
              <p>{error}</p>
            </Message>
          ) : null}
        </GridColumn>
      </Grid>
    );
  }
}

export default Login;
