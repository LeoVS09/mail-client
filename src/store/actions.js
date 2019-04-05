import {ACTIONS, MUTATIONS} from "./types";
import {ApiStatus, Message} from "./state";
import {authenticateGmail, getFullMessage, getMetaMessage, listMessages} from "../core";
import router from '../router'
import routes from '../router/routes'
import {loadAttachment} from "../core/messages";

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

        const {messages, nextPageToken} = await listMessages(gmail, pageToken, state.query, state.userId)

        commit(MUTATIONS.SET_CURRENT_PAGE_TOKEN, pageToken)
        commit(MUTATIONS.SET_MESSAGES, [])
        commit(MUTATIONS.SET_NEXT_PAGE_TOKEN, nextPageToken)

        const forLoading = messages.slice(0, 30)

        await Promise.all(forLoading.map(async m => {
            const message = await getMetaMessage(gmail, m.id, state.userId)
            console.log('Loaded message', message)
            commit(MUTATIONS.UPDATE_MESSAGE, new Message(message))
        }))
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

        commit(MUTATIONS.SET_CURRENT_MESSAGE, message.id)
        router.push({name: routes.MESSAGE, params: {id: message.id}})

        if (message.text)
            return

        console.log('start load message')
        const fullMessage = await getFullMessage(gmail, message.id, state.userId)
        console.log('full message', fullMessage)

        message = new Message(fullMessage)

        console.log('message loaded')
        commit(MUTATIONS.UPDATE_MESSAGE, message)
    },

    async [ACTIONS.UPDATE_QUERY]({commit, state}, text) {
        commit(MUTATIONS.UPDATE_QUERY, text)
    },

    async [ACTIONS.LOAD_ATTACHMENT]({commit, state}, {message, attachment: a}) {
        console.log('start loading')
        const attachment = await loadAttachment(gmail, message.messageResponse, a.id, state.userId)
        console.log('attachment', attachment)

    }
}
