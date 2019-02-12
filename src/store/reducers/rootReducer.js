import {
    combineReducers
} from 'redux'
import userReducer from './userReducer/userReducer';
import channelReducer from './channelReducer/channelReducer';


const rootReducer = combineReducers({
    user: userReducer,
    channel: channelReducer
})

export default rootReducer;