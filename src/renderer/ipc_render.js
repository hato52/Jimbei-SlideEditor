const {ipcRenderer} = require("electron");

ipcRenderer.on("REQUEST_TEXT", (event, arg) => {
    let data = document.getElementById("mdtext").value;
    ipcRenderer.send("REPLY_TEXT", data);
    //console.log("reply send");
});

ipcRenderer.on("SEND_TEXT", (event, arg) => {
    document.getElementById("mdtext").value = arg;
});