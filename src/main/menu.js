import { Menu } from 'electron'
const menu = Menu.buildFromTemplate([
    {
        label: '新建',
        click: function () { console.log("打开")},
    },
    {
      label: '关闭',
      click: function () { mainWindow.close();console.log("关闭")},
      // submenu: [
      //   {
      //     label: 'Undo',
      //     accelerator: 'CmdOrCtrl+Z',
      //     role: 'undo'
      //   }
      // ]
    }
  ]);


export default menu;