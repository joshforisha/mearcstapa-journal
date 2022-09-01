const { BrowserWindow, app } = require('electron');
const path = require('path');

app.whenReady().then(() => {
  const window = new BrowserWindow({
    height: 600,
    width: 800,
    webPreference: {
      preload: path.join(__dirname, 'client/preload.js')
    }
  });

  window.loadFile('client/index.html');
});

app.on('window-all-closed', () => {
  app.quit();
});

try {
  require('electron-reloader')(module);
} catch {}
