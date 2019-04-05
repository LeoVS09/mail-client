import {remote} from 'electron'
import ElectronGoogleOAuth2 from '@getstation/electron-google-oauth2'
import {readFile, writeFile} from "./utils";

const {google} = remote.require('googleapis')

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly']
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json'
const CREDENTIALS_PATH = './credentials.json'

export async function authorize() {
    const credentials = await readFile(CREDENTIALS_PATH)

    // eslint-disable-next-line
    const {client_secret, client_id, redirect_uris} = JSON.parse(credentials).installed

    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0])

    try {

        const token = await readFile(TOKEN_PATH)
        oAuth2Client.setCredentials(JSON.parse(token))
        return oAuth2Client

    } catch (e) {
        const electronOAuth = new ElectronGoogleOAuth2(client_id, client_secret, SCOPES);
        const token = await electronOAuth.openAuthWindowAndGetTokens()
        await writeFile(TOKEN_PATH, JSON.stringify(token))

        oAuth2Client.setCredentials(token)
        return  oAuth2Client
    }
}
