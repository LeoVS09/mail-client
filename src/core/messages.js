import {decode} from "./utils";

export function listMessages(gmail, userId = 'me') {
    return new Promise((resolve, reject) => {
        gmail.users.messages.list({userId}, (err, res) => {
            if (err) return reject(err)

            resolve(res.data)
        })
    })
}

export function getMessage(gmail, id, userId = 'me') {
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

    return parts.reduce((result, {body}) =>
        result + '\n---\n' + decode(body.data)
        , '')
}
