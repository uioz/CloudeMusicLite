// 
const fs=require('fs');

const fspro=new Promise((resolve,reject)=>{
    fs.access(__dirname+'//game',(err)=>{
        if(!err){
            resolve(true);
        }else{
            reject(false);
        }
    });
});

fspro.then((result)=>{
    console.log(result);
}).catch((err)=>{
    console.log(err);
});

// 对于一个拥有回调的方法,我们可以轻松的把它改成一个Promise对象
// 他可以使用then 和 catch 其中放置着处理两种不同情况的代码
// 但是有没有发现,实际上then 和 catch 在本例中相当于就是担当了
// true 和 false 代码块的角色
// 这本身并不复杂,但是常见的业务逻辑需要很多的判断
// 比如打开一个文件的逻辑,当然只是举例而已
/**
 * 判断一个文件是否存在
 *    存在            不存在
 *    打开             创建
 * 读取  打不开     打开   创建不了
 *        报错              报错  (假设到这一层就不执行操作了)
 */
// 参考这个逻辑,我们可以编写如下的同步代码(伪代码)
if(hasfile){
    // 存在
    if(fileopen()){
        read();
    }else{
        throw Error('打不开');
    }
}else{
    // 不存在
    if(createfile('test')){
        read();
    }else{
        throw Error('无法创建');
    }
}
// 使用同步代码书写很正常,可是这如何换到Promise中?
const hasfile=new Promise((resolve,reject)=>{
    fs.access(__dirname+'//game',(err)=>{
        if(!err){
            resolve(true);
        }else{
            reject(err);
        }
    });
});
/**
 * 判断一个文件是否存在
 *    存在        不存在
 *    打开         创建
 * 读取  打不开  打开   创建不了
 *       报错             报错  (假设到这一层就不执行操作了)
 */


// 为了保证Promise对象的链式调用,then 和 catch中返回下一个Promise对象
hasfile.then((result)=>{
    // 有文件,执行打开方法
    const fsopenpro=new Promise((resolve,reject)=>{
        fs.open(__dirname+"//game",(err,fd)=>{
            if(!err){
                resolve(fd);
            }else{
                throw Error(err);
            }
        });
    });
    return fsopenpro;
}).catch((err)=>{
    // 没有文件,执行创建方法
    const fscreatepro = new Promise((resolve, reject) => {
        fs.createfile(__dirname + "//game", (err, fd) => {
            if (!err) {
                resolve(fd);
            } else {
                throw Error(err);
            }
        });
    });
    return fscreatepro;
    }) // 到目前为止,代码进行的很顺利,可是到了下一步就不那么容易了
.then((result)=>{
    // fsopenpro 和 fscreatepro 都有可能执行这个then


})
// Promise可不允许你向if那么容易的表达