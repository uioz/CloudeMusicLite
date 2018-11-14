
//本文件测试database.baseMethod方法

// 依赖方法
function isdatabase(){

}
function hasdb() {
    
}
function hasfile() {
    
}
function createdb() {
    
}
function createfile() {
    
}
function removefile() {
    
}


function baseMethod(obj = null) {
    if (obj === null){
        throw Error('Error:function baseMethod obj can not be empty!');
    } else if (!(!!obj && typeof obj != "string" && obj.constructor != Array && /^[\s[]?function|object/.test(obj + ""))){
        throw Error("Error:function baseMethod obj must be function or object!");
    }
        


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
// 测试各种非法传入
// baseMethod() 空传入抛出错误
// baseMethod(123); 传入数值抛出错误
// baseMethod('string'); 传入字符串抛出错误
// baseMethod(true); 传入boolean抛出错误
// baseMethod(false); 同上
// baseMethod(new Array()); 数组错误

// 正常传入函数(非简写形式)
function game(){
}
let newgame=baseMethod(game);
console.log(newgame.prototype);

// 正常传入对象
let newobj=baseMethod({});
console.log(Object.getPrototypeOf(newobj));
