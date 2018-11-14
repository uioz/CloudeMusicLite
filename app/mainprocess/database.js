//datebase 包装成一个对象,可以新建多个
//构造 database 传入路径和文件名,
//database提供几个方法
//检测某一个文件是否存在
//检测某文件是否为数据库
//提供nedb的简易操作方法
//getter获取用户
//setter获取歌曲路径
//
const Crypto = require('crypto');
const { join: pathjoin, parse: pathparse } = require('path');
const nedb = require('nedb');
const fs = require('fs');
const defaultFolderPath = 'data';
/**
 * path 使用默认值请传入undefined
 * filename 必需填入
 * @param {string} path
 * @param {string} filename
 */
function isdatabase(path = pathjoin(__dirname, defaultFolderPath), filename = null) {
    if (filename === null) {
        throw Error('Error:Function isdatabase filename can not be empty');
    }
    filepath = pathjoin(__dirname, filename);
    const isdatabasepro = new Promise((resolve, reject) => {
        let filepro = this.hasfile(filepath);
        filepro.then(result => {
            let dbpro = this.hasdb(filepath);
            return dbpro;
        }).then(result => {
            resolve(result);
        }).catch(err => {
            reject(err);
        });
    });
    return isdatabasepro;
}
/**
 * 必须填入path
 * @param {string} path
 */
function hasfile(path = null) {
    if (path === null) {
        throw Error('Error:Function hasfile path can not be empty');
    }
    //将回调包装成Promise对象
    /* then 返回true
     * reject 返回错误信息
     */
    let filepro = new Promise((resolve, reject) => {
        let testfile = fs.access(path, err => {
            if (!err) {
                resolve(true);
            } else {
                reject(err)
            }
        });
    });
    return filepro;
}
/**
 * 必须填入path
 * @param {string} path
 */
function hasdb(path = null) {
    if (path === null) {
        throw Error('Error:Function hasdb path can not be empty');
    }
    //将nedb的回调包装成Promise对象
    /**
     * then 返回true
     * reject 返回错误信息
     */
    let db = new nedb({ filename: path });
    //将db包装成Promise对象
    let dbpro = new Promise((resolve, reject) => {
        db.loadDatabase((err) => {
            if (!err) {
                resolve(true)
            } else {
                reject(err);
            }
        });
    });
    return dbpro;
}
/**
 * path 使用默认值请传入undefined
 * filename 必需填入
 * 谨慎使用如果已经有了文件会被覆盖
 * @param {string} path
 * @param {string} filename
 */
function createfile(path = null) {
    if (path === null) {
        throw Error('Error:Function createfile path can not be empty');
    }
    let createfilepro = new Promise((resolve, reject) => {
        fs.open(pathjoin(path, filename), 'w', (err, fd) => {
            if (!err) {
                fs.closeSync(fd);
                resolve(true);
            } else {
                reject({ err: 'file open failed' });
            }
        });
    });
    return createfilepro;
}

/**
 * 介绍:该函数挂载_db和
 * _dbname到database对象上去
 * 
 * 如果传入一个参数,即挂载数据库对象
 * 如果传入两个参数,一个是数据库另外一个是
 * 数据库名称
 * 
 * 
 * @param {Any} rest 
 * @api private
 * @returns {undefined}
 */
function setdbandsetdbname(...rest) {
    const isobj = require('./util').isObject;
    if (rest.length = 1) {
        if (isobj(rest[0]) && rest[0].filename) {
            this._db = rest[0];
            this._dbname = pathparse(rest[0].filename).name;
        }
    } else {
        this._db = rest[0];
        this._dbname = rest[1];
    }
}

/**
 * 加密文件函数,调用一次
 * 返回加密后的结果
 * TODO 应该指定随机key,写入HTML5储存中
 * 这样可以吧key从代码中分离,不过如果缓存被清空
 * 那么储存的信息将会被删除
 * @param {any} data 
 */
function encode(data) {
    const cipher = Crypto.createCipher('aes192', 'safjdi127epap423kr');
    let result = cipher.update(data, 'utf8', 'hex');
    result += cipher.final('hex');
    return result;
}
/**
 * 解密文件函数,调用一次
 * 返回解密的结果
 * @param {any} data 
 */
