// apps/desktop/main.js
// Electron entry point for MEDHAA Windows app. Loads the same React
// build used for Web/PWA — no separate codebase for desktop.

const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1024,
    minHeight: 700,
    icon: path.join(__dirname, 'assets', 'icon.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    backgroundColor: '#FFFFFF',
    show: false,
  });

  // Loads the production web build served locally, or the deployed
  // MEDHAA URL — configurable via env for staging vs production builds.
  const startUrl = process.env.MEDHAA_WEB_URL || `file://${path.join(__dirname, 'build', 'index.html')}`;
  win.loadURL(startUrl);

  win.once('ready-to-show', () => win.show());

  Menu.setApplicationMenu(null); // Clean, app-like chrome — no default menu bar
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
