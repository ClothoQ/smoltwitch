import { app, protocol, BrowserWindow } from 'electron'

import * as path from 'path'
import { format as formatUrl } from 'url'
import {
  createProtocol,
  installVueDevtools
} from 'vue-cli-plugin-electron-builder/lib'
const isDevelopment = process.env.NODE_ENV !== 'production'


if (isDevelopment) {
  require('module').globalPaths.push(process.env.NODE_MODULES_PATH)
}

let mainWindow

const ipcMain = require('electron').ipcMain;
const ipcRenderer = require('electron').ipcRenderer;

const { autoUpdater } = require("electron-updater")

protocol.registerStandardSchemes(['app'], { secure: true })

function appController(window){
    ipcMain.on('resize', function (e, x, y) {
        window.setSize(x, y);
    });

    ipcMain.on('close', function () {
        window.close()
    });

    setInterval(function() {
          window.setAlwaysOnTop(true);
    }, 2000);
}

function createMainWindow () {

  var config = require('./config.json');

  const window = new BrowserWindow({
        width:  config.screen[config.screenSelected].w,
        transparent: true,
        height: config.screen[config.screenSelected].h,
        frame:false,
        resizable:false
    })

    window.webContents.on('new-window', function(e, url) {
      e.preventDefault();
    });

  if (isDevelopment) {
    window.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) window.webContents.openDevTools()
  } else {
    createProtocol('app')
    window.loadURL(
      formatUrl({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file',
        slashes: true
      })
    )
  }

  window.on('closed', () => {
    mainWindow = null
  })

  window.webContents.on('devtools-opened', () => {
    window.focus()
    setImmediate(() => {
      window.focus()
    })
  })

  return window
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    mainWindow = createMainWindow()
  }
})

app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    await installVueDevtools()
  }
  mainWindow = createMainWindow()
  appController(mainWindow);
})
