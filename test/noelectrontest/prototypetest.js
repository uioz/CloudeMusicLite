//说明
//本测试主要测试的是给prototype赋值简写的函数是否可以
//以及其中使用this时是是否有副作用
// let test=()=>{
//     console.log(this);
//     console.log('i am test');
//     this.test1();
    
// }
// let test1=()=>{
//     console.log('i am test1');
// }
// function test2(){
//     console.log(this);
//     // test1();
// }
// function game(){

// }
// game.prototype.test=test;
// game.prototype.test1=test1;
// game.prototype.test2=test2;
// let gametest=new game();
// gametest.test();//error
// gametest.test2();//ok

//测试结果
//不可以使用()=>{}来当作一个原型函数
//原因找不着this
//注意
//使用let定义的时候需要注意没有变量提升,这意味着构造函数需要写到最后面
//但是执行test2()中的作用域还是保留了执行上下文,依然可以调用test1()(即使没有this)

// function game(){
// }
// game.prototype.test2=test2;

// let g=new game();
// g.test2();

//经过测试如果使用函数构造器模式
//向原型添加方法或者属性,只可以使用它的prototype属性
//如果已经new 了对象,那么在添加属性就会有以下考虑
//向function.prorotype添加属性方法,就是在向new的对象添加方法
//向对象的原型添加方法,就是向function的prototype添加方法
//已经是对象的情况下,遵循规范如果要添加新的原型方法
//如果当前作用于没有function.prototype的情况下,又不可以使用__proto__
//只能使用Object.setPrototypeOf 和 Object.getProrotypeOf
//没有其他例外了,除非新建一个对象


// 测试对象 修改object.getPrototypeOf返回的对象
// 会改变构造函数的prototype吗?

// function game() {

// }
// game.prototype.test=function(){
//     console.log('i am test');
// }
// let obj=new game();
// let alter = Object.getPrototypeOf(obj);
// console.log(alter===game.prototype);//true
// alter.test1=function(){
//     console.log('i am test1');
// }
// console.log(alter===game.prototype);//true
// console.log(game.prototype);

// 结果 Object.getPrototypeOf返回的是构造函数的引用
// 符合预期




// 以下测试使用构造函数时候
// 向prototype设置一个方法其内部的this
// this就是构造函数所创建的对象
// 如果向prototype赋值一个函数,返回一个函数
// 返回函数中引用了this,此时还是正确的this指向么
// function test(){

// }

// function dark(){
//     // console.log(this);
//     return function (){
//          console.log(this);
//     }
// }

// test.prototype.game=dark();

// let tt=new test();
// tt.game();
// 测试结果出乎意料,但是符合预期,返回的function所指的this就是test构造函数
// 但是需要注意的是,在第一次调用dark()的时候
// dark函数就已经执行了,此处的this指向的是全局,所以不可以在这里书写this

// 本测试测试一个构造函数拥有两个原型方法,调用其中一个
// 会把另外一个设置为null
// 那么另外一个再次调用是否起效?
// function test(){

// }
// test.prototype.game=function (){
//     console.log('i am game');
// }
// test.prototype.dark=function (){
//     this.game=null;
// }
// let tt=new test();
// tt.game();
// tt.dark();
// tt.game();
// 结果符合预期,但是需要注意的是,如果你再次调用
// 被赋值为null的原型方法会报错

// 本测试主要测试原型方法中调用其他函数中this指向的问题
function test(){

}
test.prototype.game=function (){
    console.log(this);
    dark();
}
function dark(){
    //console.log(this);
}
let tt=new test();
tt.game();

// 测试结果，this指向全局