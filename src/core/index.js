import {remote} from 'electron'
import {authenticate} from "./auth";
import {getFullMessageText, getFullMessage, getMessageHeaders, listMessages} from "./attachment";
const {google} = remote.require('googleapis')

export {
    getFullMessageText,
    getMessageHeaders,
    getFullMessage,
    getMetaMessage
} from './get'

export {
    listMessages
} from './list'

export {
    loadAttachment,
    extractAttachments
} from './attachment'

export {
    getProfile
} from './profile'

export {
    sendMessage
} from './send'

export {
    decode,
    decodeAttachment,
    writeFile
} from './utils'

export async function authenticateGmail() {
    const auth = await authenticate()
    return google.gmail({version: 'v1', auth})
}


