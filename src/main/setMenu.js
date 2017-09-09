const {Menu, BrowserWindow, dialog, ipcMain} = require("electron");
const fs = require("fs");
const setSlideMenu = require("./setSlideMenu.js");

let currentPath;
let slideWindow;
let optionWindow;
let pdfWindow;

//スライドテキストをスライドウィンドウに送信する
ipcMain.on("REPLY_SLIDETEXT_FROM_MAIN", (event, arg) => {
    slideWindow.webContents.send("SEND_SLIDETEXT", arg);
});

//オプションをスライドウィンドウに送信する
ipcMain.on("REQUEST_OPTION", (event, arg) => {
    let option = JSON.parse(fs.readFileSync( __dirname + '/../../option.json', 'utf8', (err) => {
        if (err) {
            return console.log(err);
        }
    }));
    slideWindow.webContents.send("SEND_OPTION", option.theme, option.animation);
});

//現在のオプションをオプションウィンドウに送信する
ipcMain.on("REQUEST_NOW_OPTION", (event, arg) => {
    let option = JSON.parse(fs.readFileSync( __dirname + '/../../option.json', 'utf8', (err) => {
        if (err) {
            return console.log(err);
        }
    }));
    optionWindow.webContents.send("SEND_NOW_OPTION", option.theme, option.animation);
});

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
                {label: "スライドの表示", accelerator: "F5", click: () => showSlide()},
                {label: "全画面表示の切り替え", accelerator: "F11", click: () => toggleFullScreen()},
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
        },
        {
            label: "設定",
            submenu: [
                {label: "テーマ設定", accelerator: "CmdOrCtrl+Alt+O", click: () => showOption()}
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

function showOption() {
    optionWindow = new BrowserWindow({
        width: 300,
        height: 300,
        /*webPreferences: {
            nodeIntegration: false
        }*/
    });
    optionWindow.setMenuBarVisibility(false);
    optionWindow.loadURL('file://' + __dirname + "/../../option.html");
    optionWindow.on('closed', () => {
        optionWindow = null;
    });
}

function toggleFullScreen() {
    let focusedWindow = BrowserWindow.getFocusedWindow();

    if(focusedWindow.isFullScreen()) {
        focusedWindow.setMenuBarVisibility(true);
        focusedWindow.setFullScreen(false);
    }else{
        focusedWindow.setMenuBarVisibility(false);
        focusedWindow.setFullScreen(true);
    }
}

function showSlide() {
    slideWindow = new BrowserWindow({
        width: 800, 
        height: 600,
        //webPreferences: {
        //    nodeIntegration: false
        //}
    });
    slideWindow.loadURL('file://' + __dirname + "/../../lib/reveal/index.html");
    slideWindow.on('closed', () => {
        slideWindow = null;
    });
}

function requestText() {
    return new Promise((resolve) => {
        BrowserWindow.getFocusedWindow().webContents.send("REQUEST_TEXT");
        console.log("request send");
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

function savePDF(filename, pdf) {
    return new Promise((resolve) => {
        fs.writeFileSync(filename, pdf, 'utf8', (err) => {
            if(err) {
                return console.log(err);
            }
        });
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
                {name: "markdownファイル", extensions: ["md"]},
                {name: "全てのファイル", extensions: ["*"]}
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
    console.log("export PDF");
    slideWindow = new BrowserWindow({width: 800, height: 600});
    slideWindow.loadURL('file://' + __dirname + "/../../lib/reveal/index.html?print-pdf/");

    slideWindow.webContents.on("did-finish-load", () => {
        console.log("finish load pdf window");
        slideWindow.webContents.printToPDF({}, (err, pdf) => {
            if (err) {
                return console.log(err);
            }
            dialog.showSaveDialog(
                BrowserWindow.getFocusedWindow(),
                {
                    title: "PDF形式で保存",
                    filters: [
                        {name: "PDFファイル", extensions: ["pdf"]}
                    ]
                },
                (filename) => {
                    if(filename) {
                        savePDF(filename, pdf)
                        .then(() => {
                            slideWindow.close();
                        })
                        .then(() => {
                            console.log("close pdf window");
                        })
                    }
                }
            );
        });
    });
    //console.log("exportPDF");
}

module.exports = () => {
    setMenu();
}