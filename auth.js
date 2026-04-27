const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

const SCOPES = ['https://www.googleapis.com/auth/calendar'];
const TOKEN_PATH = path.join(__dirname, 'token.json');
const CREDENTIALS_PATH = path.join(__dirname, 'credentials.json');

function loadCredentials() {
  const content = fs.readFileSync(CREDENTIALS_PATH);
  return JSON.parse(content);
}

function getAuthClient() {
  const credentials = loadCredentials();
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  return new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
}

function isAuthenticated() {
  return fs.existsSync(TOKEN_PATH);
}

function loadToken(auth) {
  const token = fs.readFileSync(TOKEN_PATH);
  auth.setCredentials(JSON.parse(token));
  return auth;
}

function saveToken(token) {
  fs.writeFileSync(TOKEN_PATH, JSON.stringify(token));
}

function getAuthUrl(auth) {
  return auth.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  });
}

async function exchangeCode(auth, code) {
  const { tokens } = await auth.getToken(code);
  auth.setCredentials(tokens);
  saveToken(tokens);
  return auth;
}

function getAuthorizedClient() {
  const auth = getAuthClient();
  if (isAuthenticated()) {
    return loadToken(auth);
  }
  return null;
}

module.exports = {
  getAuthClient,
  getAuthorizedClient,
  getAuthUrl,
  exchangeCode,
  isAuthenticated
};