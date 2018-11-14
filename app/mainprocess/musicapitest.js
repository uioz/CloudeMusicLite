// 本文件测试musicapi
let api = require('./musicapi');
api = new api();

// api.searchmusicbyString('海阔天空').then((result)=>{
//     console.log(result);
// }).catch((error)=>{
//     console.log(error);
//     // 
// });
// api.searchmusicbyString('Navras').then((result) => {
//     console.log(result);
// }).catch((error) => {
//     console.log(error);
// });
api.geturl('32953014').then((result)=>{
console.log(result);
}).catch((error)=>{
console.log(error);
});
api.geturl('1234566').then((result)=>{
    console.log(result);
}).catch((error)=>{
    console.log(error);
});