import { SET_COLORS, SET_DEFAULT_COLORS } from "../../actions/actionTypes";

const initialState = {
  primary: "#003459",
  secondary: "#00171F",
  accent: "#00A8E8"
};

const colorsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_COLORS:
      return {
        primary: action.payload.primary,
        secondary: action.payload.secondary,
        accent: action.payload.accent
      };
    case SET_DEFAULT_COLORS:
      return initialState;
    default:
      return state;
  }
};

export default colorsReducer;
