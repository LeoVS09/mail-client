import {getFullMessageText, getMessageHeaders, extractAttachments} from "../core";

export const ApiStatus = {
    NONE: 'NONE',
    START_AUTHENTICATE: 'START_AUTHENTICATE',
    AUTHENTICATED: 'AUTHENTICATED'
}

export class State {
    userId = 'me'
    email = null
    countMessages = 0
    messages = []
    nextPageToken = null
    currentPageToken = null
    prevPageTokens = []
    status = ApiStatus.NONE
    query = ''

}

export class Message {
    constructor(messageResponse) {
        this.messageResponse = messageResponse

        this.id = messageResponse.id
        const headers = getMessageHeaders(messageResponse)

        this.subject = headers['Subject']
        this.from = headers['From']
        this.to = headers['To']

        this.text = getFullMessageText(messageResponse)

        this.attachments = extractAttachments(messageResponse)
    }
}
