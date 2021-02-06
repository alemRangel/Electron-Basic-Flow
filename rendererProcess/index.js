const {ipcRenderer} = require('electron');


ipcRenderer.on('cargar-pagina', (event, arg) => {
  const message = `Asynchronous message reply: ${arg}`;
  document.getElementById("main-div").innerHTML = `<object type="text/html" data="navd.html"></object>`;

})

function send(event){
  event.preventDefault()
  let nombre = document.getElementById("nombre").value;
  ipcRenderer.send('form-listener',nombre);
}
