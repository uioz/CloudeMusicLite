'use strict';

function eventRegister() {
    let event = require('events');
    this.__proto__ = Object.setPrototypeOf({}, event.prototype);
}

function testinit() {
    eventRegister.call(this);
    
    this.timer = undefined;
    /**
     * test
     */
    this.trgger = function() {
        this.timer = setTimeout(()=>{
            console.log(Date.now());
            this.emit('progress');
            return this.trgger.call(this);
        }, 100);
    };
    this.clear=function () {
        clearTimeout(this.timer);
    };
}
console.log('堆初始用量'+process.memoryUsage().heapUsed);
let game=new testinit();
game.trgger();
game.on('progress',()=>{
    console.log('堆使用量'+process.memoryUsage().heapUsed);
});