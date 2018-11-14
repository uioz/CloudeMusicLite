//测试fs.accessapi
//使用try catch捕获的时候的副作用
// const pathjoin=require('path').join;
// const fs=require('fs');
//测试存在部分
// const hasfile=(path=pathjoin(__dirname),filename='game')=>{
//     if(filename===null){
//         throw Error('Error:Function hasfile filename can not be empty');
//     }
//     let filepath=pathjoin(path,filename);
//     try {
//         let testfile=fs.accessSync(filepath);
//     } catch (error) {
//         console.log(error);
//         return false;
//     }
//     return true;
// }
// console.log(hasfile());
//结果 文件存在同步返回true


//测试不存在 catch部分会调用几次
// const hasfile=(path=pathjoin(__dirname),filename='dark')=>{
//     if(filename===null){
//         throw Error('Error:Function hasfile filename can not be empty');
//     }
//     let flag=0;
//     let filepath=pathjoin(path,filename);
//     try {
//         let testfile=fs.accessSync(filepath);
//         flag++;
//     } catch (error) {
//         return flag;
//     }
//     return true;
// }
// console.log(hasfile());
//文件不存在的时候返回0 没有副作用

//将access封装成promise对象测试
// const hasfile = (path = pathjoin(__dirname), filename = null) => {
//     if (filename === null) {
//         throw Error('Error:Function hasfile filename can not be empty');
//     }
//     let filepath = pathjoin(path, filename);
//     //将回调包装成Promise对象
//     let pro = new Promise((resolve, reject) => {
//         let testfile = fs.access(filepath, err => {
//             if(!err){
//                 resolve(true);
//             }else{
//                 reject(err)
//             }
//         });
//     });
//     return pro;
// }
// //测试的文件不存在
// let test=hasfile(undefined,'dark').then(result=>{
//     console.log(result);
// }).catch((err)=>{
//     console.log(err);
//     //打印错误
// });
// //测试的文件存在
// let test1=hasfile(undefined,'game').then(result=>{
//     console.log(result);
//     //true
// }).catch((err)=>{
//     console.log(err);
// });
