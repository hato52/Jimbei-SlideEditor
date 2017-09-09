const {ipcRenderer} = require("electron");

//開かれたときにリクエストを送る
ipcRenderer.send("REQUEST_SLIDETEXT");
ipcRenderer.send("REQUEST_OPTION");

//レスポンスをスライドに反映させる
ipcRenderer.on("SEND_SLIDETEXT", (event, arg) => {
    document.getElementById("slideText").innerHTML = arg;
});

//テーマ設定をスライドに反映させる
ipcRenderer.on("SEND_OPTION", (event, theme, anim) => {
    document.getElementById("theme").href = "css/theme/" + theme;
    document.getElementById("slideSection").setAttribute("data-transition", anim);
});