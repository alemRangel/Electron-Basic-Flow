const { app, BrowserWindow, ipcMain } = require('electron')
const ejse = require('ejs-electron')
const async = require('async');
const fs = require('fs');
const https = require('https');
const path = require("path");
const createReadStream = require('fs').createReadStream
const sleep = require('util').promisify(setTimeout);
const aws = require("aws-sdk");
const ComputerVisionClient = require('@azure/cognitiveservices-computervision').ComputerVisionClient;
const ApiKeyCredentials = require('@azure/ms-rest-js').ApiKeyCredentials;

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
  win.loadFile("C:\\Users\\buffa\\Documents\\TrabajoErick\\Electron\\basic-flow-git\\Electron-Basic-Flow\\views\\navd.ejs")  //Después de recibir la petición, devolvemos una nueva página

 })

 ipcMain.on('computer-vision-request', async(event,arg) =>{
   console.log(`Petición a servicios de Microsoft ${arg}`);
   const key = '4e14ecb306a04d59883de139274b86b3';
   const endpoint = 'https://alemdominium.cognitiveservices.azure.com/';
   const computerVisionClient = new ComputerVisionClient(  new ApiKeyCredentials({ inHeader: { 'Ocp-Apim-Subscription-Key': key } }), endpoint);
   function computerVision() {
    async.series([
    async function () {
      //Definimos la ruta al archivo

      const imagenTextoLocalPath = "C:\\Users\\buffa\\Downloads\\Global\\Global-1.jpg"

      //Definimos códigos de status de acuerdo con la doscumentación de Microsoft
      const STATUS_SUCCEEDED = "succeeded";
      const STATUS_FAILED = "failed"

      console.log('\nRead handwritten text from local file...', imagenTextoLocalPath);
      const handwritingResult = await readTextFromFile(computerVisionClient, imagenTextoLocalPath);

      //Función que llama a la API
      async function readTextFromFile(client, localImagePath) {
       // To recognize text in a local image, replace client.read() with readTextInStream() as shown:
       let result = await client.readInStream(() => createReadStream(localImagePath));
       // Operation ID is last path segment of operationLocation (a URL)
       let operation = result.operationLocation.split('/').slice(-1)[0];

       // Wait for read recognition to complete
       // result.status is initially undefined, since it's the result of read
       while (result.status !== STATUS_SUCCEEDED) { await sleep(1000); result = await client.getReadResult(operation); }
       return result.analyzeResult.readResults; // Return the first page of result. Replace [0] with the desired page if this is a multi-page file such as .pdf or .tiff.
     }
     const resultJson = JSON.stringify(handwritingResult)
     ejse.data({respuesta:`${resultJson}`})
     win.loadFile("C:\\Users\\buffa\\Documents\\TrabajoErick\\Electron\\basic-flow-git\\Electron-Basic-Flow\\views\\microsoftapi.ejs")
     //

    },
      function () {
        return new Promise((resolve) => {
          resolve();
        })
      }
    ], (err) => {
      throw (err);
    });
    }
   computerVision();

 })

 ipcMain.on('textract-request', async(event,arg) =>{
  console.log(`Petición a servicios de Amazon ${arg}`);
  const awsAccesskeyID = "AKIA4T2NS2CKTICLPD4V";
  const awsSecretAccessKey = "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";
  const awsRegion = "us-west-2"
  function callTextract(){
    async.series([
     async function(){
      async function makeCall(file){
        const params = {
          Document: {
            /* required */
            Bytes: file
          },
          FeatureTypes: ["FORMS"]
        };
        return textract.analyzeDocument(params);
      }
      aws.config.update({
        accessKeyID: awsAccesskeyID,
        secretAccesKey: awsSecretAccessKey,
        region: awsRegion
      });
      const textract = new aws.Textract();
      const file = await fs.readFileSync("C:\\Users\\buffa\\Downloads\\Global\\Global-1.jpg");
      const request = await makeCall(file);
      const data = await request.promise();
      const dataJson = JSON.stringify(data);
      ejse.data({respuesta:`${dataJson}`})
      win.loadFile("C:\\Users\\buffa\\Documents\\TrabajoErick\\Electron\\basic-flow-git\\Electron-Basic-Flow\\views\\amazonapi.ejs")
    },
      function () {
        return new Promise((resolve) => {
          resolve();
        })
      }
    ], (err) => {
      throw (err);
    });
    }
     callTextract();
 })
