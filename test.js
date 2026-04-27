const { google } = require('googleapis');
const fs = require('fs');

// Load your credentials
const credentials = JSON.parse(fs.readFileSync('credentials.json'));
const { client_secret, client_id, redirect_uris } = credentials.installed;

const auth = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

// Generate a login URL
const url = auth.generateAuthUrl({
  access_type: 'offline',
  scope: ['https://www.googleapis.com/auth/calendar']
});

console.log('Visit this URL to authorize:', url);

const code = '4/0Aci98E_Fu3IRTNyk7vDMIfdp95vd5ChiE9HM684sabas0gOJvmkeH3u__C8tPIKSp77KFA'

async function getToken() {
  const { tokens } = await auth.getToken(code);
  fs.writeFileSync('token.json', JSON.stringify(tokens));
  console.log('Token saved to token.json');
  console.log(tokens);
}

getToken();

async function listEvents() {
  auth.setCredentials(JSON.parse(fs.readFileSync('token.json')));
  const calendar = google.calendar({ version: 'v3', auth });

  const res = await calendar.events.list({
    calendarId: 'primary',
    timeMin: new Date().toISOString(),
    maxResults: 5,
    singleEvents: true,
    orderBy: 'startTime'
  });

  const events = res.data.items;
  if (events.length === 0) {
    console.log('No upcoming events found');
  } else {
    console.log('Upcoming events:');
    events.forEach(e => console.log(e.summary, e.start.dateTime));
  }
}

listEvents();