//本测试主要内容
//测试nedb在多次打开的表现

const nedb=require('nedb');
const db=new nedb({
    filename:'game'
});
db.loadDatabase(err=>{
    console.log(err);
});

const db2=new nedb({
    filename:'game'
});
db2.loadDatabase(err=>{

});
//测试db在写入后,使用db2find是否可以查到
db.insert({name:'foobar'},(err,newdoc)=>{
    if(!err){
        //console.log(newdoc);
    }
});
db.find({},{},(err,newdoc)=>{
    if(!err){
        db2.find({name:'foobar'},{},(err,newdoc)=>{
            if(!err){
                console.log('db2'+newdoc);
            }
        });
    }
})


//多个datebase操作一个文件是没有问的,估计是因为同步的过
//不过其内部可以保证同步写入操作,但是获取是独立分开的
//不过可以使用在回调中嵌入第二次查询的办法来解决这个问题