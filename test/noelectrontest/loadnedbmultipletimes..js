//本文件测试nedb的多次加载
//前提概要
//nedb只有在使用nedb.loadDatabase的时候才会执行,这一过程是异步的
//那么我们设置一个全局变量存放nedb 而多次调用.loadDatabase

const pathjoin=require('path').join;
const nedb=require('nedb');
let db=new nedb({
    filename:pathjoin(__dirname,'game1'),
});

//第一次一定报错
let dbpro=new Promise((resolve,reject)=>{
    db.loadDatabase((err)=>{
        if(!err){
            resolve(true);
        }else{
            reject('once failed');
        }
    });
});
dbpro.then((result)=>{
    console.log(result);
}).catch((err)=>{
    console.log(err);
    // 已知错误
    // 再次调用,这次依然是错误
    let dbpro=new Promise((resolve,reject)=>{
        db.loadDatabase((err)=>{
            if(!err)
                resolve(true);
            else
                reject('second failed');
        });
    })
    return dbpro;
}).then((result)=>{
    console.log(result);
},(err)=>{
    console.log(err);
    // second failed
});
// 结果可以多次调用 符合预期

