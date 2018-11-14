//本测试主要测试Promise抛出错误后的捕获

// let pro=new Promise((resolve,reject)=>{
//     resolve(true);
// });
// pro.then((result)=>{
//     if(result){
//         throw Error('test1');
//     }
// }).catch((err)=>{
//     console.log(err);
//     throw "test2";
// }).catch((err)=>{
//     console.log(err);
// });

//测试进程会不会停止,3秒后打印一个输出
// setTimeout(() => {
//     console.log('test3');
// }, 3000);
//结果 前一个then 或者 catch throw出的语句会被后面的catch语句接受到
//throw 抛出的错误不会终止进程

//测试如果一个promise中的catch部分返回一个promise同时抛出了一个错误
//而返回的promise又执行了catch那么后一最后的catch会接受到两个错误
//错误的格式是什么样子的?
let pro = new Promise((resolve, reject) => {
    reject('test1');
});
pro.catch((err) => {
    
    let pro2 = new Promise((resolve, reject) => {
        reject('test2')
    });
    throw 'err';
    return pro2;
}).then((result)=>{
    console.log(result);
}).catch((err)=>{
    console.log(err);
}).catch((err)=>{
    console.log(err);
});

//结果 判断失败 一旦使用了throw 就终止了代码的执行,
//虽然会被下一个.catch拦截,但是throw后面的语句是不会执行的了
//如果前面定义了proimse对象还会导致不使用的promise对象