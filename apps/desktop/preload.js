// apps/desktop/preload.js
// Exposes a minimal, safe bridge between the Electron shell and the
// web app — used for desktop-only features like native notifications
// for streak/break reminders (parental controls).

const { contextBridge, Notification } = require('electron');

contextBridge.exposeInMainWorld('medhaaDesktop', {
  isDesktop: true,
  showNotification: (title, body) => {
    new Notification({ title, body }).show();
  },
});