function decode(data) {
    const decipher = Crypto.createDecipher('aes192', 'safjdi127epap423kr');
    let result = decipher.update(data, 'hex', 'utf8');
    result += decipher.final('utf8');
    return result;
}

/**
 * 使用默认路径传入undeinfed
 * 如果文件存在且为数据库文件会被打开,如果不存在
 * 则会被创建,如果有同名文件则会被覆盖.
 * 1. corruptAlertThreshold是nedb默认的参数默认为flase
 * 和nedb数据库一致如果为true将忽略文件损坏的错误
 * 之所以出现这个选项，是为了防止文件直接被删除后重建,忽略请传入undefined
 * 2. Crypto是加密选项,默认false
 * @param {string} path
 * @param {string} dbname
 * @param {boolean} corruptAlertThreshold
 * 
 */
function createdb(path = pathjoin(__dirname, defaultFolderPath), dbname = null, corruptAlertThreshold = false, Crypto = false) {
    if (dbname === null) {
        throw Error("Error:function createdb dbname can not be empty");
    }
    const dbpath = pathjoin(path, dbname);
    let createdbpro = new Promise((resolve, reject) => {
        let dbparameter = {
            filename: dbpath,
            corruptAlertThreshold: corruptAlertThreshold
        }
        //分情况判断是否加密
        if (Crypto) Object.assign(dbparameter, {
            beforeDeserialization: decode,
            afterSerialization: encode
        });
        let db = new nedb(dbparameter);
        db.loadDatabase((err) => {
            if (!err) {
                setdbandsetdbname.call(this, db, dbname);
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
                    setdbandsetdbname.call(this, db, dbname);
                    resolve(db);
                }).catch((err) => {
                    reject(dbname);
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
/**
 * 小心使用，错误情况会有很多种
 * 例如 文件不存在，文件被占用
 * @param {string} path
 */
function removefile(path = null) {
    if (path === null) {
        throw Error('Error:Function removefile path can not be empty');
    }
    let removefilepro = new Promise((resolve, reject) => {
        fs.unlink(path, (err) => {
            if (!err) {
                resolve(true)
            } else {
                reject({ err: 'removefile failed' });
            }
        });
    });
    return removefilepro;
}
/**
 * 返回一个database对象,他是一个基本的文件封装
 * **注意**任何添加数据库操作都会覆盖该对象中的
 * nedb对象
 * 
 * 1. obj(可选)传入一个nedb对象
 * 2. 使用createdb来获取返回的nedb对象
 * 3. 如果只需要文件操作方法请使用baseMethod
 * @param {Object} obj 
 */
function dbInterface(obj) {
    // 如果传入一个db对象,将db对象挂载在该对象上面
    // 后续的createdb创建后的对象将不会挂载在该对象上面
    setdbandsetdbname.call(this, obj)
}
dbInterface.prototype.isdatabase = isdatabase;
dbInterface.prototype.hasfile = hasfile;
dbInterface.prototype.hasdb = hasdb;
dbInterface.prototype.createdb = createdb;
dbInterface.prototype.createfile = createfile;
dbInterface.prototype.removefile = removefile;

/**
 * 传入一个构造函数或者对象为其包装,database的原型方法
 * 需要注意的是传入的函数不可以为ES6简写函数
 * @param {object,function} obj
 */
function baseMethod(obj = null) {
    if (obj === null)
        throw Error('Error:function baseMethod obj can not be empty!');
    else if (!(!!obj && typeof obj != "string" && obj.constructor != Array && /^[\s[]?function|object/.test(obj + "")))
        throw Error("Error:function baseMethod obj must be function or object!");

    let pro;
    // 如果是object,使用Object.getPrototypeOf获取原型对象
    if (obj.toString().indexOf('Object') != -1)
        pro = Object.getPrototypeOf(obj);
    else
        pro = obj.prototype;

    // TODO 添加方法也需要在这里添加
    Object.assign(pro, {
        isdatabase: isdatabase,
        hasfile: hasfile,
        hasdb: hasdb,
        createdb: createdb,
        createfile: createfile,
        removefile: removefile
    });

    return obj;
}
module.exports = {
    dbInterface,
    baseMethod
}