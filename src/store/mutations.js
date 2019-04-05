import {MUTATIONS} from "./types";

export default {
    [MUTATIONS.SET_MESSAGES](state, messages){
        state.messages = messages
    },

    [MUTATIONS.SET_NEXT_PAGE_TOKEN](state, token) {
        state.nextPageToken = token
    },

    [MUTATIONS.SET_CURRENT_PAGE_TOKEN](state, token) {
        state.currentPageToken = token
    },

    [MUTATIONS.PUSH_PREV_PAGE_TOKEN](state, token) {
        state.prevPageTokens.push(token)
    },

    [MUTATIONS.SET_CURRENT_MESSAGE](state, message) {
        state.currentMessage = message
    },

    [MUTATIONS.SET_API_STATUS](state, status) {
        state.status = status
    },

    [MUTATIONS.PUSH_MESSAGE_TO_LIST](state, message) {
        state.messages.push(message)
    },

    [MUTATIONS.UPDATE_MESSAGE](state, {message, index}) {
        state.messages[index] = message
    }
}
