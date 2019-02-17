import * as actionTypes from './actionTypes';

export const setUser = user => {
    return {
        type: actionTypes.SET_USER,
        payload: {
            currentUser: user
        }
    }
}

export const clearUser = () => {
    return {
        type: actionTypes.CLEAR_USER
    }
}

export const setCurrentChannel = channel => {
    return {
        type: actionTypes.SET_CURRENT_CHANNEL,
        payload: {
            currentChannel: channel
        }
    }
}

export const setPrivateChannel = isPrivate => {
    return {
        type: actionTypes.SET_PRIVATE_CHANNEL,
        payload: {
            isPrivate
        }
    }
}

export const setUserPosts = userPosts => {
    return {
        type: actionTypes.SET_USER_POSTS,
        payload: {
            userPosts
        }
    }
}