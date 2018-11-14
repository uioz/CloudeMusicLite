//测试nedb的路径创建
//增删改查
//批量增删改查
const nedb=require('nedb');
const path=require('path').join;
console.log(path(__dirname,'../','game'))
const db=new nedb({
    filename:path(__dirname,'../','game'),
});
db.loadDatabase(err=>{
    console.log('err'+err);
});
console.log(db.filename);
// let game ={
//     songs:{
//         what:{

//         },
//         dark:{

//         }
//     }
// }

// db.insert(game,(err,newdoc)=>{
//     if(!err){
//         console.log(newdoc);
//     }
// });

// Set an existing field's value 

// db.find({songs:'dark'},(err,newdoc)=>{
//     if(!err){
//         console.log(newdoc)
//     }
// });
// db.update({'songs.name':'dark'},{$set:{'songs.name':'game'}}, {}, function (err, numReplaced) {
//     console.log(err);
//     // numReplaced = 3 
//     // Field 'system' on Mars, Earth, Jupiter now has value 'solar system' 
//   });
//数组里不要套对象

// db.update({ planet: 'Jupiter' }, { planet: 'Pluton'}, {}, function (err, numReplaced) {
//     // numReplaced = 1
//     // The doc #3 has been replaced by { _id: 'id3', planet: 'Pluton' }
//     // Note that the _id is kept unchanged, and the document has been replaced
//     // (the 'system' and inhabited fields are not here anymore)
//   });






/**
 * 已知nedb保存的不是json格式的文件,所以不用在乎json格式
 * 一个文件就是一个数据库,而一行就是一个表,一个属性就是一个行
 * 所以可以这样设计一个数据库
 * 一个用户一张表
 * 表下的属性有songs等等
 * 而且这个东西不像其他的类json数据库,返回的内容是不能链式调用的
 * 
 * 查询时候的规则
 * 所有开头都是以{}开始
 * 一般来说{'键':'值'}就是和数据库中
 * 键值完全对应
 * 如果要添加规则，规则都是写在值的上面
 * 以对象的形式表现，而对象的键值规则，值是
 * 对于规则的表达式
 * 对于一个普通的键值对应
 * 我们想返回songs>5的情况
 * {'songs':{$gt:5}}
 * 更多的规则的话直接添加更多的键值对
 * {'songs':{$gt:5,$regex:/123/,$ne:'hello'}}
 * 就是songs下>5而且匹配123的正则和不等于hello的数据
 * 当然可以使用更复杂的规则
 * {'users':{$or:[{name:'game'},{name,'haha'},{name,'dd'}]}}
 * 甚至可以用where,他会将对象传入一个函数，函数中this是对象本身
 * 返回的必须是一个boolean,使用where改写上面的内容
 * {'users':{$where:obj=>name in obj?obj.name=='game'||obj.name=='haha'||obj.name='dd':false}}
 * 使用update的简单规则
 */
/**
 * 根据多轮测试的结果表明
 * 最好指定多张表格,因为数据库限制无法在数组中更新对象
 * 导致不可以在一个数组中保存多个对象,对象是歌曲
 * 我们可以把一行当作一首歌,有name属性 time属性之类的
 * 再建立一张用户表格,用户表格中对应着曲库,而用户和
 * 曲库之间的连接使用id连接
 */