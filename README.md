# Electron-Basic-Flow
Describe un flow básico de navegación en Electron

Install

npm install

Main.js

En este archivo, definimos el proceso principal. Es necesario importar los módulos app, BrowserWindow e ipcMain. El primero lleva el flujo principal de la app(como en una app de node), el segundo abre una ventana en esa app y el tercero nos permite comunicarnos con las vistas durante la ejecución de la aplicación.

Al definir las funciones ipcMain.on(), definimos listeners que escuchen por determinadas acciones que vienen de las vistas a partir de ipcRenderer(). Se sigue un flujo de:
 vista -> ipcRenderer -> ipcMain
 y en la respuesta puede ser el proceso inverso, o podemos cargar una nueva vista a la BrowserWindow.

 En este ejemplo, los procesos de ipcRenderer están en el archivo rendererProcess/index.js, pero cualquier archivo js que requiera el módulo ipcRenderer puede hacer estas funciones(sin embargo, es recomendable tener uno solo que haga esa comunicación).
