// 本文件测试如果一个请求对象发送后赋值为null后其内部
// 的回调是否会执行
// 测试的目的是寻找一个中止请求的方法
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
const http=require('http');
var game =(response) => {
    console.log(response.statusCode);
    response.on('data', (data) => {
        data = null;
    });
};
let test=http.request(options,game);
test.end();
try {
    test.destroy();
} catch (error) {
    console.log(error);
}
// 结果
// node中网络通信利用net模块,也就是tcp连接
// 官方文档中没有提供终止的方法,但是由于其
// 继承了socket类,所以有destroy方法
// 但是执行socket的destroy方法后如果不监听
// error事件的话就会抛出错误,所以需要在
// 执行test.destroy外部包围trycatch,
// 在request中难以捕获socket对象,也难以
// 添加error事件的监听器