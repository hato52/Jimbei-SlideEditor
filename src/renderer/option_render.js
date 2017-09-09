const {remote, ipcRenderer} = nodeRequire("electron");

new Vue({
    el: "#option-button",
    methods: {
        apply: () => {
            let selectTheme = document.getElementById("select_theme").value;
            let selectAnimation = document.getElementById("select_anim").value;
            ipcRenderer.send("SEND_SELECTED_OPTION", selectTheme, selectAnimation);
            remote.getCurrentWindow().close();
        },
        cancel: () => {
            remote.getCurrentWindow().close();
        }
    }
})

ipcRenderer.send("REQUEST_NOW_OPTION");

ipcRenderer.on("SEND_NOW_OPTION", (event, theme, anim) => {
    selectOption(document.getElementById("select_theme"), theme);
    selectOption(document.getElementById("select_anim"), anim);
});

function selectOption(obj, value) {
    for(let i=0; i<obj.length; i++) {
        if(obj[i].value == value) {
            obj[i].selected = true;
            return;
        }
    }
}