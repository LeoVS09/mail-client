import {Base64} from 'js-base64'

export function sendMessage(gmail, {userId = 'me', from, to, subject, text}) {
    const content = formatMessage(from, to, subject, new Date(), text)
    const raw = Base64.encodeURI(content)
    console.log('Send message content', content)
    return new Promise((resolve, reject) => {
        gmail.users.messages.send({
            userId,
            resource: {
                raw
            }
        }, (err, response) => {
            if(err)
                return reject(err)

            resolve(response)
        })
    })
}

function formatMessage(from, to, subject, date, text) {
    const next = '\r\n'
    return 'FROM: ' + from + next +
        'TO: ' + to + next +
        'Subject: ' + subject + next +
        'Date: ' + date.toUTCString() + next + next +
         text
}
