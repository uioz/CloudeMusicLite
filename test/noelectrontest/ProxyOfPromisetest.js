// 本文件主要测试使用Proxy拦截Promise对象
// 拦截Promise对象的getter
// 将一个异步回调的对象,包装成使用
// Promise.then Promise.catch的效果

// 应用的例子来源于nedb的解析操作

// const promisify = (fn, receiver) => {
//     return function (...args) {
//         return new Promise(function (resolve, reject) {
//             fn.apply(receiver, [...args, (err, res) => {
//                 return err ? reject(err) : resolve(res);
//             }]);
//         });
//     };
// };

/**
 * **将一个对象的方法包装成Promise**
 * - property中传入字符串数组,会被包装成
 * - 对象的方法
 * @param {object} target 
 * @param {Array} property 
 */
function objectpromisify(target, propertys = ['count', 'find', 'insert', 'update', 'remove']){
    const hander = {
        get: function (target, property, receiver) {
            if (propertys.indexOf(property) == 1) {
                return this._promisify(Reflect.get(target, property), target);
            }
            return target[property];
        },
        _promisify: promisify,
    }
    return new Proxy(target,hander);
}





const nedb = require('nedb');
const pathjoin = require('path').join;
console.log(pathjoin(__dirname, 'config'))
const db = new nedb({
    filename: pathjoin(__dirname, 'config'),
});
// 
const hander={
    get: function (target, property,receiver){
        const p=['count','find','insert','update','remove'];
        if(p.indexOf(property)==1){
            return this._promisify(Reflect.get(target,property),target);
        }
        return target[property];
    },
    _promisify:function(fn,receiver){
        return function (...args) {
            return new Promise(function (resolve, reject) {
                fn.apply(receiver, [...args, (err, res) => {
                    return err ? reject(err) : resolve(res);
                }]);
            });
        };
    }
}
let proxyofnedb=new Proxy(db,hander);
proxyofnedb.loadDatabase(err => {
    if (!err) {
        console.log("打开成功");
    }
});
proxyofnedb.find({})
.then((result)=>{
    console.log(result);
})
.catch((err)=>{
    console.log(err);
});