const { google } = require('googleapis');
const { getAuthorizedClient } = require("./auth");

const fs = require('fs');
const settings = JSON.parse(fs.readFileSync('settings.json'));
const timezone = settings.timezone;


function getCalendar(){
    const auth = getAuthorizedClient();
    return google.calendar({ version: 'v3', auth});
}

async function checkConflicts(startDateTime, endDateTime){
    const calendar = getCalendar();
    const res = await calendar.events.list({
        calendarId: 'primary',
        timeMin: startDateTime,
        timeMax: endDateTime,
        singleEvents: true

    });
    return res.data.items
}



async function createEvent(eventDetails) {
    const calendar = getCalendar();

    const start = new Date(`${eventDetails.date}T${eventDetails.startTime}:00`);
    const end = new Date(`${eventDetails.date}T${eventDetails.endTime}:00`);

    const startDateTime = start.toISOString();
    const endDateTime = end.toISOString();

    const event = {
        summary: eventDetails.title,
        start: {
            dateTime: startDateTime,
            timeZone: timezone
        },
        end: {
            dateTime: endDateTime,
            timeZone: timezone
        }
    };

    const res = await calendar.events.insert({
        calendarId: 'primary',
        resource: event
    });

    return res.data;
}

module.exports = { checkConflicts, createEvent };