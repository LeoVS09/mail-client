import {decode} from "./utils";


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
