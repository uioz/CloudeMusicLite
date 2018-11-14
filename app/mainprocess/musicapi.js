// 本文件调用网易云api,并提供一个客户端请求api
// 利用ipc,进行交互
// 鉴于渲染进程大部分都是请求api的
// 如果每一种请求都提供一个事件的话不利于维护
// 主要分为三个事件
// 1. 歌曲获取事件 2. 列表获取事件 3. 系统事件
// 前两个事件有本文件负责,后面的由其他模块例如,关闭由窗体控制器负责

// api提供https://binaryify.github.io/NeteaseCloudMusicApi/#/
const { app, port } = require('../node_modules/NeteaseCloudMusicApi/app');
const http = require('http');
const { isObject } = require('./util');
const { URL } = require('url');

/**
 * 本函数利用http.request发送请求
 * 返回将其包装成一个对象
 * 提供一个摧毁的方法和一个回调
 * 本身请求api,api实际上就是一个url
 * 变的部分就是路径和查询字符串,这部分
 * 由URL模块解决
 * 
 * **参数部分**
 * 1. pathname 接口路径
 * 2. search 查询字符串
 * 3. callback 响应后返回的对象
 * @param {String}pathname
 * @param {String}search
 * @api private
 * @returns {Object}
 */
function createrequest(pathname, search, callback) {
    let options = new URL('http://127.0.0.1:' + port);
    options.pathname = pathname;
    options.search = search;

    this.isdestory = false;
    // TODO test
    console.log(options.toString());

    // 发送请求
    this._request = http.request(options);
    this._request.end();

    // 监听事件
    this._request.once('response', (response) => {
        if (response.statusCode === 502) {
            callback('net error');
        } else {
            let Arraylist = [];
            response.on('data', (data) => {
                Arraylist.push(data);
            });
            response.once('end', () => {
                callback(null, JSON.parse(Buffer.concat(Arraylist)));
            });
        }
    });
    this._request.on('error', (error) => {
        if (!this._isdestroy) {
            callback(error);
        }
        callback = null;
    });
    this._request.once('timeout', (error) => {
        this.destroy('timeout');
    });

    // 添加摧毁的方法
    this.destroy = function (string) {
        callback(string);
        this._isdestroy = true;
        this._request.destroy();
    }
}

/**
 * 创建api接口函数,
 * 由于大部分api功能大同小异
 * 所以利用该函数同一包装各种方法
 * 例如 搜索和播放都是提供一个栈
 * 后进入的请求会销毁前一个请求
 * .换句话说类似结构的api都可以使用
 * 本函数统一创建
 * 
 * 1. name参数传入一个字符串数组
 *  - 字符串数组的每一个下标都是对象的新方法
 *  所以name数组每一个下标格式如下
 *  ['方法名称','路径字符串','查询前缀字符串']例如['searchmusicbyString','/search','keywords=']
 *  
 * 2. 调用该函数需要指定上下文
 * 
 * @param {array} parsearr
 * @api private
 */
function createApiInterface(parsearr) {
    if (!Array.isArray(parsearr)) throw Error('function createApiInterface name must be Array');

    parsearr.forEach((value, index) => {
        // value[0]方法字符串
        // value[1]查询字符串
        let pathname = value[1],
            search = value[2],
            mehodname = value[0];

        this[mehodname] = function (name = '') {
            /**
             * 内部函数
             * 将一组请求填入内部数组
             * 函数主要由requestspush调用
             * 
             * @api private
             * @param {function} resolve 
             * @param {function} reject 
             * @param {Object} oldrequest 
             */
            function requestspush(resolve, reject, requests) {
                requests.push([name, new createrequest(pathname, search + name, (error, json) => {
                    if (!error) {
                        resolve(json);
                    } else {
                        reject(error);
                    }
                    // 执行完成后将从数组中删除
                    requests.shift();
                })]);
            }
            let that = this;
            return new Promise((resolve, reject) => {
                // 如果第一次执行,为其添加一个请求栈
                if (!that['_' + pathname]) that['_' + pathname] = [];
                let requests = that['_' + pathname];
                if (requests.length == 0) {
                    requestspush(resolve, reject, requests);
                } else {
                    // 如果连续触发search
                    // 不一样的name请求才会执行
                    let oldname = requests[0][0];
                    if (oldname !== name) {
                        // 把旧请求摧毁
                        requests[0][1].destroy('destroy');
                        requests.shift();
                        // 填入新请求
                        requestspush(resolve, reject, requests);
                    }
                }
            });
        };
    });
}

/**
 * api构造函数,使用前请new
 * 提供了各种方法,用于获取信息
 * 调用方法并没有返回值,其内部会使用
 * ipc将获取到的值返回给页面
 * @param {Object} ipc 
 */
function api(ipc) {
    if (!isObject(ipc)) throw Error('Error:function api param ipc must be Object!');
    this._ipc = ipc;

    // 挂载事件
    let apiinterfacelist = ['searchmusicbyString'];
    createApiInterface.call(this, [
        ['search', '/search', 'keywords='],
        ['geturl', '/music/url', 'id='],
        ['getlyrics', '/lyric', 'id='],
        ['getrecommendlist', '/personalized', ''],
        ['getnewsong', '/personalized/newsong', ''],
        ['getnewdisc', '/top/album', 'limit=10',]
    ]);
    // 挂载api事件
    this.eventRegister();
};
/**
 * 注册api管辖内的所有事件
 */
api.prototype.eventRegister = function () {
    this._ipc.on('getswipercontentbypage', (event, pageid, paramarrays) => {
        /**
         * 本函数是多个请求异步发送函数
         * 相较于之前的版本,对传入的参数有了严格的要求
         * params接收如下格式
         * [[swiperid,请求方法名称,[参数]]...]
         * 参数可以没有
         * 而返回请求的格式为
         * (页面主id,swiperid,结果)
         * @param {array} params
         * @param {string} pageid
         * @param {string} methodname
         */
        let _process = (params, pageid, methodname)=>{
            params.forEach((value) => {
                if (!value[2]) value[2] = '';
                this[value[1]](value[2]).then((result) => {
                    event.sender.send(methodname, pageid, value[0], result);
                }).catch((result) => {
                    event.sender.send(methodname, pageid, value[0], result);
                });
            });
        };
        switch (pageid) {
            case 'homepage':
                _process(paramarrays, pageid, 'setswipercontentbymusicapi')
                break;
        }
    });
}

module.exports = api;

