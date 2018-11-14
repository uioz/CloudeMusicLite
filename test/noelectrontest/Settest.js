// 本文件主要测试Set结构的性能

// 使用数组
// let s = []
// for (let i = 0; i < 10000 * 1000; i++) {
//     s.push(i);
// };
// let begin = new Date().getTime();
// s.push(10000 * 10000 - 1);
// let end = new Date().getTime();
// console.log(`添加消耗${end - begin}ms`);
// begin = new Date().getTime();
// s.indexOf(10000 * 10000 - 1);
// end = new Date().getTime();
// console.log(`判断消耗${end - begin}ms`);
// 添加消耗0ms
// 判断消耗12ms

// 使用Set结构
let s = new Set();
let begin = new Date().getTime();
for (let i = 0; i < 10000 * 1000; i++) {
    s.add(i);
};
let end = new Date().getTime();
console.log(`消耗${end - begin}ms`);
begin = new Date().getTime();
s.add(10000 * 10000 - 1);
end = new Date().getTime();
console.log(`添加消耗${end - begin}ms`);
begin = new Date().getTime();
s.has(10000 * 10000 - 1);
end = new Date().getTime();
console.log(`判断消耗${end - begin}ms`);
// 结论
// 如果数据较小使用数组比较合适
// 如果数据量较大适合使用Set结构