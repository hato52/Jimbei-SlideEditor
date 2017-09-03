const {app, BrowserWindow, ipcMain} = require('electron');
const setMenu = require('./setMenu.js');

let mainWindow;

//スライド表示用のテキストリクエストを送信
ipcMain.on("REQUEST_SLIDETEXT", (event, arg) => {
    mainWindow.webContents.send("REQUEST_SLIDETEXT_TO_MAIN");
});

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
