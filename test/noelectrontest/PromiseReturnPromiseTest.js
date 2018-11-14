//测试说明
//1. Promise.then中返回Promise对象,会不会被下一个then拦截
//2. 如果拦截使用catch会被拦截吗
//3. 如果使用catch不拦截,那么return 的Promise对象会被返回到调用该函数的变量上吗?
//解决这个问题很有实际意义,对于多个Promise对象的嵌套可以有更健壮的解决方案

//注意该测试函数和使用中的区别是函数中的path的默认值都是
//pathjoin(__dirname,'data')
//而此处改为pathjoin(__dirname),因为测试文件放在当前
const pathjoin = require('path').join;
const fs = require('fs');
const nedb=require('nedb');

// const isdatabase = (path = pathjoin(__dirname), filename = null) => {
//     if (filename === null) {
//         throw Error('Error:Function isdatabase filename can not be empty');
//     }
//     let databasepath = pathjoin(path,filename);
//     let hasfilepro = hasfile(path, filename)
//         .then(result => {
//             //路径中有文件,测试是否为数据库使用db的loadDatabase测试
//             //将db作用域提高一级,在使用完后赋值为null
//             let db = new nedb({
//                 filename: databasepath
//             });
//             //将db包装成Promise对象
//             let dbpro = new Promise((resolve, reject) => {
//                 db.loadDatabase((err) => {
//                     console.log(err);
//                     if (!err) {
//                         resolve(true)
//                     } else {
//                         reject(err);
//                     }
//                 });
//             });
//             //TODO 测试完成后删除此处不考虑return的情况
//             dbpro.then((result) => {
//                 console.log(result);
//                 //正常为true
//                 db = null;
//             }).catch((err) => {
//                 db=null;
//             });
//         }).catch(err => {
//             throw Error(err);
//         });
// }

// const hasfile = (path = pathjoin(__dirname), filename = null) => {
//     if (filename === null) {
//         throw Error('Error:Function hasfile filename can not be empty');
//     }
//     let filepath = pathjoin(path, filename);
//     //将回调包装成Promise对象
//     /* then 返回true
//      * reject 返回错误信息
//      */
//     let pro = new Promise((resolve, reject) => {
//         let testfile = fs.access(filepath, err => {
//             if (!err) {
//                 resolve(true);
//             } else {
//                 reject(err)
//             }
//         });
//     });
//     return pro;
// }
//hasfilepro正常运行测试
// let hasfilepro=hasfile(undefined,'dark').then((result)=>{
//   console.log(result);
// }).catch((err)=>{
//   console.log(err);
// });

//测试2 game是一个nedb文件
// isdatabase(undefined,'game');
//结果返回 true 符合预期
//测试3 game1是一个被破坏的文件
// isdatabase(undefined,'game1');
//结果返回error 符合预期
//需要注意的是在db文件后面添加的内容格式为一行,将不会报错


// 新测试
// let isdatabase = (path = pathjoin(__dirname), filename = null) => {
//     if (filename === null) {
//         throw Error('Error:Function isdatabase filename can not be empty');
//     }
//     const databasepath = pathjoin(path,filename);
//     let hasfilepro = hasfile(path, filename)
//         .then(result => {
//             //路径中有文件,测试是否为数据库使用db的loadDatabase测试
//             //将db作用域提高一级,在使用完后赋值为null
//             let db = new nedb({
//                 filename: databasepath
//             });
//             //将db包装成Promise对象
//             let dbpro = new Promise((resolve, reject) => {
//                 db.loadDatabase((err) => {
//                     if (!err) {
//                         resolve(true)
//                     } else {
//                         reject(err);
//                     }
//                 });
//             });
//             //TODO 测试完成后删除此处不考虑return的情况
//             return dbpro;
//         }).then((result)=>{
//             return result;
//         }).catch(err => {
//             console.log(err);
//         });
// }
// const hasdb = (path=null)=>{

// }
// const hasfile = (path = pathjoin(__dirname), filename = null) => {
//     if (filename === null) {
//         throw Error('Error:Function hasfile filename can not be empty');
//     }
//     let filepath = pathjoin(path, filename);
//     //将回调包装成Promise对象
//     /* then 返回true
//      * reject 返回错误信息
//      */
//     let pro = new Promise((resolve, reject) => {
//         let testfile = fs.access(filepath, err => {
//             if (!err) {
//                 resolve(true);
//             } else {
//                 reject(err)
//             }
//         });
//     });
//     return pro;
// }
//测试在Promise.then中返回Promise的结果
// console.log(isdatabase(undefined,'game'));
//测试的格式.then().then(result=>console.log(result),err).catch();
//测试结果在promise中返回promise对象,的结果会被链式下次截获 true

