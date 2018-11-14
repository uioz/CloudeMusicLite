// 本文件主要测试Promise对象
// 使用一个函数包装Promise对象
// 在函数reutrn处,将该Promise对象的then catch
// 都写出来返回,
// 又在then .catch中使用return但不是Promise对象
// 是boolean,如果使用在if()作为判断会有什么效果
const fs=require('fs');

function test(){
    let game=new Promise((resolve,reject)=>{
        let checkfile=fs.access(__dirname+'\\game',(err)=>{
            if(!err){
                resolve('ok')
            }else{
                reject(err);
            }
        });
    });

    return game.catch((err)=>{
        console.log(err);
    }).then((result)=>{
        return result;
    });
}
// console.log(test());

// Promise { <pending> }
// 结果异步处理,相当于打印执行过程中的Promise对象



// 测试Promise中返回一个普通对象是否会在下一个对象中接受
// function test1(){
//     let game = new Promise((resolve, reject) => {
//         let checkfile = fs.access(__dirname + '\\game', (err) => {
//             if (!err) {
//                 resolve('ok')
//             } else {
//                 reject(err);
//             }
//         });
//     });
//     return game;
// }
// test()
// .then((result)=>{
//     console.log(result);
//     // 测试返回一个对象,其中包含promise对象

//     let pro=test();
//     return {
//         result:result,
//         Promise:pro,
//     }
// }).then((result)=>{
//     if(result.result==='ok')
//      return result.Promise;
// }).then((result)=>{console.log(result)})
// .catch((err)=>{
//     console.log(err);
// });
// 结果 
// { result: 'ok', Promise: Promise { <pending> } }
// 符合预期

