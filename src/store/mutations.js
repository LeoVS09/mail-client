import {MUTATIONS} from "./types";
import Vue from 'vue'

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

    [MUTATIONS.SET_API_STATUS](state, status) {
        state.status = status
    },

    [MUTATIONS.SAVE_MESSAGE](state, message) {
        const index = state.messages.findIndex(({id}) => id === message.id)
        console.log('index', index)
        if(index !== -1) {
            Vue.set(state.messages, index, {...state.messages[index], ...message})
            console.log('message updated', state.messages[index])
        } else {
            state.messages.push(message)
            console.log('message pushed', message)
        }
    },

    [MUTATIONS.UPDATE_QUERY](state, text) {
        state.query = text
    }
}
