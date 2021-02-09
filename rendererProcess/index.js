const {ipcRenderer} = require('electron');
//ipcRenderer nos permite comunicarnos con el proceso principal

ipcRenderer.on('cargar-pagina', (event, arg) => { //En este caso, definimos un listener para una respuesta del proceso principal
  const message = `Asynchronous message reply: ${arg}`;
  document.getElementById("main-div").innerHTML = `<object type="text/html" data="navd.html"></object>`;

})

function send(event){
  event.preventDefault() //Evitamos que se genere la petición http
  let nombre = document.getElementById("nombre").value;  //Obtenemos el valor de nuestro texto
  ipcRenderer.send('form-listener',nombre); //Mandamos el valor de la vista al proceso principal
}

function apiMicrosoft(){
  ipcRenderer.send('computer-vision-request',"Enviado de index Html");
}

function apiAmazon(){
  ipcRenderer.send('textract-request',"Enviado de Index Html")
}
