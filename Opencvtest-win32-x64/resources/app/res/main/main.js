const {app, BrowserWindow} = require("electron");
var cv = require('opencv');

let mainWindow;

app.on("window-all-closed", () => {
    if(process.platform != 'darwin') {
        app.quit();
    }
});

app.on("ready", () => {
    mainWindow = new BrowserWindow({idth: 800, height: 600});
    mainWindow.loadURL('file://' + __dirname + '/../../index.html');
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
    test2();
});

function test() {
    console.log("this is a test");
    cv.readImage("./test.jpg", (err, im) => {
        im.detectObject(cv.FACE_CASCADE, {}, (err, faces) => {
            console.log(faces);
            for(let i=0; i<faces.length; i++) {
                let x = faces[i];
                im.ellipse(x.x + x.width/2, x.y + x.height/2, x.width/2, x.height/2);
            }
            im.save("./out.jpg");
        });
    });
}

function test2() {
    var cv = require('opencv');
    
    try {
      var camera = new cv.VideoCapture(0);
      var window = new cv.NamedWindow('Video', 0)
    
      setInterval(function() {
        camera.read(function(err, im) {
          if (err) throw err;
          console.log(im.size())
          if (im.size()[0] > 0 && im.size()[1] > 0){
            window.show(im);
          }
          window.blockingWaitKey(0, 50);
        });
      }, 20);
      
    } catch (e){
      console.log("Couldn't start camera:", e)
    }
}
