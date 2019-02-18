import React, { Component } from "react";
import { Link } from "react-router-dom";

import styled from "styled-components";
import md5 from "md5";
import firebase from "../../firebase";
import {
  Typography,
  TextField,
  SnackbarContent,
  Button
} from "@material-ui/core";
import * as Icons from "@material-ui/icons/";

const InputWrapper = styled.div`
  width: 60%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  @media (max-width: 700px) {
    width: 95%;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  height: 80%;
  align-items: center;
`;

const AuthWrapper = styled.div`
  margin: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60vw;
  padding: 12px;
  border: #0facf3 1.5px solid;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 65vh;
  color: #342e37;
  text-align: center;
  @media (max-width: 700px) {
    width: 90vw;
  }
`;
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
      <AuthWrapper>
        <Typography
          style={{ marginTop: "20px", fontWeight: "bold" }}
          component="h2"
          variant="display2"
          align="center"
          gutterBottom
        >
          Register to <span style={{ color: "#3C4859" }}>Social Network</span>{" "}
        </Typography>
        <Form onSubmit={this.handleSubmit()}>
          <InputWrapper>
            <Icons.Person />
            <TextField
              style={{ width: "93.5%", fontSize: "1.2em" }}
              name="username"
              variant="outlined"
              label="Username"
              type="text"
              value={username}
              error={this.state.error.toLowerCase().includes("name")}
              onChange={this.handleChange()}
            />
          </InputWrapper>
          <InputWrapper>
            <Icons.Mail />
            <TextField
              style={{ width: "93.5%", fontSize: "1.2em" }}
              name="email"
              variant="outlined"
              label="Email"
              type="email"
              value={email}
              error={this.state.error.toLowerCase().includes("email")}
              onChange={this.handleChange()}
            />
          </InputWrapper>

          <InputWrapper>
            <Icons.Lock />
            <TextField
              style={{ width: "93.5%", fontSize: "1.2em" }}
              name="password"
              variant="outlined"
              label="Password"
              type="password"
              value={password}
              error={this.state.error.toLowerCase().includes("password")}
              onChange={this.handleChange()}
            />
          </InputWrapper>

          <InputWrapper>
            <Icons.Repeat />
            <TextField
              style={{ width: "93.5%", fontSize: "1.2em" }}
              name="passwordConfirm"
              variant="outlined"
              label="Confirm Password"
              type="password"
              value={passwordConfirm}
              error={this.state.error.toLowerCase().includes("password")}
              onChange={this.handleChange()}
            />
          </InputWrapper>
          <Button
            onClick={this.handleSubmit()}
            style={{ background: "#0facf3", color: "#fff" }}
            disabled={loading}
            variant="contained"
            aria-label="Add"
            size="large"
          >
            Register
          </Button>
        </Form>
        {this.state.error.length > 0 ? (
          <SnackbarContent
            style={{
              margin: "auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
            message={
              <div>
                <div>
                  <Icons.Error color="error" />
                </div>
                <span>{error}</span>
              </div>
            }
          />
        ) : null}
        <span>
          Already a user? <Link to="/login">Login</Link>
        </span>
      </AuthWrapper>
    );
  }
}

export default Register;
