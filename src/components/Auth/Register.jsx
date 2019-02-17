import React, { Component } from "react";
import { Link } from "react-router-dom";

import md5 from "md5";
import firebase from "../../firebase";
import {
  GridColumn,
  Header,
  Segment,
  FormInput,
  Icon,
  Button,
  Form,
  Message
} from "semantic-ui-react";

export class Register extends Component {
  state = {
    username: "",
    email: "",
    password: "",
    passwordConfirm: "",
    error: "",
    loading: false,
    usersRef: firebase.database().ref("users")
  };

  handleChange = () => event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  isFormValid = () => {
    if (this.isFormEmpty(this.state)) {
      this.setState({ error: "Fill in all fields" });
      return false;
    } else if (!this.isPasswordValid(this.state)) {
      return false;
    } else {
      return true;
    }
  };

  isFormEmpty = ({ username, email, password, passwordConfirm }) => {
    return (
      !username.length ||
      !email.length ||
      !password.length ||
      !passwordConfirm.length
    );
  };

  isPasswordValid = ({ password, passwordConfirm }) => {
    if (password.length < 6 || passwordConfirm.length < 6) {
      this.setState({ error: "Password should be 6 chars length minimum" });
      return false;
    } else if (password !== passwordConfirm) {
      this.setState({ error: "Passwords are not the same" });
      return false;
    } else {
      return true;
    }
  };

  saveUser = createdUser => {
    return this.state.usersRef.child(createdUser.user.uid).set({
      name: createdUser.user.displayName,
      avatar: createdUser.user.photoURL
    });
  };

  handleSubmit = () => event => {
    event.preventDefault();
    if (this.isFormValid()) {
      this.setState({ errors: [], loading: true });
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then(createdUser => {
          console.log(createdUser);
          createdUser.user
            .updateProfile({
              displayName: this.state.username,
              photoURL: `http://gravatar.com/avatar/${md5(
                createdUser.user.email
              )}?d=identicon`
            })
            .then(() => {
              this.saveUser(createdUser).then(() => {
                console.log("user saved");
                this.setState({ loading: false });
              });
            })
            .catch(err => {
              this.setState({ error: err.message, loading: false });
            });
        })
        .catch(error => {
          console.error(error);
          this.setState({ error: error.message, loading: false });
        });
    }
  };

  render() {
    const {
      username,
      email,
      password,
      passwordConfirm,
      error,
      loading
    } = this.state;
    return (
      // <Grid className="app" textAlign="center" verticalAlign="middle">
        <GridColumn style={{ maxWidth: 550 }}>
          <Header as="h1" icon color="orange" textAlign="center">
            <Icon name="puzzle piece" color="orange" />
            Register to Social Network
          </Header>
          <Form onSubmit={this.handleSubmit()}>
            <Segment stacked>
              <FormInput
                fluid
                name="username"
                icon="user"
                iconPosition="left"
                placeholder="Username"
                type="text"
                value={username}
                className={
                  this.state.error.toLowerCase().includes("name") ? "error" : ""
                }
                onChange={this.handleChange()}
              />
              <FormInput
                fluid
                name="email"
                icon="mail"
                iconPosition="left"
                placeholder="Email"
                type="email"
                value={email}
                className={
                  this.state.error.toLowerCase().includes("email")
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
              <FormInput
                fluid
                name="passwordConfirm"
                icon="repeat"
                iconPosition="left"
                placeholder="Confirm Password"
                type="password"
                value={passwordConfirm}
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
                color="orange"
                fluid
                size="large"
              >
                Register
              </Button>
            </Segment>
          </Form>
          <Message>
            Already a user? <Link to="/login">Login</Link>
          </Message>
          {this.state.error.length > 0 ? (
            <Message error>
              <h3>Error</h3>
              <p>{error}</p>
            </Message>
          ) : null}
        </GridColumn>
      // </Grid>
    );
  }
}

export default Register;
