import { combineReducers } from "redux";
import userReducer from "./userReducer/userReducer";
import channelReducer from "./channelReducer/channelReducer";
import colorsReducer from "./colorReducer/colorReducer";

const rootReducer = combineReducers({
  user: userReducer,
  channel: channelReducer,
  color: colorsReducer
});

export default rootReducer;
