const {app, BrowserWindow, ipcMain} = require("electron");
const fs = require("fs");
const setMenu = require("./setMenu.js");

let mainWindow;

//スライド表示用のテキストリクエストを送信
ipcMain.on("REQUEST_SLIDETEXT", (event, arg) => {
    mainWindow.webContents.send("REQUEST_SLIDETEXT_TO_MAIN");
});

//スライドのテーマが変更されたらoption.jsonを書き換える
ipcMain.on("SEND_SELECTED_OPTION", (event, theme, anim) => {
    let data = {
        theme: theme,
        animation: anim
    }

    fs.writeFileSync(__dirname + '/../../option.json', JSON.stringify(data), 'utf8', (err) => {
        if(err) {
            return console.log(err);
        }
    });
});

app.on("window-all-closed", () => {
    if(process.platform != 'darwin') {
        app.quit();
    }
});

app.on("ready", () => {
    mainWindow = new BrowserWindow({
        width: 800, 
        height: 600,
        //webPreferences: {
        //   nodeIntegration: false
        //}
    });
    mainWindow.loadURL('file://' + __dirname + '/../../index.html');
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
    setMenu();
});