
//说明:修改版ES6标准Promise接口包装函数
/*例:
* let test=promisify(fs.readfile,fs)
* test('path',option).then(()=>{}).cateh(()=>{})
* 详情看测试promisify.js
* */
const promisify = (fn, receiver)=> {
    return function(...args) {
        return new Promise(function(resolve, reject) {
            // 这里的回调函数中使用了...操作符,这个是以防
            // callback有多个参数考虑的,依赖这个函数的
            // objectonGenerator在传入函数的时候有可能丢失参数
            // 对于resolve他只传第一个
            console.log(fn);
            fn.apply(receiver,[...args,(err,...rest)=>{
                return err?reject(err):resolve(...rest);
            }]);
        });
    };
};
/**
 * **将一个对象的方法包装成Promise**
 * - property中传入字符串数组,数组中指定的方法将会包装成Promise
 * - 默认的数组针对nedb
 * - 如果不传入target默认是空对象
 * @param {object} target 
 * @param {Array} property 
 */
function objectpromisify(target={}, propertys = ['count', 'find', 'insert', 'update', 'remove']) {
    let len=propertys.length,i=0;
    const hander = {
        get: function (target, property, receiver) {
            while(i<len){
                if(propertys[i]==property){
                    return this._promisify(Reflect.get(target, property), target);
                }
                ++i;
            }
            return Reflect.get(target, property);
        },
        _promisify: promisify,
    }
    return new Proxy(target, hander);
}
/**
 * **介绍**
 * 本函数返回一个对象是否为Promise对象
 * 
 * 返回值为boolean
 * @param {Object} obj 
 * @api private
 * @return {boolean}
 */
function isPromise(obj){
    return /^\[.+Promise]/.test(obj+ "");
}

/**
 * 将Generator函数包装成自动执行函数
 * 最终的返回依赖Generator函数中return的内容
 * 
 * **需要了解的部分**
 * 1. Generator异步返回的结果是对象
 * - 对象格式:{err:null,result}用法和回调一致
 * 2. Generator最后使用yield返回如果是一个Promise
 * - 在最外围的then接受的格式也是{err:null,result}
 * @param {Generator} generator 
 * @param {Mixed} rest
 * @return {Promise}
 */
function makeGenerator(generator,...rest) {
    const gen = generator(...rest);

    return new Promise((resolve, reject) => {
        // 传入非Generator直接resolve
        if (!gen || typeof gen.next !== 'function') return resolve(gen);

        function next(data) {
            // 第一次传入的undefined会被Generator忽略
            let result
            try {
                result = gen.next(data);
            } catch (e) {
                return reject(e);
            }
            if (result.done) return resolve(result.value);

            if (isPromise(result.value)) {
                result.value.then((result) => {
                    // TODO 改写成传入一个对象,第一个为err第二个为参数
                    next({err:null,result:result});
                }).catch((err) => {
                    next({err:err});
                });
            } else {
                return resolve(result.value);
            }
        }
         next();
    });
}


/**
 * **介绍**这是一个将callback包装成
 * 同步形式的函数
 * 
 * - 传入一个对象和对应的需要包装属性名称构成的数组
 * - 也可以是Promise对象
 * - 传入一个Generator函数
 * 
 * 数组格式
 * 1. [[target,[property,property,...]],Promise,[]...]
 * 2. 数组target必须是对象,对应的参数可以不传如果不传默认全部
 * 
 * Generator格式
 * 1. Generator函数形参参数和数组中的target一一对应
 * 2. Generator返回一个Promise对象
 * 
 * @param {Array} Arraylist 
 * @param {Generator} Generator 
 * @return {Promise}
 */
function callbackSync(Arraylist,Generator){
    // 判断数组
    if(Array.isArray(Arraylist)){
        if(Arraylist.length>0){
            let proxylist=[];
            Arraylist.forEach((value)=>{
                // 传入如果是数组的情况
                if(Array.isArray(value)){
                    let target = value[0], propertys = value[1];
                    // 第一个参数不是obj报错
                    if (typeof target !== 'object') throw Error('Error:function Arrylist' + target + 'not object!');

                    // 如果数组第二个参数中指定了更改的属性
                    if (Array.isArray(propertys) && propertys.length > 0) {
                        proxylist.push(objectpromisify.apply(null, value));
                    } else {
                        //  数组第二个参数没有指定更改的属性
                        proxylist.push(objectpromisify.apply(null, [target, Object.keys(target)]));
                    }
                }else if(isPromise(value)){
                    // 如果是Promise对象
                    proxylist.push(valuie);
                }
            });
            return makeGenerator(Generator,...proxylist);
        }
        throw Error('Error:function test Arraylist can not be empty!');
    }
}
// 抽象一种方法
// 参数如下([[target,property],[target,property],[target,property]...],Generator)
// 数组中每一组都会创建一个Proxy代理，将property中提供的属性改成Promise对象
// 这三个proxy会对应的传入Generator函数,所以需要在Generator中接收
module.exports={
    promisify:promisify,
    objectpromisify:objectpromisify,
    makeGenerator:makeGenerator,
    callbackSync: callbackSync,
    isObject:isObject,
}