//测试在Promise.then中返回Promise的结果而且是reject的情况
//reject会不会被.catch截获
//console.log(isdatabase(undefined,'game1'));
//测试的格式.then().then(result,err).catch(err=>console.log('whatthefuck'));
//测试结果没有被.catch截获,被自身的err截获了

//测试在Promise.then中返回Promise的结果而且是reject的情况
//返回的promise自身没有reject的拦截,是否会被.catch拦截
//console.log(isdatabase(undefined,'game1'));
//测试的格式.then().then(result).catch(err=>console.log('whatthefuck'));
//测试结果 输出whatthefuck 被.catch截获

//测试一个promise对象reject,正常情况下该对象的链式是这个样子的
//.then().catch()
//可是由于在第一个.then中返回的是一个promise对象,那么这个链变成了
//.then().then().catch()
//那么第一个then的reject还会被.catch()拦截吗?
//console.log(isdatabase(undefined,'dark'));
//测试的格式.then().then(result).catch(err=>console.log(err));
//测试结果 err被.catch()捕获 符合预期

//如果promise.then返回另外一个promise会被拦截的话,那么
//返回的不是promise会怎么样呢,return的值会被上级接受到吗
//测试链.then(return Promise).then(return true).catch(err=>{console.log(err)})
//console.log(isdatabase(undefined,'game'));
//调用者接受不到return的值,关键就在此,回调函数中的return根本没有用
//这样就无法连续return Promise对象
//当然可以使用Promise.all()方法在本例中,可以让两个promise对象,返回不一样的error
//然后returnPromise.all()
//调用者在.catch上使用不同的捕获
//或者()=>改成function,在回调的函数中使用bind()来绑定执行上下文
//或者直接给一个callback
//return的结果传给了Promise对象






/**
 * 总结
 * Promise对象设计的不够完美
 * 本例中需要有3重返回,xxx>isdatabase>hasfile
 * hasfile可以return 一个包装好的promise对象
 * 但是到了isdatabase层面,
 * 
 * 其实我们的处理过程为
 * hasfile = promsie hasdb=promise
 * 两者的callback都是err,既然hasfile可以返回一个promise那么hasdb也可以
 * 这两者是独立封开的,没有关系的,但是在isdatabase中两者才会有了结合
 * 而我们又希望isdatabase中也返回promise
 * 三者统一返回都是promise就好了
 */

 // 最后的改写测试
/**
 * 将hasfile hasdb 改成返回promise对象
 * 将isdatabase改成返回promise对象
 * 
 * hasdb在hasfile.then成功后执行hasdb
 * 直接在return中返回hasdb在下一次.then中会有
 * 拦截吗?
 */

const isdatabase = (path = pathjoin(__dirname, 'data'), filename = null) => {
    if (filename===null) {
        throw Error('Error:Function isdatabase filename can not be empty');
    }
    filepath=pathjoin(__dirname,filename);    
    const isdatabasepro=new Promise((resolve,reject)=>{
        let filepro=hasfile(filepath);
        filepro.then(result=>{
            let dbpro=hasdb(filepath);
            return dbpro;
        }).then(result=>{
            resolve(result);
        }).catch(err=>{
            reject(err);
        });
    });
    return isdatabasepro;
}
const hasfile = (path=null) => {
    if (path === null) {
        throw Error('Error:Function hasfile path can not be empty');
    }
    //将回调包装成Promise对象
    /* then 返回true
     * reject 返回错误信息
     */
    let filepro = new Promise((resolve, reject) => {
        let testfile = fs.access(path, err => {
            if(!err){
                resolve(true);
            }else{
                reject(err)
            }
        });
    });
    return filepro;
}
const hasdb = (path =  null)=>{
    if (path === null) {
        throw Error('Error:Function hasdb path can not be empty');
    }
    //将nedb的回调包装成Promise对象
    /**
     * then 返回true
     * reject 返回错误信息
     */
    let db=new nedb({
        filename:path
    });
    //将db包装成Promise对象
    let dbpro=new Promise((resolve,reject)=>{
        db.loadDatabase((err)=>{
          if(!err){
              resolve(true)
          }else{
              reject(err);
          }
      });
    });
    return dbpro;
}
//测试有文件且格式正确
//应该在isdtabasepro的then中返回true
// const isdatabasepro=isdatabase(__dirname,'game');
// isdatabasepro.then(result=>{
//     console.log(result);
// }).catch(err=>{
//     console.log(err);
// });
//结果 true 符合预期

//测试有文件但是格式不正确
// const isdatabasepro=isdatabase(__dirname,'game1');
// isdatabasepro.then(result=>{
//     console.log(result);
// }).catch(err=>{
//     console.log(err);
// });
//结果报错 符合预期

//测试无文件
const isdatabasepro=isdatabase(__dirname,'dark');
isdatabasepro.then(result=>{
    console.log(result);
}).catch(err=>{
    console.log(err);
});
//结果报错 符合预期