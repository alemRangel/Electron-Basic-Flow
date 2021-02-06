const { app, BrowserWindow, ipcMain } = require('electron')
const ejse = require('ejs-electron')


var win;
function createWindow () {
  win = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: true
      }
    })
  win.webContents.openDevTools()
  win.loadFile('index.html')
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

ipcMain.on('asynchronous-message', (event, arg) => {
  console.log(arg) // prints "ping"
  event.reply('asynchronous-reply', 'pong')
})

ipcMain.on('synchronous-message', (event, arg) => {
  console.log(arg) // prints "ping"
  event.returnValue = 'pong'
})

ipcMain.on('form-listener', async (event, arg) => {
  console.log(`Cargando info pag, args enviados:${arg}`)
  ejse.data({nombre:`${arg}`})
  win.loadFile("C:\\Users\\buffa\\Documents\\TrabajoErick\\Electron\\basic-flow\\views\\navd.ejs")

 })
