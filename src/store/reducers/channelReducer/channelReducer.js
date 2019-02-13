import * as actionTypes from '../../actions/actionTypes';

const initialState = {
    currentChannel: null,
    isPrivate: false
}

const channelReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SET_CURRENT_CHANNEL:
            return {
                ...state,
                currentChannel: action.payload.currentChannel
            }

        case actionTypes.SET_PRIVATE_CHANNEL:
            return {
                ...state,
                isPrivate: action.payload.isPrivate
            }

        default:
            return state;
    }
}

export default channelReducer;