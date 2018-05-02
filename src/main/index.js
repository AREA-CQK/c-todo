import { app, BrowserWindow, Menu, ipcMain } from 'electron'

import menu from './menu'
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`



function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000,
    frame: false,
    title: 'c! todo',
    icon: '../renderer/assets/todolist.ico'
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })

 
  //设置菜单
  Menu.setApplicationMenu(menu);
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
app.on('window-close', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})
app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
//定义页面访问的主进程事件
ipcMain.on('window-close',function(){
    mainWindow.close();
})
//登录窗口最小化
ipcMain.on('window-min',function(){
    mainWindow.minimize();
})
//登录窗口最大化
ipcMain.on('window-max',function(){
    if(mainWindow.isMaximized()){
        mainWindow.restore();
    }else{
        mainWindow.maximize();
    }
})


