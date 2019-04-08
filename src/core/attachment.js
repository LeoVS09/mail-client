import {decode} from "./utils";

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
