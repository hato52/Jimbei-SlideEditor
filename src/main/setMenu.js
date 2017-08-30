const {Menu, BrowserWindow, dialog, ipcMain} = require("electron");
const fs = require("fs");

let currentPath;

function setMenu() {
    const menu = [
        {
            label: "ファイル",
            submenu: [
                {label: "開く", accelerator: "CmdOrCtrl+O", click: () => openFile()},
                {label: "保存", accelerator: "CmdOrCtrl+S", click: () => overWriteFile()},
                {label: "名前を付けて保存", click: () => saveAsNewFile()},
                {label: "PDF出力", click: () => exportPDF()}
            ]
        },
        {
            label: "編集",
            submenu: [
                {label: "コピー", accelerator: "CmdOrCtrl+C", role: "copy"},
                {label: "貼り付け", accelerator: "CmdOrCtrl+V", role: "paste"},
                {label: "カット", accelerator: "CmdOrCtrl+X", role: "cut"},
                {label: "すべて選択", accelerator: "CmdOrCtrl+A", role: "selectall"}
            ]
        },
        {
            label: "表示",
            submenu: [
                {
                    label: "更新",
                    accelerator: "CmdOrCtrl+R",
                    click: () => { BrowserWindow.getFocusedWindow().reload(); }
                },
                {
                    label: "デベロッパーツールの表示", 
                    accelerator: "Alt+CmdOrCtrl+I", 
                    click: () => { BrowserWindow.getFocusedWindow().toggleDevTools(); }
                }
            ]
        }
    ];

    if(process.platform === "darwin") {
        template.unshift(
            {
                label: "MarkDownEditor",
                submenu: [
                    {label: "Quit", accelerator: "CmdOrCtrl+Q", click: () => app.quit()}
                ]
            }
        );
    }

    Menu.setApplicationMenu(Menu.buildFromTemplate(menu));
}

function requestText() {
    return new Promise((resolve) => {
        BrowserWindow.getFocusedWindow().webContents.send("REQUEST_TEXT");
        //console.log("request send");
        ipcMain.once("REPLY_TEXT", (event, arg) => {
            //console.log(arg);
            resolve(arg);
        });
    });
}

function saveFile(filename, arg) {
    return new Promise((resolve) => {
        //console.log("saveFile");
        fs.writeFileSync(filename, arg, 'utf8', (err) => {
            if(err) {
                return console.log(err);
            }
        });
        currentPath = filename;
        resolve();
    });
}

function overWriteFile() {
    if(!currentPath) {
        saveAsNewFile();
        return;
    }
    requestText()
    .then((arg) => saveFile(currentPath, arg))
    .catch((err) => {
        console.log(err);
    });
}

function openFile() {
    //console.log("openFile");
    dialog.showOpenDialog(
         BrowserWindow.getFocusedWindow(),
        {
            title: "ファイルを開く",
            propertiies: ["openFile"],
            defaultPath: ".",
            filters: [
                {name: "markdown file", extensions: ["md"]},
                {name: "All Files", extensions: ["*"]}
            ]
        },
        (filename) => {
            if(filename) {
                const mdData = fs.readFileSync(filename[0], 'utf8', (err) => {
                    if(err) {
                        return console.log(err);
                    }
                });
                BrowserWindow.getFocusedWindow().webContents.send("SEND_TEXT", mdData);
                currentPath = filename[0];
            }
        }
    );
}

function saveAsNewFile() {
    //console.log("saveAsNewFile");
    dialog.showSaveDialog(
        BrowserWindow.getFocusedWindow(), 
        {
            title: "名前を付けて保存",
            filters: [
                {name: "markdown file", extensions: ["md"]},
                {name: "All Files", extensions: ["*"]}
            ]
        },
        (filename) => {
            if(filename) {
                requestText()
                .then((arg) => saveFile(filename, arg))
                .catch((err) => {
                    console.log(err);
                });
            }
        }
    );
}

function exportPDF() {
    console.log("exportPDF");
}

module.exports = () => {
    setMenu();
}