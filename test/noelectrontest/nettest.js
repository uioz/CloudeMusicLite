// 本文件主要测试checknet.js模块
let { netlisteners } = require('./checknet');
// netlisteners=netlisteners();

// netlisteners.on('result',(result)=>{
//     // 测试即使返回正确的也连续调用
//     netlisteners.testing();
//     console.log(process.memoryUsage().heapTotal);
// });

// netlisteners.on('error',(error)=>{
//     netlisteners.testing();
//     console.log(process.memoryUsage().heapTotal);
// });

netlisteners = netlisteners();
netlisteners.on('result', (result) => {
    switch (result) {
        case 'networknormal':
            // TODO 调用API
            console.log('网络结果' + result);
            netlisteners = null;
            break;
        case 'networkerror':
            // 连接成功但是返回的状态码错误
            console.log('网络结果' + result);
            netlisteners.testing();
            break;
    }
});
netlisteners.on('error', (error) => {
    switch (true) {
        case error === 'timeout':
            // 连接超时
            console.log('网络结果' + error);
            netlisteners.testing();
            break;
        case error.toString().indexOf('ETIMEDOUT') !== -1:
            // 有时候request对象一次会触发两个事件
            // 一个用户自定义的timeout事件,如果多次超时
            // 还会返回一个系统级别的timeout事件,所以不可以笼统
            // 的在所有的request意外错误中清空变量引用
            netlisteners.testing();
            break;
        default:
            // 真正的错误
            netlisteners = null;
            break;
    }
});