import {MUTATIONS} from "./types";

export default {
    [MUTATIONS.SET_MESSAGES](state, messages){
        state.messages = messages
    },

    [MUTATIONS.SET_NEXT_PAGE_TOKEN](state, token) {
        state.nextPageToken = token
    },

    [MUTATIONS.SET_PREV_PAGE_TOKEN](state, token) {
        state.prevPageToken = token
    },

    [MUTATIONS.SET_CURRENT_MESSAGE](state, message) {
        state.currentMessage = message
    }
}
