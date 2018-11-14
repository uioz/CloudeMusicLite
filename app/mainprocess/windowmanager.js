// 本文件处理窗口对象
// 对于这个应用来说目前只有一个窗口
// 需要管理以下几项功能
// 主窗体的创建和关闭
// 窗体可能的控制
// 模态框的管理
// 需要注意的一点
// 文件系统报错的时候有可能主窗体没有创建
// 有如下规则
// 1 如果创建了主窗体,冻结主窗体,弹出错误模态框
// 2 如果没有主窗体直接创建一个窗体报错,并且拦截
// 异步的创建主窗体操作,这两个窗体的样式一致
const { isObject, isFunction } = require('./util.js');
const { join: pathjoin } = require('path');
const { BrowserWindow } = require('electron');
// 提供两个全局变量用来保存窗体
let mainwin = undefined, child = undefined, ismax = false;
/**
 * 调用窗口管理器的时候
 * 需要传入ipc通信模块
 * 以便报错时候和弹出的
 * 模态框进行通信
 * @param {Object} ipccontroller
 */
function windowmanager(ipccontroller) {
    if (isObject(ipccontroller)) {
        this._ipc = ipccontroller;
        // 设置关闭
        // 缩小,放大,缩放等方法
        this.showwindow = showwindow;
    } else {
        throw Error('Error:constructor windowmanager param ipccontroller must Object!');
    }
    eventregister.call(this);
}
/**
 * 统一注册窗口事件
 * 调用需要改变上下文
 */
function eventregister() {
    let that = this;
    // 关闭事件触发,目前触发条件只有点击关闭按钮
    this._ipc.on('appclose', () => {
        that.closewin('all');
    });
    this._ipc.on('appmaxbybutton', () => {
        that.togglewinmax();
    });
    this._ipc.on('appminbybutton', () => {
        that.winmin();
    });

}

/**
 * 该函数让隐藏的主窗体显示出来
 * 并获取焦点
 * 可能用到的地方
 * 
 * 1. 防止创建多个主窗体实例,将第一个打开的窗体显示出来
 */
function showwindow() {
    if (mainwin) {
        if (mainwin.isMinimized()) mainwin.restore();
        mainwin.focus();
    }
}

/**
 * 本函数用向windowmanager挂载
 * 窗口对象和错误窗口对象
 * 1. type 参数
 *  - 传入'main'创建主窗口
 *  - 传入'nomainerr'创建没有主窗口的错误窗口
 *  - 传入'hasmainerr'创建有主窗口的错误窗口
 * 2. isharderror 参数(默认true)
 * 对于一个错误窗口有两种情况,一种是强制退出true
 * 另外一种是确认错误后不退出,分别对应两种false
 * html文件,所以需要分别处理
 * 
 * @param {String} type 
 * @api private
 */
function createWindows(type) {
    let obj = {
        frame: false,
        show: false,
        resizable: true,
    }
    // 使用箭头函数,指向正确的this,因为当前上下文已经被改写过了
    const childset = () => {
        child.loadURL(pathjoin(__dirname, '..', 'renderprocess', 'error.html'));
        this.destroycreatewin();
        // 阻止关闭窗口,迫使用户使用确定退出
        child.on('close', (event) => { event.preventDefault() });
    }
    switch (type) {
        case 'main':
            Object.assign(obj, {
                width: 1200,
                height: 675,
                minHeight:675,
                maxHeight:675,
                minWidth: 552,
                maxWidth: 1200,
                resizable: true,
                show: false
            });
            this.win = new BrowserWindow(obj);
            this.win.loadURL(pathjoin(__dirname, '..', 'renderprocess', 'index.html'));
            this.win.webContents.openDevTools();
            mainwin = this.win;
            // TODO 启动开发者工具
            return;
            break;
        case 'nomainerr':
            Object.assign(obj, {
                width: 360,
                height: 180,
            });
            child = new BrowserWindow(obj);
            // TODO 打开开发者控制台
            child.webContents.openDevTools();
            childset();
            return;
            break;
        case 'hasmainerr':
            Object.assign(obj, {
                width: 360,
                height: 180,
                parent: mainwin,
                modal: true
            });
            child = new BrowserWindow(obj);
            childset();
            return;
            break;
    }
}

/**
 * 用于设置错误窗口的各种事件
 * 渲染一个子窗体完成后,向子窗体
 * 发送信息等待子窗体响应后在显示子窗体
 * @api private
 */
function seterrwindow(message, isharderror) {
    this._ipc.once('errorwindow-ready', (event) => {
        event.returnValue = {
            type: 'error',
            message: message,
            isharderror: isharderror
        };
    });
    child.once('ready-to-show', () => {
        // TODO 向子窗口发送错误信息
        // 子窗口获取信息渲染完成后,提供一个回调,在显示窗口
        child.show();
    });
}

