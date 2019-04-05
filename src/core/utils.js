import {remote} from 'electron'
const fs = remote.require('fs')


export const readFile = (fileName) => new Promise((resolve, reject) => {
    fs.readFile(fileName, (err, content) => {
        if(err) return reject(err)

        resolve(content)
    })
})

export const writeFile = (fileName, content) => new Promise((resolve, reject) => {
    fs.writeFile(fileName, content, err => {
        if(err) return reject(err)

        resolve()
    })
})

export function decode(input) {
    if(!input)
        return ''
    const decodedBase64 = atob(input.replace(/-/g, '+').replace(/_/g, '/'))
    const escaped = escape(decodedBase64)
    return decodeURIComponent(escaped)
}
