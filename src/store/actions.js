import {ACTIONS, MUTATIONS} from "./types";
import {ApiStatus, Message} from "./state";
import {
    authenticateGmail,
    getFullMessage,
    getMetaMessage,
    listMessages,
    decodeAttachment,
    loadAttachment,
    getProfile,
    sendMessage
} from "../core";
import router, {routes} from '../router'

let gmail = null

export default {
    async [ACTIONS.AUTHENTICATE]({commit, state}) {
        if (state.status === ApiStatus.START_AUTHENTICATE || state.status === ApiStatus.AUTHENTICATED)
            return console.error('Cannot authenticate, status', state.status)

        commit(MUTATIONS.SET_API_STATUS, ApiStatus.START_AUTHENTICATE)
        gmail = await authenticateGmail()
        const {emailAddress, messagesTotal} = await getProfile(gmail)
        console.log('emailAddress', emailAddress, "messagesTotal", messagesTotal)
        commit(MUTATIONS.SET_EMAIL, emailAddress)
        commit(MUTATIONS.SET_COUNT_MESSAGES, messagesTotal)
        commit(MUTATIONS.SET_API_STATUS, ApiStatus.AUTHENTICATED)
    },

    async [ACTIONS.LOAD_MESSAGE]({commit, state}, id) {
        console.log('start load message')
        const fullMessage = await getFullMessage(gmail, id, state.userId)
        console.log('full message', fullMessage)

        const message = new Message(fullMessage)

        console.log('message loaded')
        commit(MUTATIONS.SAVE_MESSAGE, message)
    },

    async [ACTIONS.LOAD_MESSAGES_LIST]({commit, dispatch, state}, pageToken) {
        if (state.status !== ApiStatus.AUTHENTICATED)
            return console.error('Cannot load messages before authenticate')

        const {messages, nextPageToken} = await listMessages(gmail, pageToken, state.query, state.userId)

        commit(MUTATIONS.SET_CURRENT_PAGE_TOKEN, pageToken)
        commit(MUTATIONS.SET_MESSAGES, [])
        commit(MUTATIONS.SET_NEXT_PAGE_TOKEN, nextPageToken)

        const forLoading = messages.slice(0, 30)

        await Promise.all(forLoading.map(async ({id}) => {
            const message = await getMetaMessage(gmail, id, state.userId)
            console.log('Loaded message', message)
            commit(MUTATIONS.SAVE_MESSAGE, new Message(message))
        }))
    },

    async [ACTIONS.LOAD_NEXT_PAGE]({commit, state, dispatch}) {
        if (!state.nextPageToken)
            return console.error('Not have next page token')

        const currentPageToken = state.currentPageToken

        await dispatch(ACTIONS.LOAD_MESSAGES_LIST, state.nextPageToken)
        commit(MUTATIONS.PUSH_PREV_PAGE_TOKEN, currentPageToken)
    },

    async [ACTIONS.LOAD_PREV_PAGE]({state, dispatch}) {
        const {prevPageTokens} = state
        if (!prevPageTokens.length)
            return console.error('Not have previous pages')

        const prev = prevPageTokens.pop()
        await dispatch(ACTIONS.LOAD_MESSAGES_LIST, prev)

    },

    async [ACTIONS.OPEN_MESSAGE]({commit, state, dispatch}, index) {
        let message = state.messages[index]

        router.push({name: routes.MESSAGE, params: {id: message.id}})
    },

    async [ACTIONS.UPDATE_QUERY]({commit, state}, text) {
        commit(MUTATIONS.UPDATE_QUERY, text)
    },

    async [ACTIONS.LOAD_ATTACHMENT]({commit, state}, {message, attachment: a}) {
        console.log('start loading')
        const attachment = await loadAttachment(gmail, message.messageResponse, a.id, state.userId)
        console.log('attachment', attachment)

        const data = attachment.data.data
        const decoded = decodeAttachment(data)
        console.log("decoded", decoded)
        console.log('mimeType', a.mimeType)

        download(a.name, decoded, a.mimeType)
    },

    async [ACTIONS.SEND_MESSAGE]({commit, state}, {to, subject, text}) {
        console.log('Sending message')
        await sendMessage(gmail, {from: state.email, to, subject, text})
        console.log('Message was send')
    }
}

function download(name, text, type) {
    const a = document.createElement('a')
    const file = new Blob([text], {type: type});
    a.href = URL.createObjectURL(file);
    a.download = name;
    a.click()
}
