/**
 * Created by ASCll on 2017年11月22日 14:33:35
 * 
 * app.js中将只处理程序生命周期的代码，其他代码都由
 * 控制器来完成
 * render与app的交互由render中的controller执行
 * window对象的处理由window的controller执行
 * api由api控制器来执行
 */

const {app}=require('electron');
// 创建控制层
let appcontroller=require('./app/mainprocess/appcontroller').appcontroller;
appcontroller = new appcontroller();

// ready事件触发,传入窗口管理模块以及设置模块
app.once('ready',()=>{
    appcontroller.emit('app-ready');
});
app.on('window-all-closed', () => {
    //的macOS上，除非用户用Cmd+q确定的退出
    //否则绝大部分引用机器菜单栏将会保持激活
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
// 激活窗体
app.on('activate',()=>{
    appcontroller.emit('appActivate');
});
