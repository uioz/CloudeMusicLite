// 本模块检测网络是否联通
// 对外使用事件进行联通
// 提供网络网络监听事件
// 提供停止监听方法
// 提供启动监听的方法

// 使用netlisteners返回的是一个事件对象,这样在可以后面直接使用.on
// 下面变量是保存请求对象,是一个单例
let requestobj = undefined;
let intervalid = undefined;
const http = require('http');
const options = {
    hostname: 'music.163.com',
    port: 80,
    path: '/',
    method: 'GET',
    headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Encoding': 'gzip,deflate,sdch',
        'Accept-Language': 'zh-CN, zh;q=0.8',
        'Cache-Control': 'no-cache',
        'Host': 'music.163.com',
        'Pragma': 'no-cache',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36(KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36'
    }
};
/**
 * 将请求对象挂载到returnrequest对象身上
 * 
 * 在请求成功和失败两种状态之中触发事件
 * @param {object} obj 
 * @api private
 */
function createrequest(obj) {
    obj._request = http.request(options, (response) => {
        //用于将响应的数据消耗完成 
        response.on('data',(data)=>{
            data=null;
        });

        // 实际上这个回调就是request.response事件
        if (response.statusCode == 200)
            obj.emit('result', 'networknormal');
        else
            obj.emit('result', 'networkerror');
    });
    obj._request.on('error', (error) => {
        obj.emit('error', error);
    });
    obj._request.on('timeout', () => {
        obj.emit('error', 'timeout');
    });
    // 超时5秒后错误
    obj._request.setTimeout(5000);
    obj._request.end();
}
/**
 * 将request触发的正确也好,
 * 错误也好,进行处理,然后对外部
 * 暴露一个事件展示结果,需要传入
 * returnrequest对象
 * @param {Object} obj 
 */
function listening(obj){
    obj.on('result', (result) => {
        switch (result) {
            case 'networknormal':
                // TODO 调用网易云API
                obj.emit('checknet-result',null);
                break;
            case 'networkerror':
                // 连接成功但是返回的状态码错误
                obj.testing();
                break;
        }
    });
    obj.on('error', (error) => {
        switch (true) {
            case error === 'timeout':
                // 连接超时
                obj.testing();
                break;
            case error.toString().indexOf('ETIMEDOUT') !== -1:
                // 有时候request对象一次会触发两个事件
                // 一个用户自定义的timeout事件,如果多次超时
                // 还会返回一个系统级别的timeout事件,所以不可以笼统
                // 的在所有的request意外错误中清空变量引用
                obj.testing();
                break;
            default:
                obj.emit('checknet-result', error);
                break;
        }
    });
}


/**
 * 构造一个对象,内部挂载了事件和请求
 * @api private
 */
function returnrequest() {
    const events = require('events');
    // 挂载事件对象
    Object.assign(Object.getPrototypeOf(this), events.prototype);
    // 挂载事件处理方法
    listening(this);
    // 挂载请求对象以及触发事件
    createrequest(this);
    // 请求对象挂载到全局
    requestobj = this;
}
/**
 * 这个方法用在网络连接失败,但是
 * 用户可以可修复的情况下调用,
 * 他会每隔5秒请求服务器,直到连接完成
 */
returnrequest.prototype.testing = function () {
    // 如果intervalid为undeinfed则说明
    // 前一个interval执行完了或者第一次执行
    // 实际上根本不用担心intervalid会被覆盖
    // 因为调用这个事件前网络的响应还有延迟
    // 改变request对象后就清空id了即使在高速
    // 的网络也不上代码的速度
    if (intervalid === undefined) {
        intervalid = setTimeout(() => {
            createrequest(this);
            intervalid = undefined;
        }, 5000);
    }
}

/**
 * 网络检测模块的构造器,保证永远只会返回一个实例
 * 
 * 返回的对象有如下事件
 * 
 * 1. result 其回调结果如下
 *  - networknormal 网络正常
 *  - networkerror 网络返回错误响应
 * 2. error 其回调结果如下
 *  - timeout 网络超时
 *  - 其他,即请求对象本身的错误
 * 3. testing 方法
 * 
 *  **这个方法主要应用在用户可修复网络
 *  情况下调用(例如:断网),其内部连续发送
 *  请求,为了防止内存泄漏请在result事件后
 *  调用模块的destorytesting方法**
 * @return {object}
 */
function netlisteners() {
    // 保证同时只有一个请求对象
    if (!!requestobj) {
        return requestobj;
    } else {
        return new returnrequest;
    }
}
/**
 * 这个函数主要是用来清除改写对象内部的testing
 * 让其没有效果
 * 和清空内部的连续监听
 */
function destorylistening() {
    requestobj = null;
    // 清空连续调用
    if (intervalid !== undefined) {
        clearTimeout(intervalid);
        intervalid = null;
    }
}

module.exports = {
    netlisteners: netlisteners,
    destorylistening: destorylistening
}