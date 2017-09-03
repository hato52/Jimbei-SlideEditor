const {ipcRenderer} = require("electron");

//開かれたときにリクエストを送る
ipcRenderer.send("REQUEST_SLIDETEXT");

//レスポンスをスライドに反映させる
ipcRenderer.on("SEND_SLIDETEXT", (event, arg) => {
    document.getElementById("slideText").innerHTML = arg;
});