const { app, BrowserWindow } = require('electron');
require("../back/index");

let mainWindow;

function createWindow() {
  
  mainWindow = new BrowserWindow({
    width: 1366,
    height: 768,
    resizable: false,
    webPreferences: {
      nodeIntegration: true // Permite el uso de Node.js en la interfaz de usuario
    }
  });

  // Carga la aplicación Express en la ventana principal de Electron
  mainWindow.loadURL(`http://localhost:4000`);

  mainWindow.on('closed', function () {
    mainWindow = null;
  });

  // mainWindow.webContents.openDevTools();
}

// Inicia la aplicación Electron
app.on('ready', createWindow);