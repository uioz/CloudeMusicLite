// 本文件测试异步情况下js代码执行栈的问题
// 或者叫做执行上下文
// 来执行一个普通函数的过程
// 代码走到函数入口的时候在内存中画出一块地址
// 把常量以及预编译过程中可以计算出的变量填入
// 执行栈中,代码执行完成后把控制权交给上级


// 试想如下情况
// 有如下情况,执行一个函数test
// 但是该函数调用另外的一个函数
// 如果是同步代码,test中arr里添加
// 的是game的返回值true,但是假如
// test内部执行另外函数game()中需要
// 填入一个回调函数,而这个回调函数
// 是异步返回的
// 问题:
// 1. 回调函数中如果将调用数组的unshift,数组中有东西吗?
// 2. test()函数调用两次,第二次调用的时候,函数内的arr会被保留吗?
// 3. 假如test调用的game函数是同步的,第二次调用函数内部会有值吗?
function test(){
    let arr=[];
    // game函数传入的是回调,回调函数异步被调用
    arr.push(game(()=>{
        console.log('2:' + arr);// 用于验证arr是否存在
        arr.shift();
        console.log('3:' + arr);// 用于验证arr存在是否改变
    }));
    console.log('1'+arr);// 用于验证arr是否存在
}
function game(callback) {
    setTimeout(() => {
        callback();
    }, 3000);
    return true;
}
// test();
// 问题1结果
// 1true
// 2: true
// 2:

// 测试问题2 调用两次test(),第二次调用的test函数内部arr有值吗?
// test();
// 结果
// 1true
// 1true
// 2: true
// 3:
// 2: true
// 3:
// 说明两次调用test()内部是根本没有干扰的,调用栈完全不一样

let o1={
    what:'whatthefuck'
}
let o2={
    what: 'whatthefuck'
}
console.log(o1===o2);