/**
 * 用于设置主窗口的各种事件
 * 和各种设置
 * 利用主窗体的ready-to-show事件
 * 向主进程的appcontroller发送时间
 * 
 * @api private
 */
function setmainwindow() {
    mainwin.once('ready-to-show', () => {
        mainwin.show();
    });
}

/**
 * 创建窗体函数,可以创建的窗体有
 * 主窗体和错误窗体,而这个判断由
 * 传入的参数判断,该参数是boolean
 * 
 * 该函数是内部函数,该函数是一个闭包
 * 返回正真的创建窗体函数
 * @param {boolean} errwin 
 * @return {function}
 * @api private
 */
function createwindow(errwin = false) {
    return function (message = undefined, isharderror = true) {
        if (!errwin) {
            createWindows.call(this, 'main');
            // 初始化主窗口
            setmainwindow();
        } else {
            // 创建错误窗口
            // 如果主窗体已经创建
            if (isObject(mainwin)) {
                createWindows.call(this, 'hasmainerr');
                seterrwindow.call(this, message, isharderror);
            } else {
                createWindows.call(this, 'nomainerr');
                seterrwindow.call(this, message, isharderror);
            }
        }
    }
}
/**
 * 用于摧毁创建窗体的方法
 * 这个方法用在错误提示框出现后
 * 该函数将创建函数设置为一个没有效果的函数
 */
function destroycreatewin() {
    this.createmainwin = function () { }
}
/**
 * 本方法清空变量引用
 * 类似于closewin
 * 需要传递一个参数type
 * 可能的值有all mainwin childwin
 * @param {string} type
 * 
 */
function destroy(type) {
    switch (type) {
        case 'all':
            mainwin = null,
                child = null,
                this.win = null
            break;
        case 'mainwin':
            mainwin = null;
            this.win = null;
            break;
        case 'childwin':
            child = null;
            break;
    }
}

/**
 * 返回窗口的大小，本质调用窗口的getSize()方法
 */
function getwinsize() {
    return this.win.getSize();
}
/**
 * 设置打开二级列表的大小
 * 本质是调用窗口的setSize()
 */
function openlistmenu() {
    this.win.setSize(1200, 675, true);
}
/**
 * 设置关闭二级列表的大小
 * 本质是调用窗口的setSize()
 */
function closelistmenu() {
    this.win.setSize(552, 675, true);
}
/**
 * 关闭窗口并清空引用(调用destroy方法)
 * 需要一个参数type
 * 可能的值为all mainwin childwin
 * 对应的效果是
 * 关闭全部窗口关闭主窗口关闭模态框
 * @param {string} type 
 */
function closewin(type) {
    if (typeof type !== 'string') throw Error('Error function closewin type must be string');
    switch (type) {
        case 'all':
            if (isObject(child)) child.destroy();
            if (isObject(mainwin)) mainwin.destroy();
            break;
        case 'mainwin':
            if (isObject(mainwin)) mainwin.destroy();
            break;
        case 'childwin':
            if (isObject(child)) child.destroy();
            break;
    }
    this.destroy(type);
}
/**
 * 全屏窗体函数
 */
function togglewinmax() {
    if (ismax) {
        this.win.unmaximize();// 还原
        ismax = false;
    }
    else {
        this.win.maximize();// 全屏
        this.win.center();
        ismax = true;
    }
}
/**
 * 最小化窗体函数
 */
function winmin() {
    this.win.minimize();
}
windowmanager.prototype.togglewinmax = togglewinmax;
windowmanager.prototype.winmin = winmin;
windowmanager.prototype.createmainwin = createwindow()
/**
 * 创建一个错误窗体需要传入参数
 * 1. message 错误信息 默认undefined
 * 2. isharderror 是否为致命错误 默认为true
 *  - 如果是致命错误弹出窗体后,点击确认全体退出
 *  - 如果不是致命错误,可以继续运行主进程
 * 3. ipc 获取和子窗体对话的机制 (必须传入)
 * 
 * 在创建完成子窗体后并不会立即显示,使用ipc和子窗体通信
 * 并把错误信息发送过去,等待子窗体ipc响应后,调用child.show()
 * 这样做的目的是,子窗体会一并显示错误信息
 */
windowmanager.prototype.createerrwin = createwindow('createerrwin');
windowmanager.prototype.destroycreatewin = destroycreatewin;
windowmanager.prototype.destroy = destroy;
windowmanager.prototype.closewin = closewin;
windowmanager.prototype.openlistmenu = openlistmenu;
windowmanager.prototype.closelistmenu = closelistmenu;
windowmanager.prototype.getwinsize = getwinsize;
module.exports = {
    windowmanager: windowmanager
}