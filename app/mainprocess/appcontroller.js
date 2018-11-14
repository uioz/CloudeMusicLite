// 本模块经过修改,主要功能是将
// 以下的模块,按照依赖顺序进行启动
// 并且启动是为其添加依赖

//  网络检测模块  窗口管理模块  配置设置及写入模块 进程通信模块 api模块
let { netlisteners } = require('./checknet');
let windowmanager = require('./windowmanager').windowmanager;
let settings = require('./appsetting');
let ipccontroller = require('./ipccontroller');
let musicapi=require('./musicapi');
/**
 * 为当前对象挂载事件对象
 * 为当前对象挂载对应的emit
 * 和on方法
 * @api private
 */
function event() {
    const event = require('events');
    this._e = Object.setPrototypeOf({}, event.prototype);
    this.emit = this._e.emit.bind(this._e);
    this.on = this._e.on;
}
/**
 * 为当前对象统一的挂载on处理的事件
 * @api private
 */
function emitevents() {
    let event = this._e;
    let that=this;
    event.once('app-ready', () => {
        // 注册防止多个主窗体启动事件
        settings.makeSingleInstance();
        // TODO 启动主窗体
        windowmanager.createmainwin();
    });
    event.once('windowmanager-ready', () => {
        windowmanager = new windowmanager(ipccontroller);
    });
    event.once('setting-ready', () => {
        settings = new settings(ipccontroller, windowmanager);
    });
    event.once('ipccontroller-ready', () => {
        ipccontroller = new ipccontroller();
    });
    
    event.once('checknet-ready', () => {
        netlisteners = netlisteners();
        netlisteners.once('checknet-result', (error) => {
            if (!error) {
                musicapi=new musicapi(ipccontroller);
            } else {
                windowmanager.createerrwin(error,false);
            }
            netlisteners = null;
        });
    });
    // 对于darwin系统,大部分情况下
    // 关闭app并不清除内存,所以有激活事件
    event.on('appActivate',()=>{
        windowmanager.createmainwin();
    });
}
/**
 * app和其他部件的中间层
 * 其内部对象_e是一个events对象
 * 对象调用者和对象本身都可以利用
 * _e触发事件和执行事件
 * 
 * 为了解决异步窗口管理的问题,所以使用构造函数的时候
 * 必须传入窗口管理器
 */
function controlle() {
    // 将事件对象挂载在当前对象身上
    event.call(this);
    emitevents.call(this);

    // 启动进程通信模块
    this.emit('ipccontroller-ready');
    // 启动窗口管理模块
    this.emit('windowmanager-ready');
    // 启动设置模块
    this.emit('setting-ready');
    // 启动网络检测模块控制api模块
    this.emit('checknet-ready');
}
exports.appcontroller = controlle;
