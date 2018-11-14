

const events = require('events');


let ipc = {};
ipc.__proto__ = Object.setPrototypeOf({}, events.prototype);



function package(list, ipc) {
    // 必须是列表
    if (list.length >= 2 && typeof list[list.length - 1] == 'number') {
        this.startindex = list.pop() - 1;
        this.list = list;
        this.playmode = 'listcycle';

        function setresult(index) {
            result = Object.assign({}, list[index]);
            this._addplayhistory(result);
            this.startindex++;
            return result;
        };
        /**
         * getinf该方法立即返回
         * 即将播放的歌曲的信息
         */
        function getinf() {
            var isended = (this.startindex == this.list.length - 1);
            // 此举是为了在order情况下向对象写入ended属性
            var result = Object.assign({}, list[this.startindex]);

            switch (this.playmode) {
                case 'order':
                    if (isended) result.ended = true;
                    break;
                case 'single':
                case 'listcycle':
                    if (isended)this.startindex=0;
                    break;
                case 'random':
                    this.startindex = Math.floor(Math.random() * this.list.length);
                    result = Object.assign({}, list[this.startindex]);
                    // 如果随机模式下最后一个是结尾,那么重置下标为0,防止切换模式出错
                    if (this.startindex == this.list.length - 1){
                        isended=true;
                        this.startindex=0;
                    }else{
                        // 如果不是最后一个,将下标加一
                        // 是为了在切换循环播放的时候不再次播放本歌曲
                        this.startindex++;
                    }
                    break;
            }
            // 如果当前不是最后一个
            if(!isended)this.startindex++;
            this._addplayhistory(result);
            return result;
        };
        this.getinf = getinf;
        /**
         * 异步的返回src,返回格式{id:...,src:...}
         * 回调函数中需要两个参数
         * - err 可能的值有 timeout (可靠结果)
         * - result 结果
         * 
         * **有意将信息获取和歌曲地址获取分开是为了提高效率**
         * 因为用户有可能一直连续更改歌曲,而且为了确保可靠性
         * 只有歌曲信息和srcid一致的时候才会进行更换新的src
         * @param {function} callback
         */
        function getsrc(callback) {
            ipc.emit('getsrcbypackage');
            // TODO 本方法将hack掉timeout
            ipc.on('setsrcbylist', (result) => {
                switch (result) {
                    case 'timeout':
                        // 超时再次确认
                        checkerror((err, result) => {
                            if (!err) {
                                callback(null, result);
                            } else {
                                callback('timeout');
                            }
                        });
                        break;
                    case 'destroy':
                        callback = null;
                        break;
                    default:
                        callback(null, result);
                }
            });
        };
        this.getsrc = getsrc;
        /**
         * 切换播放模式函数,
         * 需要注意的是虽然提供了single模式
         * 但是进入single模式后,循环播放
         * 只会触发一次,因为使用loop的audio
         * 不会触发ended事件
         * @param {*} string 
         */
        function changeplaymode(string) {

            switch (string) {
                case 'listcycle':
                case 'single':
                case 'random':
                case 'order':
                    this.playmode = string;
                    break;
            }
        };
        this.changeplaymode = changeplaymode;
        /**
         * 内部函数调用后
         * 将当前播放的内容填入历史记录中
         * 需要在获取歌曲成功后调用
         * @param {boolean} isplayed
         */
        function _addplayhistory(result) {
            ipc.emit('setplayhistorybypackage', result);
        };
        this._addplayhistory = _addplayhistory;
        /**
         * 播放缓存音乐的时候有可能歌曲已经不存在
         * audio对象报错的时候如果检测出错误是由于
         * 本地歌曲不存在引起的,调用此api,交由列表检测
         * 然后本方法再次获取歌曲信息
         * @api private
         */
        function checkerror(callback) {
            // 检测最后一首歌错误
            ipc.emit('checksrcoflastsong');
            // 实质上和getsrc作用一样只是再次确认一遍罢了
            ipc.on('lastsongerrorresult', (result) => {
                switch (result) {
                    case 'destroy':
                        callback('destroy');
                        break;
                    case 'timeout':
                        callback('timeout');
                        break;
                    default:
                        callback(null, result);
                        break;
                }
            });
        };
        // this.checkerror = checkerror;
    } else {
        throw Error('Error function package param list must be array and length greater than or equal to two');
    }
};

list = [{
    id: 1,
    src: 'src/Mich-Fade (Mich Remix) .mp3',
    otherinf: {
        songname: 'Mich-Fade (Mich Remix)',
        singer: 'Mich Remix',
        album: '',
        songsource: '本地歌曲'
    }
}, {
    id: 12,
    src: 'src/Mich-Fade (Mich Remix) .mp3',
    otherinf: {
        songname: 'Mich-Fade (Mich Remix)',
        singer: 'Mich Remix',
        album: '',
        songsource: '本地歌曲'
    }
}, {
    id: 123,
    src: 'src/Mich-Fade (Mich Remix) .mp3',
    otherinf: {
        songname: 'Mich-Fade (Mich Remix)',
        singer: 'Mich Remix',
        album: '',
        songsource: '本地歌曲'
    }
}, {
    id: 1234,
    src: 'src/Mich-Fade (Mich Remix) .mp3',
    otherinf: {
        songname: 'Mich-Fade (Mich Remix)',
        singer: 'Mich Remix',
        album: '',
        songsource: '本地歌曲'
    }
}, 1];



let test = new package(list, ipc);
ipc.on('setplayhistorybypackage', (result) => {
    console.log(result);
});
test.getinf();
test.getinf();
test.getinf();
test.changeplaymode('random');
test.getinf();
test.changeplaymode('listcycle');
test.getinf();
test.getinf();
test.getinf();


