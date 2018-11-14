//测试使用fs.open使用w模式后在使用fs.close
//是否可以创建文件
const fs=require('fs');
const pathjoin = require('path').join;
function createfile(path = pathjoin(__dirname, 'data'), filename = null) {
    if (filename === null) {
        throw Error('Error:Function createfile filename can not be empty');
    }

    let createfilepro = new Promise((resolve, reject) => {
        fs.open(pathjoin(path, filename), 'w', (err, fd) => {
            if (!err) {
                fs.closeSync(fd);
                resolve(true);
            } else {
                reject(err);
            }
        });
    });
    return createfilepro;
}
const createfilepro=createfile(pathjoin(__dirname),'what.js');
createfilepro.then((result)=>{
    console.log(result);
}).catch((err)=>{
    console.log(err);
});