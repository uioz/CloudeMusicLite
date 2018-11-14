// 本模块主要管理应用的默认设置
//  1. app启动的时候启动基本设置
//  - 常规的设置,例如不可以同时创建多个窗口实例,电源的管理
//  - 基础的默认设置,例如字体大小,启动使用默认,数据库加载完成后,在改为用户设置
// 2. config文件加载完成后传入的用户设置
// 3. 对于用户可以更改的设置,写入数据库

// 修改以前的策略,改变成主窗体启动后主动获取内容
// 而且所有的内容都依赖渲染进程唤醒
// 但是一旦模块启动后就会获取信息,期间可能会有如下情况
// 1. 请求进入前还未获取到内容
// 2. 请求进入后发现内容已经获取
// - 解决思路 策略1
// 1. 请求(on事件有ready-to-show触发)进入的时候判断
// 利用全局flag,是否获取到了所有的内容
// 如果没有获取到内容将向ipc注册一个发送事件使用once
// 后续异步的内容执行时候进行判断
// 是否(ipc)注册了我需要的事件,
// 如果有调用,然后将数据挂载到全局
// 如果没有,将忽略,把数据挂载到全局
// 策略2
// 在渲染进程的close中关闭前判断是那种类型的系统,
// 如果是macos将缓存信息,发送到主进程中将本文件的
// flag覆盖,第二次打开的时候直接获取信息
// 第二次打开的情况下,会遵循策略1
const { isObject } = require('./util');
const { app, powerSaveBlocker } = require('electron');
let getconfig = require('./checksystem').checkconfig();
const flag = {
    powerSaveBlockerid: 0,
    confignedb: false,
    configrebuild: false,
    configresult: []
}

// 给mac缓存用
let maccatche = {};
/**
 * 配置文件模块,需要传入
 * 两个参数
 *  - ipccontroller 用来和渲染进程通信
 *  - windowmanager 用来配置读写报错
 * @param {Object} ipc 
 * @param {Object} win 
 */
function settings(ipc, win) {
    if (isObject(ipc) && isObject(win)) {
        this._app = app;
        this._power = powerSaveBlocker;
        this._ipc = ipc;
        this._windowmanager = win;
        // 启动配置文件检测
        this.getconfig();
        // 注册事件
        eventregister.call(this);
    } else {
        throw Error('Error:Constructor settings param ipc and win must Object!');
    }
}
/**
 * 处理ipc事件时候使用,此处使用策略1
 * 调用需要改变上下文
 */
function eventregister() {
    this._ipc.on('neednedbresult', (event) => {
        // 如果数据库获取早于窗体创建
        if (checkresult()) {
            // TODO 使用event返回结果
            // mac 先判断是否有缓存
            if (Array.prototype.slice.call(maccatche).length != 0)
                event.sender.send('nedbresultbymain',[maccatche]);
            else
                event.sender.send('nedbresultbymain',flag.configresult);
        } else {
            // 用来等待结果的监听器,只会执行一次
            // mac 对于连续触发neednedbresult事件的系统，这个分支也只会走一次
            // 因为无论数据获取成功还是失败，flag.configresult都会有结果，checkconfig()函数都就不执行else分支
            this._ipc.once('waitnedbresult', (result) => {
                event.sender.send('nedbresultbymain',result);
            });
        }
    });
}
/**
 * 该函数用于检测数据库是否正确的获取到了数据
 */
function checkresult() {
    if (isObject(flag.configresult[0]))
        return true;
    else
        return false;
}

/**
 * 数据库检测模块
 * 调用checksystem.js.checkconfig()
 */
settings.prototype.getconfig = function () {
    let that = this;
    getconfig.then((result) => {
        // _id:"7K..
        setconfigforflag.call(this,result);
        // 如果数据库获取数据在窗体创建后,则激活已经挂载的事件
        if (that._ipc.eventNames().includes('waitnedbresult'))
            that._ipc.emit('waitnedbresult', flag.configresult);
    }).catch((err) => {
        flag.configresult = [{ type: 'error' }];
        // 如果数据库获取数据在窗体创建后,则激活已经挂载的事件
        if (that._ipc.eventNames().includes('waitnedbresult'))
            that._ipc.emit('waitnedbresult', flag.configresult);
        /**
         * !!如果同时启动两个应用程序,由于异步的原因,后启动的窗体可能
         * 会先于防止启动两个应用程序的事件响应前启动数据检测,那么第二
         * 个应用程序可能会弹出一个错误窗体,不过不用担心,防止多启动的
         * 函数使用app.quit();会将整个应用停止掉
         */
        this._windowmanager.createerrwin(err, false);
    });
}

/**
 * 内部函数,负责将数据库获取到的配置
 * 挂载到全局,使用call改变上下文执行
 * @param {Array} result 
 * @api private
 */
function setconfigforflag(result) {
    switch (result[0].length) {
        case 1:
            this.setconfignedb(result[1]);
            this.setconfigresult(result[0], false);
            break;
        case 2:
            this.setconfignedb(result[1]);
            this.setconfigresult(result[0], true);
            break;
    }
}

/**
 * 直接调用启动默认设置
 * 此函数包括了两种电源设置的方式
 * 把电源管理字符参数传入,这种方式
 * 是数据库读取模式并设置
 * 第二个参数传入是写入模式并设置
 * 
 * @param {Object} setting 
 * @param {String} userset
 */
settings.prototype.powerset = function () {
    if (isObject(arguments[0])) {
        flag.powerSaveBlockerid = setting.start('prevent-app-suspension');
    } else {
        // TODO 如果不是obj那就是用户设置或者就是配置文件传入,传入字符串就可以了
        // 写入数据库,改变设置
        if (arguments.length == 2) {
            // TODO 写入数据库
            this._power.stop(flag.powerSaveBlockerid);
            flag.powerSaveBlockerid = this._power.start(setting);
        } else {
            // 这个分支是给配置加载使用的
            this._power.stop(flag.powerSaveBlockerid);
            flag.powerSaveBlockerid = this._power.start(setting);
        }
    }
}
/**
 * 本函数保证本应用的实例实例只有一个
 * 
 * 主要是向app注册了makeSingleInstance
 * @param {Object} app 
 * @param {Object} windowmanager 
 */
settings.prototype.makeSingleInstance = function () {
    const shoudQuit = this._app.makeSingleInstance((commandLine, workingDirectory) => {
        this._windowmanager.showwindow();
    });
    if (shoudQuit) {
        this._app.exit(0);
    }
}
/**
 * 用于向flag对象添加属性的函数
 * @param {object} nedb
 */
settings.prototype.setconfignedb = function (nedb) {
    // setting只会调用这么一次
    if (!flag.confignedb && isObject(nedb)) {
        flag.confignedb = nedb;

        // TODO 设置内容,写入数据库中
        // 重构,将配置文件读写,写入setting中
    }
}
/**
 * 本函数返回内部的打开配置文件的
 * nedb对象,没有返回false
 */
settings.prototype.getconfignedb = function () {
    if (isObject(flag.confignedb))
        return flag.confignedb;
    else
        return false;
}
/**
 * 本函数用于将配置文件的结果传入
 * 返回settings对象本身
 * @param {Array} result 
 * @param {boolean} rebuild 
 * @returns {Object}
 */
settings.prototype.setconfigresult = function (result, isrebuild) {
    flag.rebuild = isrebuild;
    flag.configresult = result;
    return this;
}
module.exports = settings;