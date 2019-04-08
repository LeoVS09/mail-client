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
