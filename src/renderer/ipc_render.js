const {ipcRenderer} = require("electron");

//ファイル保存時のテキストリクエストを受信
ipcRenderer.on("REQUEST_TEXT", (event, arg) => {
    let data = document.getElementById("mdtext").value;
    ipcRenderer.send("REPLY_TEXT", data);
    //console.log("reply send");
});

//スライド表示時のテキストリクエストを受信
ipcRenderer.on("REQUEST_SLIDETEXT_TO_MAIN", (event, arg) => {
    let data = document.getElementById("mdtext").value;
    ipcRenderer.send("REPLY_SLIDETEXT_FROM_MAIN", data);
    //console.log("reply send");
});

//ファイルを開くときのテキスト受け取り用
ipcRenderer.on("SEND_TEXT", (event, arg) => {
    document.getElementById("mdtext").value = arg;
});