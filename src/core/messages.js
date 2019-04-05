import {decode} from "./utils";

export function listMessages(gmail, pageToken, userId = 'me') {
    return new Promise((resolve, reject) => {
        let request = {userId}
        if(pageToken)
            request = {...request, pageToken}

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
            if(err) return reject(err)

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
            if(err) return reject(err)

            resolve(res.data)
        })
    })
}

export function getMessageHeaders(message) {
    const {payload: {headers}} = message
    let names = ['subject', 'from', 'to']

    let result = {}
    for(const header of headers)
        if(names.indexOf(header.name.toLowerCase()) !== -1)
            result[header.name] = header.value

    return result
}

export function getFullMessageText(message) {
    const {payload: {body, parts}} = message
    if(body && body.data)
        return decode(body.data)

    if(!parts || !parts.length)
        return null

    return parts.reduce((result, {body}) =>
        result + '\n---\n' + decode(body.data)
        , '')
}
