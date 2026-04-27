const { app, BrowserWindow, ipcMain } = require('electron');
const { checkConflicts, createEvent } = require('./calendar');

ipcMain.handle('schedule-event', async (_event, eventDetails) => {
    const start = new Date(`${eventDetails.date}T${eventDetails.startTime}:00`);
    const end   = new Date(`${eventDetails.date}T${eventDetails.endTime}:00`);

    const conflicts = await checkConflicts(start.toISOString(), end.toISOString());

    if (conflicts.length > 0) {
        return { success: false, message: `Conflict: "${conflicts[0].summary}" is already at that time.` };
    }

    await createEvent(eventDetails);
    return { success: true, message: `Scheduled "${eventDetails.title}" on ${eventDetails.date} at ${eventDetails.startTime}.` };
});

function createWindow() {
    const win = new BrowserWindow({
        width: 400,
        height: 300,
        resizable: false,
        frame: false,
        transparent: true,
        backgroundColor: '#00000000',
        alwaysOnTop: true,
        skipTaskbar: true,
        show: false,
        hasShadow: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    // Show only after the page has painted to avoid corner artifacts
    win.once('ready-to-show', () => win.show());
    win.loadFile('index.html');
}

ipcMain.on('close-window', () => {
    BrowserWindow.getFocusedWindow()?.close();
});

app.whenReady().then(createWindow);