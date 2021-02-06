const { app, BrowserWindow, ipcMain } = require('electron')
const ejse = require('ejs-electron')


var win;  //La variable win es la que define la ventana donde se abre la app
function createWindow () {
  win = new BrowserWindow({  //El método BrowserWindow define el tamaño y las propiedades particulares de la ventana
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: true
      }
    })
  win.webContents.openDevTools()  //Con este método, podemos ver la consola de chrome(hacia el html y js) de nuestro proyecto de Electron
  win.loadFile('index.html')  //Con el método LoadFile cargamos el archivo html con el que se va a desplegar la app
}

app.whenReady().then(createWindow)  //Cuando estén cargados los recursos, llama a createWindow

app.on('window-all-closed', () => { //Detiene el proceso de la app cuando se cierre la ventana
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

ipcMain.on('asynchronous-message', (event, arg) => {  //ipcMain recibe mensajes de las pantallas y devuelve una respuesta
  console.log(arg) // prints "ping"
  event.reply('asynchronous-reply', 'pong')
})

ipcMain.on('synchronous-message', (event, arg) => {
  console.log(arg) // prints "ping"
  event.returnValue = 'pong'
})

ipcMain.on('form-listener', async (event, arg) => {  //Recibimos un evento y uno (o muchos) argumentos. Procesamos lo que se necesite y cargamos una nueva vista.
  console.log(`Cargando info pag, args enviados:${arg}`)
  ejse.data({nombre:`${arg}`})  //Definimos valores de EJS para hacerlos visibles en la vista
  win.loadFile("C:\\Users\\buffa\\Documents\\TrabajoErick\\Electron\\basic-flow\\views\\navd.ejs")  //Después de recibir la petición, devolvemos una nueva página

 })
