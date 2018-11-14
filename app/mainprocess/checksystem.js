const fs = require('fs');
const { join: pathjoin, parse: pathparse } = require('path');
const dbInterface = require('./database.js').dbInterface;
const {callbackSync:Sync}=require('./util');
/**
 * 彻底明确此对象干什么
 * 1. 调用datebase检测配置文件
 * 2. 没有配置文件新建(默认)
 * 3  配置文件中需要有几个内容
 * 4  是否有用户,没有用户则新建一个匿名用户
 * 5  匿名用户只有一个id,同理也是有接口文件的
 * -  用户名称 密码 id id对应的各种接口文件
 * **注意如果用户登录或者退出必须同步更新配置文件**
 * 再次添加一个功能,检查用户名称对应的文件是否存在
 * 存在返回数据库对象,不存在创建
 */

// 定义config的默认路径,config不一定只有一个所以使用set结构
// 一个配置文件对应一个解析器
const configList = new Set(['config']);

function getinformationOnNode() {
    let confignode = {
        workpath: process.cwd(),
        os: process.platform,
        version: process.versions.node
    }
    return confignode;
}

function getinformationOnElectron() {
    const electronScreen = require('electron').screen;
    let configelectron = {
        screensize: electronScreen.getPrimaryDisplay().workAreaSize
    }
    return configelectron;
}

function getanonymousUser(){
    return { username: "anonymous", password: "", usertype: "anonymous", login:true, filepath: "anonymous"};
}
/**
 * 本函数包装了一个重置数据库函数
 * 简单来说就是全部删除，然后插入
 * config文件默认的参数
 * 需要注意的是使用Sync包装过后的
 * nedb是无法传入的
 * @param {object} db
 * @return {Promise}
 * @api private
 */
function restdb(database) {
    function close(db){
        const restdbpro = new Promise((resolve, reject) => {
            db.remove({}, { multi: true }, (err) => {
                if (!err) {
                    //db.insert([getinformationOnNode(), getinformationOnElectron(), getanonymousUser()], (err, doc) => {
                    db.insert([getanonymousUser(),getinformationOnNode()], (err, doc) => {
                        if (!err) {
                            resolve([doc,db]);
                        } else {
                            reject('restdb failed');
                        }
                    });
                } else {
                    reject('restdb failed');
                }
            });
        });
        return restdbpro;
    }
    return function () {
        return close(database);
    }
}
// TODO 修改util文件,任何obj都可以通过验证

/**
 * 这个函数负责验证对应文件的完整性
 * 如果出现的问题,则修正文件
 * @param {Array}fileArrayList
 */
function fileparsecontroller(fileArrayList) {
    // result数组保存一组Promise对象
    // Promise对象中包含的是,处理结果
    // 处理过程中没有错误,接受方使用
    // Promise.all().then()
    let result = [];


    const configparse = (db) => {
        // let cppro = new Promise((resolve, reject) => {
            // 对于config配置文件的解析,目前步骤如下
            // 格式为{_id:xx,username:"anonymous",password:'',usertype:"anonymous",filepath:"anonymous",login:"true"}

            /**
             * 1. 判断login在全文中的个数
             * - 一个打开
             * - 多个或者没有 执行重建
             * 
             * 重建中将会把数据库清空,在将文件重新填充,默认的用户格式为
             */
            let Gen=function* (nedbsync,restdb,unproxydb){
                let count=yield nedbsync.count({login:true});
                // 没有出错
                if(!count.err){
                    if(count.result==1){
                        let find= yield nedbsync.find({login:true});
                        if(!find.err){
                            let copy = ['username', 'password', 'usertype', 'login', 'filepath', '_id'];
                            if (JSON.stringify(Object.keys(find.result[0])) == JSON.stringify(copy))
                                return [find.result,unproxydb];
                            else
                                return restdb();
                        }else{
                            throw Error('find failed');
                        }
                    }else{
                        // 多条login:true是不允许的
                        // 重置数据库
                        return restdb();
                    }
                }else{
                    throw Error('count failed');
                }
            }
        let test = Sync([[db, ['count', 'find', 'insert', 'update', 'remove']],restdb(db),db], Gen);
        return test;
    }

    fileArrayList.forEach((value) => {
        let filename = pathparse(value.filename).name;
        switch (filename) {
            case "config":
                result.push(configparse(value));
                break;
        }
    });
    return result;
}

// 有如下两种情况
// 1.启动自检
// 2.指定文件恢复
// TODO 暂且不考虑运行时文件出错几率极低


/**
 * checkconfig的作用主要是检测配置文件和配置文件的修复
 * 配置文件放置在checksystem.js文件下的data文件夹中
 * 默认只检测config文件如果需要检测更多的文件需要在
 * checksystem顶部set结构中设置文件名和fileparsecontroller
 * 中添加相应的检测控制器
 */
function checkconfig() {
    let test=dbInterface;
    let database = new dbInterface();
    // TODO config文件有可能是多个的
    // 但是this._db永远只会接受最后一个
    // nedb对象,要么创建多个database对象
    // 要么重写database.createdb模块

    let checkconfigpro = new Promise((resolve, reject) => {
        let dblist = new Set();
        for (let value of configList.values()) {
            // 将配置文件名称对应的数据库打开返回的是Promise格式
            dblist.add(database.createdb(undefined, value, true,true));
        }

        // 将所有配置文件数据库的Promise对象顺序并发执行
        const configpro = Promise.all(Array.from(dblist));

        configpro.then((dbArrayList) =>  {
            // 打开数据库配置文件成功
            // 将配置文件传入解析器返回Promise对象
            const dbArrayListpro = fileparsecontroller(dbArrayList);
            Promise.all(dbArrayListpro)
            .then((resultArray)=>{
                let resultlist=[];
                // 全部配置文件返回的数据解析成功
                resultArray.forEach((value,index)=>{
                    // 由于文件是并发执行所以遍历的时候的顺序和Set存放的顺序是一致的
                    switch (index) {
                        case 0:
                        // config配置文件返回格式
                        // 格式一:
                        // [[此数组长度为一表示正常打开],{数据库对象}]
                        // 格式二
                        // [[{此数组长度超过一表示重新构建,},{},{}],{数据库对象}]
                        resultlist.push(value);
                            break;
                    }
                });
                resolve(...resultlist);
            })
            .catch((err)=>{
                reject(err);
            });
        }).catch((dbname) => {
            // 两次创建失败抛出错误到全局
            reject(Error("Error:File open failed !文件操作失败"));
        });
    });
    return checkconfigpro;
}

// 测试用
// let game = checkconfig();
// game.then((result) => {
//      console.log(result[0][0]);
// }).catch((err) => {
//      console.log(err);
// });

module.exports = {
    checkconfig,
    // resetconfig,
    // checkpath
}
