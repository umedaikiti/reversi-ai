var app           = require('app');
var BrowserWindow = require('browser-window');
var mainWindow    = null;
var subWindow     = null;

app.on('ready', function () {
  mainWindow = new BrowserWindow({
//	useContentSize: true,
	resizable: false,
	x: 0,
    width: 640,
    height: 640
  });
  mainWindow.loadURL('file://' + __dirname + '/index.html');
  subWindow = new BrowserWindow({
    x: 0,
	y: 0,
    width: 350,
    height: 400
  });
  subWindow.loadURL('file://' + __dirname + '/info.html');
  mainWindow.on('close', function(){
	if(subWindow !== null){
		subWindow.close();
	}
  });
  mainWindow.on('closed', function(){
    mainWindow = null;
  });
  subWindow.on('closed', function(){
    subWindow = null;
    global.subWindow = null;
  });
  global.subWindow = subWindow;
});
