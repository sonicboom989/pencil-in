async function parseWithOllama(userInput, timezone) {
  const today = new Date().toISOString().split('T')[0];

  const systemPrompt = `
You are a calendar assistant. Extract event details from the user's message.
Today is ${today}. The user's timezone is ${timezone}.
Return ONLY a JSON object, no other text, no markdown.

Format:
{
  "title": "event name",
  "date": "YYYY-MM-DD",
  "startTime": "HH:MM",
  "endTime": "HH:MM",
  "attendees": []
}

If duration is not specified, assume 60 minutes.
If no attendees are mentioned, return an empty array.
`;

  const response = await fetch('http://localhost:11434/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'llama3.2:3b',
      prompt: systemPrompt + '\n\nUser: ' + userInput,
      stream: false
    })
  });

  const data = await response.json();
  return JSON.parse(data.response);
}