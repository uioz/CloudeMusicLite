// 本文件利用ipcMain来与渲染页面进行交互
// 对象也是event的实例
// 负责
// 1. 接受页面的所有响应,寻找合适的控制器
// 使用内部的event触发,在appcontroller利用已经
// 监听的事件进行操作
// 2. 将所有的逻辑代码写入ipc中,ipc内部触发时事件的时候
// 想其传入一个对象,对象有对应的方法,这样监听方可以利用
// 这个方法向ipc内部传入需要的变量

// 主要分为三个事件
// 1.api事件 2. 系统事件
// api事件由api负责
// 系统事件,由其他引用本模块的模块负责

const { isObject } = require('./util');

// 单例判断标志
let myipc = undefined;
/**
 * 为当前对象挂载事件对象
 * 为当前对象挂载对应的emit
 * 和on方法
 * @api private
 */
function event() {
    let event = require('events');
    this.__proto__ = Object.setPrototypeOf({}, event.prototype);
    event = null;
}

/**
 * 该函数返回一个ipc对象
 * 
 * 该对象是单例模式
 * 该对象是event的实例
 * @returns {Object}
 */
function createipc() {
    if (!isObject(myipc)) {

        // 挂载内部事件对象
        event.call(this);

        // 挂载ipcmain对象
        let { ipcMain } = require('electron');
        this.ipcMain = ipcMain;

        // 统一注册事件
        registerevents.call(this);
        myipc = this;
    } else {
        return myipc;
    }
}
/**
 * 本函数注册内部的事件
 */
function registerevents() {
    // !!需要注意的是使用on监听事件的时候必须指定上下文为events
    let that = this;

    // 这个事件是错误窗口未发出ready-to-show之前的事件
    // 利用这个可以提前更改错误错误窗体内部的样式与内容
    // 不过这个是同步返回的版本，如果异步有可能页面已经
    // 显示出来后才更改窗体内容
    this.ipcMain.on('errorwindow-ready', (event) => {
        that.emit('errorwindow-ready', event);
    });
    this.ipcMain.on('buttonsgroupevent', (event, type) => {
        switch (type) {
            case 'close':
                that.emit('appclose');
                break;
            case 'max':
                that.emit('appmaxbybutton');
                break;
            case 'min':
                that.emit('appminbybutton');
                break;
        }
    });
    this.ipcMain.on('neednedbresult', (event) => {
        that.emit('neednedbresult', event);
    });
    // 转发页面轮播图数据获取
    this.ipcMain.on('getswipercontentbypage', (event,flag,result) => {
        that.emit('getswipercontentbypage', event,flag,result);
    });
    // TODO test
    // this.ipcMain.on('needStartInfomration',(event)=>{
    //     that.emit('needStartInfomration',event);
    // });
}

module.exports = createipc;