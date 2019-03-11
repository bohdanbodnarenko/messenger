import React from "react";
import { withStyles, Button } from "@material-ui/core";
import * as Icons from "@material-ui/icons";

const styles = {
  buttonSuccess: {
    color: "#02C39A",
    borderColor: "#02C39A"
  },
  buttonDanger: {
    color: "#D90429",
    borderColor: "#D90429"
  }
};

const ButtonSuccess = props => {
  const { classes } = props;
  if (props.success) {
    return (
      <Button className={classes.buttonSuccess} onClick={props.click}>
        {props.icon || <Icons.CheckOutlined />} {props.children}
      </Button>
    );
  } else {
    if (props.cancel) {
      return (
        <Button className={classes.buttonDanger} onClick={props.click}>
          {props.icon || <Icons.CancelOutlined />} {props.children}
        </Button>
      );
    } else {
      return <Button>{props.click}</Button>;
    }
  }
};

export default withStyles(styles)(ButtonSuccess);
