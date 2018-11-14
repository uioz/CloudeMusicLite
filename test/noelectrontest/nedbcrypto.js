// 本文件主要测试nedb的加密
// 对于加密,主要有以下考虑
// 1. 使用nedb加密如果可以加密成功,是否可以获取高加密的js文件因为key放在js文件中
// 2. nedb无法加密,可否使用浏览器的储存加密
// 3. 最后都不可以使用,使用nedb进行简单的加密
const nedb=require('nedb');
const Crypto=require('crypto');
const pathjoin=require('path').join;
let db=new nedb({
    filename:pathjoin(__dirname,'Cryptofiletest'),
    beforeDeserialization:decrypto,
    afterSerialization:encrypto
});
db.loadDatabase((err)=>{
    if(!err){
        console.log('nedb loaded');
    }else{
        console.log('nedb loading failed');
    }
});
function encrypto(string){
    const cipher=Crypto.createCipher('aes192','whatthefuck');
    let test = cipher.update(string, 'utf8', 'hex');
    test+=cipher.final('hex');
    return test;
}
function decrypto(string){
    const decipher=Crypto.createDecipher('aes192','whatthefuck');
    let test = decipher.update(string, 'hex', 'utf8');
    test+=decipher.final('utf8');
    return test;
}
// const content={
//     name:'whatthefuck',
//     game:'darkfive',
//     age:23,
//     admin:true
// }
// db.insert(content,(err,newdoc)=>{
//     if(!err){
//         console.log(newdoc);
//     }else{
//         console.log(err);
//     }
// });
db.find({},{},(err,doc)=>{
    if(!err){
        console.log(doc);
    }else{
        console.log(err);
    }
});