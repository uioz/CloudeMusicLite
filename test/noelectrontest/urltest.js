// 本文件主要测试node url模块
// 传入ip作为hosts,使用toString()方法打印
let port = 34895;
const {URL}=require('url');
const http = require('http');


// let test = new URL('http://127.0.0.1:' + port);
// test.pathname='/search';
// test.search ='keywords=what is love&limit=10';
// console.log(test.toString());


// 测试request封装
function createrequest(pathname, search) {
    let option = new URL('http://127.0.0.1:' + port);
    option.pathname = pathname;
    option.search = search;
    // 发送请求
    this._request = http.request(option);
    this._request.end();
    // 监听事件
    this._request.on('response', (response) => {
        console.log(response.statusCode);
        let Arraylist = [];
        response.on('data', (data) => {
            Arraylist.push(data);
        });
        response.on('end', () => {
            let game=JSON.parse(Buffer.concat(Arraylist))
            console.log(game);
        });
    });
    // 添加摧毁的方法
    this.destroy = function () {
        try {
            this._request.destroy();
        } catch (error) {
            console.log('已经摧毁');
        }
    }
}
let game = new createrequest('/search','keywords=海阔天空&limit=10');
// ok