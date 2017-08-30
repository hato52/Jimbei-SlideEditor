const {app, BrowserWindow} = require('electron');

let mainWindow;

let setMenu = require('./setMenu.js');

app.on('window-all-closed', () => {
    if(process.platform != 'darwin') {
        app.quit();
    }
});

app.on('ready', () => {
    mainWindow = new BrowserWindow({width: 800, height: 600});
    mainWindow.loadURL('file://' + __dirname + '/../../index.html');
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
    setMenu();
});