import {decode} from "./utils";

export function listMessages(gmail, pageToken, query, userId = 'me') {
    return new Promise((resolve, reject) => {
        let request = {userId}

        if (pageToken)
            request = {...request, pageToken}

        if (query)
            request = {...request, q: query}

        console.log('List messages request')

        gmail.users.messages.list(request, (err, res) => {
            if (err) return reject(err)

            resolve(res.data)
        })
    })
}

export function getFullMessage(gmail, id, userId = 'me') {
    return new Promise((resolve, reject) => {
        gmail.users.messages.get({
            userId,
            id,
            format: 'full'
        }, (err, res) => {
            if (err) return reject(err)

            resolve(res.data)
        })
    })
}

export function getMetaMessage(gmail, id, userId = 'me') {
    return new Promise((resolve, reject) => {
        gmail.users.messages.get({
            userId,
            id,
            format: 'metadata'
        }, (err, res) => {
            if (err) return reject(err)

            resolve(res.data)
        })
    })
}

export function getMessageHeaders(message) {
    const {payload: {headers}} = message
    let names = ['subject', 'from', 'to']

    let result = {}
    for (const header of headers)
        if (names.indexOf(header.name.toLowerCase()) !== -1)
            result[header.name] = header.value

    return result
}

export function getFullMessageText(message) {
    const {payload: {body, parts}} = message
    if (body && body.data)
        return decode(body.data)

    if (!parts || !parts.length)
        return null

    return decodeParts(parts)
}

function decodeParts(parts) {
    return parts.reduce((result, {body, parts}) => {
        if (body && body.data)
            return result + '<hr />' + decode(body.data)

        if (!parts || !parts.length)
            return result

        return result + '<hr />' + decodeParts(parts)
    }, '')
}

export function loadAttachment(gmail, message, id, userId = 'me') {
    return new Promise((resolve, reject) => {
        gmail.users.messages.attachments.get({
            id,
            'messageId': message.id,
            'userId': userId
        }, (err, attach) => {
            if (err)
                return reject(err)
            console.log('loaded attachment', attach)
            resolve(attach)
        })
    })
}

export function extractAttachments(message) {
    const parts = message.payload.parts;
    if (!parts || !parts.length)
        return []

    return findAttachments(parts)
}

function findAttachments(parts) {
    const result = []
    for (const part of parts) {
        if (part.body.attachmentId) {
            result.push({
                id: part.body.attachmentId,
                name: part.filename,
                mimeType: part.mimeType
            })
            continue
        }

        if (part.parts && part.parts.length)
            result.push(...findAttachments(part.parts))
    }

    return result
}
