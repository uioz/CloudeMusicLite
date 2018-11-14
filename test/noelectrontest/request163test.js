// 本文件测试客户端请求服务器测试
let http = require('http');
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
const req = http.request(options);
req.on('error', (error) => {
    console.log('error' + error);
});
req.on('response',(response)=>{
    console.log('实际上创建request对象传入的回调就是,监听response事件的回调');
    console.log(response.statusCode);
});
req.end();
// 测试延时调用
setTimeout(() => {
    // 这里延时5秒后在此请求
    console.log(req);
    req.end();//延时调用
}, 5000);
// 延时在此调用request便无法使用了