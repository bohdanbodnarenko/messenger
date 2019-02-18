import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import styled from "styled-components";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import Mail from "@material-ui/icons/Mail";
import Error from "@material-ui/icons/Error";
import Lock from "@material-ui/icons/Lock";
import firebase from "../../firebase";

import {
  TextField,
  IconButton,
  Button,
  Typography,
  SnackbarContent
} from "@material-ui/core";

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
  height: 50vh;
  color: #342e37;
  text-align: center;
  @media (max-width: 700px) {
    width: 90vw;
  }
`;

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
  height: 50%;
  align-items: center;
`;

export class Login extends Component {
  state = {
    username: "",
    email: "",
    password: "",
    passwordConfirm: "",
    error: "",
    loading: false,
    showPassword: false
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
          this.props.history.push("/");
        })
        .catch(err => {
          console.error(err);
          this.setState({ error: err.message, loading: false });
        });
    }
  };

  componentDidMount() {
    if (!this.props.user && this.props.history) {
      console.log(1);
      // this.props.history.push("/");
    }
  }

  handleClickShowPassword = () => {
    this.setState(state => ({ showPassword: !state.showPassword }));
  };

  render() {
    const { email, password, error, loading } = this.state;
    return (
      <AuthWrapper>
        <Typography
          style={{ marginTop: "20px", fontWeight: "bold" }}
          component="h2"
          variant="display2"
          align="center"
          gutterBottom
        >
          Login to <span style={{ color: "#3C4859" }}>Social Network</span>{" "}
        </Typography>
        <Form onSubmit={this.handleSubmit()}>
          <InputWrapper>
            <Mail />
            <TextField
              style={{ width: "93.5%", fontSize: "1.2em" }}
              name="email"
              variant="outlined"
              type="email"
              label="Email"
              value={email}
              error={
                this.state.error.toLowerCase().includes("user") ||
                this.state.error.toLowerCase().includes("email ")
              }
              onChange={this.handleChange()}
            />
          </InputWrapper>
          <InputWrapper>
            <Lock />
            <TextField
              style={{ width: "93.5%", fontSize: "1.2em" }}
              name="password"
              variant="outlined"
              type={this.state.showPassword ? "text" : "password"}
              label="Password"
              value={password}
              error={this.state.error.toLowerCase().includes("password")}
              onChange={this.handleChange()}
              InputProps={{
                endAdornment: (
                  <IconButton
                    aria-label="Toggle password visibility"
                    onClick={this.handleClickShowPassword}
                  >
                    {this.state.showPassword ? (
                      <VisibilityOff />
                    ) : (
                      <Visibility />
                    )}
                  </IconButton>
                )
              }}
            />
          </InputWrapper>
          <Button
            onClick={this.handleSubmit()}
            style={{ background: "#0facf3" }}
            disabled={loading}
            // loading={loading}
            variant="contained"
            color="primary"
            aria-label="Add"
            size="large"
          >
            Login
          </Button>
        </Form>
        <span>
          Don't have an account? <Link to="/register">Register</Link>
        </span>

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
                  <Error color="error" />
                </div>
                <div style={{ textAlign: "center" }}>
                  <span>{error}</span>
                </div>
              </div>
            }
          />
        ) : null}
      </AuthWrapper>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.user.currentUser
  };
};

export default connect(mapStateToProps)(Login);
