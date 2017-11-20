const {Menu, BrowserWindow} = require("electron");

function setSlideMenu() {
    const menu = [
        {
            label: "表示",
            submenu: [
                {label: "全画面表示の切り替え", accelerator: "F11", click: () => toggleFullScreen()}
            ]
        }
    ];

    if(process.platform === "darwin") {
        template.unshift(
            {
                label: "Slide",
                submenu: [
                    {label: "Quit", accelerator: "CmdOrCtrl+Q", click: () => app.quit()}
                ]
            }
        );
    }

    Menu.setApplicationMenu(Menu.buildFromTemplate(menu));
}

function toggleFullScreen() {
    let focusedWindow = BrowserWindow.getFocusedWindow();
    
    if(focusedWindow.isFullScreen()) {
        focusedWindow.setFullScreen(false);
    }else{
        focusedWindow.setFullScreen(true);
    } 
}

//module.exports = () => {
//    setSlideMenu();
//} 