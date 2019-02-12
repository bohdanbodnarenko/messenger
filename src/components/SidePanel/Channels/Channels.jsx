import React, { Component, Fragment } from "react";
import { connect } from "react-redux";

import {
  MenuItem,
  Icon,
  MenuMenu,
  Modal,
  ModalHeader,
  ModalContent,
  FormField,
  Input,
  Form,
  ModalActions,
  Button
} from "semantic-ui-react";

import firebase from "../../../firebase";
import { setCurrentChannel } from "../../../store/actions";

export class Channels extends Component {
  state = {
    channels: [],
    isModalOpen: false,
    channelName: "",
    channelDetails: "",
    channelsRef: firebase.database().ref("channels"),
    firstLoad: true,
    activeChannel: ""
  };

  handleChange = () => event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  closeModal = () => this.setState({ isModalOpen: false });

  openModal = () => this.setState({ isModalOpen: true });

  handleSubmit = () => event => {
    event.preventDefault();
    if (this.isFormValid(this.state)) {
      this.addChannel();
    }
  };

  componentDidMount = () => {
    this.addListeners();
  };

  componentWillUnmount = () => {
    this.removeListeners();
  };

  removeListeners = () => {
    this.state.channelsRef.off();
  };

  addListeners = () => {
    let loadedChannels = [];
    this.state.channelsRef.on("child_added", snap => {
      loadedChannels.push(snap.val());
      this.setState({ channels: loadedChannels }, () => this.setFirstChannel());
    });
  };

  setFirstChannel = () => {
    const firstChannel = this.state.channels[0];
    if (this.state.firstLoad && this.state.channels.length > 0) {
      this.props.setCurrentChannel(firstChannel);
      this.setActiveChannel(firstChannel);
    }
    this.setState({ firstLoad: false });
  };

  changeChannel = channel => {
    this.setActiveChannel(channel);
    this.props.setCurrentChannel(channel);
  };

  setActiveChannel = channel => {
    this.setState({ activeChannel: channel.id });
  };

  addChannel = () => {
    const { channelName, channelDetails, channelsRef } = this.state;

    const key = channelsRef.push().key;

    const newChannel = {
      id: key,
      name: channelName,
      details: channelDetails,
      createdBy: {
        name: this.props.user.displayName,
        avatar: this.props.user.photoURL
      }
    };

    channelsRef
      .child(key)
      .update(newChannel)
      .then(() => {
        this.setState({ channelName: "", channelDetails: "" });
        this.closeModal();
        console.log("channel added");
      })
      .catch(err => {
        console.error(err);
      });
  };

  displayChannels = () => {
    if (this.state.channels.length > 0) {
      return this.state.channels.map(channel => (
        <MenuItem
          key={channel.id}
          onClick={() => this.changeChannel(channel)}
          name={channel.name}
          style={{ opacity: 0.7 }}
          active={channel.id === this.state.activeChannel}
        >
          # {channel.name}
        </MenuItem>
      ));
    }
  };

  isFormValid = ({ channelName, channelDetails }) =>
    channelName && channelDetails;

  render() {
    return (
      <Fragment>
        <MenuMenu style={{ paddingBottom: "2em" }}>
          <MenuItem>
            <span>
              <Icon name="exchange" />
              Channels
            </span>
            {"  "}({this.state.channels.length}){" "}
            <Icon
              onClick={this.openModal}
              className="clickable-icon"
              name="add"
            />
          </MenuItem>
          {this.displayChannels()}
        </MenuMenu>

        <Modal basic open={this.state.isModalOpen} onClose={this.closeModal}>
          <ModalHeader>Add a Channel</ModalHeader>
          <ModalContent>
            <Form onSubmit={this.handleSubmit()}>
              <FormField>
                <Input
                  fluid
                  placeholder="Name of Channel"
                  name="channelName"
                  onChange={this.handleChange()}
                />
              </FormField>
              <FormField>
                <Input
                  fluid
                  placeholder="About the Channel"
                  name="channelDetails"
                  onChange={this.handleChange()}
                />
              </FormField>
              <ModalActions>
                <Button
                  onClick={this.handleSubmit()}
                  type="submit"
                  floated="right"
                  color="green"
                  inverted
                >
                  <Icon name="checkmark" /> Add
                </Button>
              </ModalActions>
            </Form>
          </ModalContent>
        </Modal>
      </Fragment>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setCurrentChannel: channel => dispatch(setCurrentChannel(channel))
  };
};

export default connect(
  null,
  mapDispatchToProps
)(Channels);
