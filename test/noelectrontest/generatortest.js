
// 本文件对Generator进行渐进测试
// 使用的例子依然是nedb进行操作的例子
const pathjoin = require('path').join;
const db = require('nedb');
const nedb = new db({
    filename: pathjoin(__dirname, 'config'),
});
nedb.loadDatabase((err) => {
    if (err) {
        console.log(err);
    }
});
// 测试原生的Generator函数,对于nedb.find的使用
// function* nedbgen(){
//     // yield 不能写在非Generator中所以在回调中无法使用
//     nedb.find({login:'true'},(err,doc)=>{
//         if(!err){

//         }else{

//         }
//     });
// 但是如果我们把nedb包装成一个Promise对象呢？
// 如果包装成Promise对象的话，外部执行then 和 catch
// 这样逻辑控制太过于复杂
// 关键是我们想把代码的逻辑也要写在generator里
// 把yield表达式，表现的就像同步的一样
// 如何做到
// 如果外部的then 和　catch获取的值无论是什么都
// 返回给yield表达式呢这样一来，逻辑就可以在yield中书写了
// 等一下，假如和我之前使用Proxy将callback改Promise结合起来
// 在抽象一下，不就可以将一个callback的对象比如fs
// 完全的边做一个同步效果的generator了么？
// }
// 测试1 Generator 函数中 yield返回Promise对象
// 控制端使用then catch测试

// // 将查询文件封装成异步的
// let findpro = new Promise((resolve, reject) => {
//     nedb.find({ login: 'true' }, (err,doc) => {
//         if (!err) {
//             resolve(doc);
//         } else {
//             reject(err);
//         }
//     });
// });
// // 另外的查询
// let anotherpro=new Promise((resolve,reject)=>{
//     nedb.find({$lt: "gg"},(err,doc)=>{
//         if(!err){
//             resolve(doc);
//         }else{
//             reject(err);
//         }
//     });
// });

const { makeGenerator: makeGen,objectpromisify:makePro,test:Gentest}=require('./util');
let game = Gentest([[nedb, ['count', 'find', 'insert', 'update', 'remove']]],check);
function* check(testdb,obj){
    // 查找登录用户的个数
    let count=yield testdb.count({login:'true'});
    if(!count.err){
        // login只能有一条
        if(count.result==1){
            return yield testdb.find({login:'true'});
        }else{
            // 超过一条清空数据库再次插入一条
            let remove=yield testdb.remove({});
            if(!remove.err){
                return yield testdb.insert({login:'true'});
            }else{
                // 重新构建失败
                throw Error('create failed');
            }
        }
    }else{
        // 查找报错
        throw Error('count failed');
    }
}
game.then((result)=>{
    console.log(result);
}).catch((err)=>{
    console.log(result);
});


// 使用Generator函数
function* testgen() {
    let x = yield findpro;
    if (!x.err) {
        // return yield x.result;
        // 测试如果return 一个Promise会被最后的then拦截么
        return yield anotherpro;
    } else {
        return yield 'not find';
    }
}
// let gen=testgen();
// gen.next().value
//     .then((result)=>{
//         // 把结果传回去,控制器交给gen函数
//         gen.next(result);
//         // 由于是Promise对象,所以下次的返回依然在此处
//         console.log(gen.next());
//     })
//     .catch((err)=>{
//         // 把结果传回去,控制器交给gen函数
//         gen.next(err);
//     });

// 改成递归调用
function makeGenerator(generator,...rest) {
    const gen = generator(...rest);

    return new Promise((resolve, reject) => {
        // 传入非Generator直接resolve
        if (!gen || typeof gen.next !== 'function') return resolve(gen);

        function next(data) {
            // 第一次传入的undefined会被Generator忽略
            let result
            try {
                result = gen.next(data);
            } catch (e) {
                return reject(e);
            }
            if (result.done) return resolve(result.value);

            if (/^\[.+Promise]/.test(result.value + "")){
                result.value.then((result) => {
                    // TODO 改写成传入一个对象,第一个为err第二个为参数
                    next({
                        err: null,
                        result: result
                    });
                }).catch((err) => {
                    next({
                        err: err
                    });
                });
            }else{
                return resolve(result.value);
            }
        }
        next();
    });
}
// 测试将Generator函数放入
// makeGenerator(testgen).then((result) => {
//        console.log(result);
// }).catch((err) => {
//     console.log(err);
// });
