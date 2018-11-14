
const promisify = (fn, receiver) => {
    return function (...args) {
        return new Promise(function (resolve, reject) {
            fn.apply(receiver, [...args, (err, res) => {
                return err ? reject(err) : resolve(res);
            }]);
        });
    };
};


// 这个文件主要测试
// nedb的操作,具体到config文件身上
const nedb = require('nedb');
const pathjoin = require('path').join;
const db = new nedb({
    filename: pathjoin(__dirname,'config'),
});
db.loadDatabase(err => {
    if(!err){
        console.log("打开成功");
    }
});


function restdb(db,callback){

    callback();
}



// 如果有用户存在一定只有一个login:true的记录
// 除此以外的都是错误
// db.count({login:"true"},(err,count)=>{
//     console.log(count);
//     if(!err){
//         if(count==1){
//             console.log('count=1');
//             db.find({login:"true"},(err,doc)=>{
//                 if(!err){
//                     let copy = ['username', 'password', 'usertype', 'login', 'filepath', '_id'];
//                     // 请不要使用这种方式来比较数组,就目前的应用来说这么比较是合适的
//                     if (JSON.stringify(Object.keys(doc[0])) == JSON.stringify(copy)){
//                         // resolve
//                     }else{
//                         // TODO 执行重置
//                     }
//                 }else{
//                     throw Error(err);
//                 }
//             });
//         }else{
//             // 删除重新创建
//             db.remove({}, { multi: true }, function (err, numRemoved) {
//                 if(!err){
//                     // TODO 效果和上方一样等待抽像
//                     db.insert({ username: "anonymous", password: "", usertype: "anonymous", login: "true", filepath:"anonymous"},(err,doc)=>{
//                         if(!err){
//                             console.log(doc);
//                         }else{
//                             throw Error(err);
//                         }
//                     });
//                 }else{
//                     throw Error(err);
//                 }
//             });
//         }
//     }else{
//         // 打开的情况下报错,无可救药
//         throw Error(err);
//     }
// });

// 使用util改写成promise对象
const utli=require('./util.js');
console.log(db.count);
let nedbpro=utli.objectpromisify(db);
nedbpro.count({login:'true'})
    .then((count)=>{
        console.log(count);
        if(count==1){
            return {
                type:true,
                promise:nedbpro.find({login:'true'})
            }
        }else{
            return {
                type:false,
                promise:nedbpro.remove({})
            }
        }
    })
    .then((result)=>{
        // count==1
        if(result.type){
            result.promise.then((result)=>{
                return 
            }).catch((err)=>{
                throw Error(err);
            });
        }else{
        // 重新构建
        result.promise.then((result)=>{
            
        }).catch((err)=>{
            throw Error(err);
        });
        }
    })
    .catch((err)=>{
        console.log(err);
    });