const electron = require('electron');
const path = require('path');
const url = require('url');
const server = require('./server');

const { app, BrowserWindow } = electron;

let mainWindow;

const createWindow = () => {
  mainWindow = new BrowserWindow({ width: 1024, height: 768 });

  mainWindow.loadURL('http://localhost:2222');

  mainWindow.on('closed', () => mainWindow = null);
};

app.on('ready', createWindow);

app.on('window-all-closed', () => app.quit());

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});