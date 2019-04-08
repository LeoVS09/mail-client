export function getProfile(gmail, userId = 'me') {
    return new Promise((resolve, reject) => {
        gmail.users.getProfile({
            userId,
        }, (err, res) => {
            if (err) return reject(err)

            resolve(res.data)
        })
    })
}
