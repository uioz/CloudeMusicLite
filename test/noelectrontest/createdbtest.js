//本文件测试创建数据库模块
//最后测试挂载到一个构造函数上作为原型测试
//使用this.removefile调用另外一个函数
const pathjoin=require('path').join;
const fs=require('fs');
const defaultpath='';
const nedb=require('nedb');

// function removefile(path = null) {
//     if (path === null) {
//         throw Error('Error:Function removefile path can not be empty');
//     }
//     let removefilepro = new Promise((resolve, reject) => {
//         fs.unlink(path, (err) => {
//             if (!err) {
//                 resolve(true)
//             } else {
//                 reject({
//                     err: 'removefile failed'
//                 });
//             }
//         });
//     });
//     return removefilepro;
// }

// function createdb(path = pathjoin(__dirname, defaultFolderPath), dbname = null, corruptAlertThreshold = false) {
//     if (dbname === null) {
//         throw Error("Error:function createdb dbname can not be empty");
//     }
//     const dbpath = pathjoin(path, dbname);

//     let createdbpro = new Promise((resolve, reject) => {
//         let db = new nedb({
//             filename: dbpath,
//             corruptAlertThreshold: corruptAlertThreshold
//         });
//         db.loadDatabase((err) => {
//             if (!err) {
//                 resolve(db);
//             } else {
//                 let removefilepro = removefile(dbpath);
//                 removefilepro.then((result) => {
//                     //如果文件被删除成功那么再次创建数据库
//                     let dbpro = new Promise((resolve, reject) => {
//                         db.loadDatabase((err) => {
//                             if (!err) {
//                                 resolve(db);
//                             } else {
//                                 reject(err);
//                             }
//                         });
//                     });
//                     return dbpro;
//                 }, (err) => {
//                     //如果文件删除失败,有可能是没有文件,那么继续创建数据库
//                     let dbpro = new Promise((resolve, reject) => {
//                         db.loadDatabase((err) => {
//                             if (!err) {
//                                 resolve(db);
//                             } else {
//                                 reject(err);
//                             }
//                         });
//                     });
//                     return dbpro;
//                 }).then((db) => {
//                     // 再次创建成功,将数据库传回去
//                     // TODO 此处因该赋值给this._db
//                     resolve({
//                         result: db,
//                         createamethod: 'cover',
//                     });
//                 }).catch((err) => {
//                     reject(err)
//                 });
//                 //逻辑
//                 // 文件删除完成->创建->创建成功
//                 // 文件删除完成->创建->创建失败->失败
//                 // 文件删除失败->创建->创建成功
//                 // 文件删除失败->创建->创建失败->失败
//                 // 也就是说文件删除这一步并不影响后面的操作
//                 // 文件删除的then catch操作都是一致的
//             }
//         });
//     });
//     return createdbpro;
// }

// let createdbpro=createdb(__dirname,'game2');
// createdbpro.then((result)=>{
//     // 成功此处会打印出db对象
//     console.log(result);
    
// }).catch((err)=>{
//     console.log(err);
// });
//测试成功

//测试二作为原型方法挂载


function removefile(path = null) {
    if (path === null) {
        throw Error('Error:Function removefile path can not be empty');
    }
    let removefilepro = new Promise((resolve, reject) => {
        fs.unlink(path, (err) => {
            if (!err) {
                resolve(true)
            } else {
                reject({
                    err: 'removefile failed'
                });
            }
        });
    });
    return removefilepro;
}

function createdb(path = pathjoin(__dirname, defaultFolderPath), dbname = null, corruptAlertThreshold = false) {
    if (dbname === null) {
        throw Error("Error:function createdb dbname can not be empty");
    }
    const dbpath = pathjoin(path, dbname);
    const that=this;
    let createdbpro = new Promise((resolve, reject) => {
        let db = new nedb({
            filename: dbpath,
            corruptAlertThreshold: corruptAlertThreshold
        });
        db.loadDatabase((err) => {
            if (!err) {
                this._db=db;
                console.log(this._db);
                resolve(db);
            } else {
                let removefilepro = this.removefile(dbpath);
                removefilepro.then((result) => {
                    //如果文件被删除成功那么再次创建数据库
                    let dbpro = new Promise((resolve, reject) => {
                        db.loadDatabase((err) => {
                            if (!err) {
                                resolve(db);
                            } else {
                                reject(err);
                            }
                        });
                    });
                    return dbpro;
                }, (err) => {
                    //如果文件删除失败,有可能是没有文件,那么继续创建数据库
                    let dbpro = new Promise((resolve, reject) => {
                        db.loadDatabase((err) => {
                            if (!err) {
                                resolve(db);
                            } else {
                                reject(err);
                            }
                        });
                    });
                    return dbpro;
                }).then((db) => {
                    // 再次创建成功,将数据库传回去
                    // TODO 此处因该赋值给this._db
                    this._db=db;
                    resolve({
                        result: db,
                        createamethod: 'cover',
                    });
                }).catch((err) => {
                    reject(err)
                });
                //逻辑
                // 文件删除完成->创建->创建成功
                // 文件删除完成->创建->创建失败->失败
                // 文件删除失败->创建->创建成功
                // 文件删除失败->创建->创建失败->失败
                // 也就是说文件删除这一步并不影响后面的操作
                // 文件删除的then catch操作都是一致的
            }
        });
    });
    return createdbpro;
}

game.prototype.createdb = createdb;
game.prototype.removefile = removefile;

function game(){

}

let test=new game();
let db=test.createdb(__dirname,'game2');
db.then((result)=>{
    // console.log(result);
    console.log(test._db);
}).catch((err)=>{
    // console.log(err);
});

