import {remote} from 'electron'
import {authenticate} from "./auth";
import {getFullMessageText, getFullMessage, getMessageHeaders, listMessages} from "./messages";
const {google} = remote.require('googleapis')

export {
    getFullMessageText,
    getMessageHeaders,
    getFullMessage,
    listMessages,
    getMetaMessage
} from './messages'

export async function authenticateGmail() {
    const auth = await authenticate()
    return google.gmail({version: 'v1', auth})
}

export async function loadMails() {
    console.log('Start load mails')

    const gmail = await authenticateGmail()
    const {messages, nextPageToken } = await listMessages(gmail)
    console.log("messages", messages)
    console.log('nextPageToken', nextPageToken)

    for(let i = 0; i < 10; i++) {
        const message = await getFullMessage(gmail, messages[i].id)
        const headers = getMessageHeaders(message)
        const text = getFullMessageText(message)
        console.log('Message', headers, '\n', text)
    }
}


export async function logLabels(gmail) {
    const labels = await listLabels(gmail)

    if (!labels.length)
        return console.log('No labels found.')

    console.log('Labels:')
    labels.forEach((label) => {
        console.log(`- ${label.name}`)
    })
}

/**
 * Lists the labels in the user's account.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
export function listLabels(gmail) {
    return new Promise((resolve, reject) => {
        gmail.users.labels.list({userId: 'me'}, (err, res) => {
            if (err) return reject(err)

            resolve(res.data.labels)
        })
    })
}


