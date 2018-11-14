console.log([{}]+'');
function isObject(obj) {
    return /^\[object.+]/.test(obj + "");
}
console.log(isObject([]));