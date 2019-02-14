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
  Button,
  Label
} from "semantic-ui-react";

import firebase from "../../../firebase";
import { setCurrentChannel, setPrivateChannel } from "../../../store/actions";

export class Channels extends Component {
  state = {
    channels: [],
    channel: null,
    isModalOpen: false,
    channelName: "",
    channelDetails: "",
    channelsRef: firebase.database().ref("channels"),
    messagesRef: firebase.database().ref("messages"),
    notifications: [],
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
      this.addNotificationListener(snap.key);
    });
  };

  addNotificationListener = channelID => {
    this.state.messagesRef.child(channelID).on("value", snap => {
      if (this.state.channel) {
        this.handleNotifications(
          channelID,
          this.state.channel.id,
          this.state.notifications,
          snap
        );
      }
    });
  };

  handleNotifications = (channelID, currentChannel, notifications, snap) => {
    let lastTotal = 0;
    let index = notifications.findIndex(
      notification => notification.id === channelID
    );

    if (index !== -1) {
      if (channelID !== currentChannel) {
        lastTotal = notifications[index].total;

        if (snap.numChildren() - lastTotal > 0) {
          notifications[index].count = snap.numChildren() - lastTotal;
        }
      }
    } else {
      notifications.push({
        id: channelID,
        total: snap.numChildren(),
        lastKnownTotal: snap.numChildren(),
        count: 0
      });
    }

    this.setState({ notifications });
  };

  setFirstChannel = () => {
    const firstChannel = this.state.channels[0];
    if (this.state.firstLoad && this.state.channels.length > 0) {
      this.props.setCurrentChannel(firstChannel);
      this.setActiveChannel(firstChannel);
    }
    this.setState({ firstLoad: false });
  };

  clearNotifications = () => {
    let index = this.state.notifications.findIndex(
      notification => notification.id === this.state.channel.id
    );
    if (index !== -1) {
      let updatedNotifications = [...this.state.notifications];
      updatedNotifications[index].total = this.state.notifications[
        index
      ].lastKnownTotal;
      updatedNotifications[index].count = 0;
      this.setState({ notifications: updatedNotifications });
    }
  };

  getNotificationCount = channel => {
    let count = 0;
    this.state.notifications.forEach(notif => {
      if (notif.id === channel.id) {
        count = notif.count;
      }
    });

    if (count > 0) return count;
  };

  changeChannel = channel => {
    this.setActiveChannel(channel);
    this.clearNotifications();
    this.props.setCurrentChannel(channel);
    this.props.setPrivateChannel(false);
    this.setState({ channel });
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
          {this.getNotificationCount(channel) && (
            <Label style={{background:"#e6186d"}}>{this.getNotificationCount(channel)}</Label>
          )}
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
        <MenuMenu className="menu">
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
    setCurrentChannel: channel => dispatch(setCurrentChannel(channel)),
    setPrivateChannel: isPrivate => dispatch(setPrivateChannel(isPrivate))
  };
};

export default connect(
  null,
  mapDispatchToProps
)(Channels);
