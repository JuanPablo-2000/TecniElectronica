"use strict";

var _require = require('electron'),
  app = _require.app,
  BrowserWindow = _require.BrowserWindow,
  electron = _require.electron;
var path = require('path');
require("../back/index");
var mainWindow;
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1366,
    height: 768,
    resizable: false,
    webPreferences: {
      nodeIntegration: true // Permite el uso de Node.js en la interfaz de usuario
    },

    icon: path.join(__dirname, '/tecni-electronica/src/assets/IconoApp.png')
  });

  // Carga la aplicación Express en la ventana principal de Electron
  mainWindow.loadURL("http://localhost:4000");
  mainWindow.on('closed', function () {
    mainWindow = null;
  });

  // mainWindow.webContents.openDevTools();
}

// Inicia la aplicación Electron
app.on('ready', createWindow);