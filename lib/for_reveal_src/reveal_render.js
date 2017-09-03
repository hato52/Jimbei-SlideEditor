const {ipcRenderer} = require("electron");

ipcRenderer.send("REQUEST_SLIDETEXT");

ipcRenderer.on("SEND_SLIDETEXT", (event, arg) => {
    document.getElementById("slideText").innerHTML = arg;
});