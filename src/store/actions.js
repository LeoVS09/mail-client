import {ACTIONS, MUTATIONS} from "./types";
import {ApiStatus, Message} from "./state";
import {authenticateGmail, getFullMessage, getMetaMessage, listMessages} from "../core";

let gmail = null

export default {
    async [ACTIONS.AUTHENTICATE]({commit, state}) {
        if (state.status === ApiStatus.START_AUTHENTICATE || state.status === ApiStatus.AUTHENTICATED)
            return console.error('Cannot authenticate, status', state.status)

        commit(MUTATIONS.SET_API_STATUS, ApiStatus.START_AUTHENTICATE)
        gmail = await authenticateGmail()
        commit(MUTATIONS.SET_API_STATUS, ApiStatus.AUTHENTICATED)
    },

    async [ACTIONS.LOAD_MESSAGES]({commit, state}, pageToken) {
        if (state.status !== ApiStatus.AUTHENTICATED)
            return console.error('Cannot load messages before authenticate')

        const {messages, nextPageToken} = await listMessages(gmail, pageToken, state.userId)

        commit(MUTATIONS.SET_CURRENT_PAGE_TOKEN, pageToken)
        commit(MUTATIONS.SET_MESSAGES, [])
        commit(MUTATIONS.SET_NEXT_PAGE_TOKEN, nextPageToken)

        const forLoading = messages.slice(0, 10)

        for (const m of forLoading) {
            const message = await getMetaMessage(gmail, m.id, state.userId)
            console.log('Loaded message', message)
            commit(MUTATIONS.PUSH_MESSAGE_TO_LIST, new Message(message))
        }
    },

    async [ACTIONS.LOAD_NEXT_PAGE]({commit, state, dispatch}) {
        if (!state.nextPageToken)
            return console.error('Not have next page token')

        const currentPageToken = state.currentPageToken

        await dispatch(ACTIONS.LOAD_MESSAGES, state.nextPageToken)
        commit(MUTATIONS.PUSH_PREV_PAGE_TOKEN, currentPageToken)
    },

    async [ACTIONS.LOAD_PREV_PAGE]({state, dispatch}) {
        const {prevPageTokens} = state
        if (!prevPageTokens.length)
            return console.error('Not have previous pages')

        const prev = prevPageTokens.pop()
        await dispatch(ACTIONS.LOAD_MESSAGES, prev)

    },

    async [ACTIONS.OPEN_MESSAGE]({commit, state}, index) {
        let message = state.messages[index]

        if (message.text)
            return commit(MUTATIONS.SET_CURRENT_MESSAGE, message)

        const fullMessage = await getFullMessage(gmail, message.id, state.userId)
        message = new Message(fullMessage)

        commit(MUTATIONS.SET_CURRENT_MESSAGE, message)
        commit(MUTATIONS.UPDATE_MESSAGE, {message, index})
    }
}
