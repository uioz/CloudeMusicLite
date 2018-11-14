//本文件测试removefile是否正常工作
const pathjoin=require('path').join;
const fs=require('fs');

function removefile(path = null) {
    if (path === null) {
        throw Error('Error:Function removefile path can not be empty');
    }
    let removefilepro = new Promise((resolve, reject) => {
        fs.unlink(path, (err) => {
            if (!err) {
                resolve(true)
            } else {
                reject({
                    err: 'removefile failed'
                });
            }
        });
    });
    return removefilepro;
}
let removefilepro=removefile(pathjoin(__dirname,'what.js'));
removefilepro.then((result)=>{
    console.log(result);
}).catch((err)=>{
    console.log(err);
});