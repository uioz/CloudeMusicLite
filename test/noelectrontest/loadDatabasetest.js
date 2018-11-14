//本文件测试nedb的loadDatabase方法是同步还是异步
const nedb=require('nedb');
let db=new nedb({
    filename:'game'
});
console.log(1);
db.loadDatabase(err=>{
    console.log(2);
});
console.log(3);
//方法是异步的

