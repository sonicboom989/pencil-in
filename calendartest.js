const { checkConflicts, createEvent } = require('./calendar');

const testEvent = {
  title: 'Bowling',
  date: '2026-04-25',
  startTime: '12:00',
  endTime: '13:00',
  attendees: ['Lucas']
};

async function test() {
  const start = new Date(`${testEvent.date}T${testEvent.startTime}:00`);
  const end = new Date(`${testEvent.date}T${testEvent.endTime}:00`);

  const startDateTime = start.toISOString();
  const endDateTime = end.toISOString();

  console.log('Checking conflicts...');
  const conflicts = await checkConflicts(startDateTime, endDateTime);
  console.log('Conflicts found:', conflicts);

  if (conflicts.length === 0) {
  console.log('No conflicts, creating event...');
  const result = await createEvent(testEvent);
  console.log('Event created:', result);
}
}


test()