import {getFullMessageText, getMessageHeaders} from "../core";

export class State {
    userId = 'me'
    messages = []
    nextPageToken = null
    prevPageToken = null

    currentMessage = null

}

export class Message {
    constructor(messageResponse) {
        const headers = getMessageHeaders(messageResponse)

        this.subject = headers['Subject']
        this.from = headers['From']
        this.to = headers['To']

        this.text = getFullMessageText(messageResponse)
    }
}
