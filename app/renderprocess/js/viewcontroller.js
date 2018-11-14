/**
 * 系统界面控制器的构造函数
 */
function systemviewinit(ipc) {
    // 统一注册菜单栏按钮组事件
    this.controlButtonGroupRegister(ipc);
};
systemviewinit.prototype.controlButtonGroupRegister = function (ipc) {
    if ($.type(ipc) !== 'object') throw Error('Error function controlButtonGroupRegister must be object!');
    //  三个按钮的功能的触发
    $('.closewindowbutton').on('click', () => {
        // TODO在macos中有可能关闭并不释放内存
        // 所以只是关闭界面,关闭窗体前记得把渲染进程
        // 影响主进程的功能在前面关闭
        ipc.emit('buttonsgroupevent', 'close');
    });
    $('.maximize').on('click', () => {
        ipc.emit('buttonsgroupevent', 'max')
    });
    $('.minimize').on('click', () => {
        ipc.emit('buttonsgroupevent', 'min');
    });
};
/**
 * 列表界面控制器的构造函数
 * 需要说明的是,和audio不一样,list需要进行大量的dom操作
 * 如果将需要保存的内容和dom操作放在一起,十分混乱
 * 利用ipc,将列表界面和列表内容分开
 */
function listviewinit(ipc) {
    this.ipc = ipc;
    // TODO 临时id
    this.userid = 100137587;
    // 用于缓存上一个页面的id用于添加动画
    this.cacheforbeforepage = null;
    // 挂载当前播放列表测试,和audio交互测试
    this.playinglistRegister();
    // 挂载我的歌单事件注册
    this.playlistpageRegister();
    // 本地管理事件注册
    this.localpageRegister();
    // 用于swiper父级的事件注册,用于处理swiper内点击的打开的情况
    // this.swipercontainerclickRegister();
    // 挂载列表卡片内容且切换的事件
    this.listcardcontentchangedRegister();
    // 挂载搜索和选项卡事件注册
    this.tabandsearchRegister();
    // 列表首页延迟加载
    this.homepagedelayload();
    // TODO 测试 歌单列表数据填充
    // this.playlistdataRegister();
    // TODO 测试 本地歌曲列表数据填充
    this.localsongsloadtest();
};
listviewinit.prototype.playlistdataRegister = function () {
    // 点击我喜欢的列表,请求歌单数据 id==歌单id
    this.ipc.on('getplaylistresult', (id) => {
        this.ipc.emit('refreshplaylist', id, result);
    });
    // 触发数据填充,填充用户歌单页面数据
    this.ipc.emit('setuserplaylist', result);
};
listviewinit.prototype.localsongsloadtest = function () {
    this.ipc.emit('setuserlocalsongs', {
        result: [{
            listname: '哈哈哈',
            listid: 531548,
            localid: 1178916,
            musicid: 1597213,
            songname: 'lrc',
            result: {
                otherinf: {
                    artists: '李元杰',
                    artistsid: 2598975,
                    album: '喜欢',
                    albumid: 156756,
                    songsource: 'null'
                },
                cache: false,
                src: null,
                folderpath: null,
                time: null,
                duration: 1000,
                like: true,
                download: false,
                collection: true
            }
        }, {
            listname: '哈哈哈',
            listid: 531548,
            localid: 1178916,
            musicid: 1597213,
            songname: 'nmb',
            result: {
                otherinf: {
                    artists: '李元杰',
                    artistsid: 2598975,
                    album: '喜欢',
                    albumid: 156756,
                    songsource: 'null'
                },
                cache: false,
                src: null,
                folderpath: null,
                time: null,
                duration: 1000,
                like: true,
                download: false,
                collection: true
            }
        }, {
            listname: '嘿嘿嘿',
            listid: '1675612',
            localid: '4897513',
            musicid: 1347836,
            songname: '慢慢喜欢你',
            result: {
                otherinf: {
                    artists: '莫文蔚',
                    artistsid: 1643765,
                    album: '抠鼻',
                    albumid: 1234875,
                    songsource: null
                },
                cache: true,
                src: null,
                folderpath: null,
                time: null,
                duration: 1000,
                like: false,
                download: true,
                collection: false
            }
        }, {
            listname: '喜欢的是',
            listid: 162647,
            localid: 5675465,
            musicid: 134573,
            songname: '听听我说的吧',
            result: {
                otherinf: {
                    artists: '蔡徐坤',
                    artistsid: 1324873,
                    album: '滑稽',
                    albumid: 1234865,
                    songsource: 'null'
                },
                cache: false,
                src: null,
                folderpath: null,
                time: null,
                duration: 1000,
                like: false,
                download: false,
                collection: true
            }
        },
        {
            listname: '哦哦哦',
            listid: 164675,
            localid: 1324783,
            musicid: 1347563,
            songname: 'rc',
            result: {
                otherinf: {
                    artists: '房东的猫',
                    artistsid: 765833,
                    album: '额额',
                    albumid: 1487653,
                    songsource: null
                },
                cache: false,
                src: null,
                folderpath: null,
                time: null,
                duration: 1000,
                like: true,
                download: true,
                collection: true
            }
        },
        {
            listname: '啊啊啊',
            listid: 465766,
            localid: 7895636,
            musicid: 4567676,
            songname: 'zmbgszh',
            result: {
                otherinf: {
                    artists: '花粥',
                    artistsid: 1345756,
                    album: '了了',
                    albumid: 13248653,
                    songsource: null
                },
                cache: true,
                src: null,
                folderpath: null,
                time: null,
                duration: 1000,
                like: true,
                download: false,
                collection: true
            }
        },
        {
            listname: '而无法',
            listid: 465763,
            localid: 976466,
            musicid: 7564659,
            songname: '探清水河',
            result: {
                otherinf: {
                    artists: '晓月老板',
                    artistsid: 7897561,
                    album: '额额',
                    albumid: 1234776,
                    songsource: null
                },
                cache: false,
                src: null,
                folderpath: null,
                time: null,
                duration: 1000,
                like: false,
                download: true,
                collection: false
            }
        }, {
            listname: '电话费',
            listid: 756123,
            localid: 751326,
            musicid: 756132,
            songname: 'sjjt',
            result: {
                otherinf: {
                    artists: 'sihan',
                    artistsid: 1567563,
                    album: '好啊好啊',
                    albumid: 7941234,
                    songsource: null
                },
                cache: true,
                src: null,
                folderpath: null,
                time: null,
                duration: 1000,
                like: true,
                download: true,
                collection: false
            }
        }, {
            listname: '读书卡',
            listid: 564756,
            localid: 789123,
            musicid: 784123,
            songname: '归还',
            result: {
                otherinf: {
                    artists: '陈泓宇',
                    artistsid: 1234379,
                    album: '而且',
                    albumid: 1313457,
                    songsource: null
                },
                cache: false,
                src: null,
                folderpath: null,
                time: null,
                duration: 1000,
                like: false,
                download: false,
                collection: true
            }
        }, {
            listname: '企鹅',
            listid: 4464336,
            localid: 456736,
            musicid: 7541356,
            songname: 'ag',
            result: {
                otherinf: {
                    artists: '苏羽扬',
                    artistsid: 1234796,
                    album: '奋斗',
                    albumid: 1234633,
                    songsource: null
                },
                cache: true,
                src: null,
                folderpath: null,
                time: null,
                duration: 1000,
                like: true,
                download: false,
                collection: true
            }
        }, {
            listname: '热污染',
            listid: 4567633,
            localid: 332211,
            musicid: 7894233,
            songname: '做我的猫',
            result: {
                otherinf: {
                    artists: '满舒克',
                    artistsid: 1627666,
                    album: '撒旦',
                    albumid: 1213248,
                    songsource: null
                },
                cache: false,
                src: null,
                folderpath: null,
                time: null,
                duration: 1000,
                like: false,
                download: false,
                collection: false
            }
        }]
    });
};


/**
 * 本地管理页面的注册，主要分为以下几个部分
 * 1. 下载管理
 * 2. 本地管理
 * 3. 文件夹管理
 */
listviewinit.prototype.localpageRegister = function () {
    var that = this;

    /**
     * 用于简单管理本地歌曲文件的储存利用ipc进行信息传递
     * 
     * 主要触发的ipc事件有 (待定)
     * - openmodelpagebylcoaldatabase 打开模态框事件 将模态框需要的信息传递过去
     * - 
     */
    var database = {
        data: undefined,
        // 用于保存对于this.data实际影响操作的步骤数
        // 例如:移出 添加localid 但是仅仅是检索到数据然后发送是不影响数据的所以不保存步数
        Operationstack: 0,
        // 保存settimeout返回的数值
        senddatalocalnumber: 0,
        // 用于判断是否设置了延时函数
        hassettimeoutfun: false,
        setdata: function (data) {
            this.data = data;
        },
        getdata: function () {
            return this.data;
        },
        /**
         * 该函数在修改了data中的数据后进行调用
         * 
         * 调用该函数计算执行了几次对数据的操作超过5次后进行后端同步
         * 如果在5次内则延时10后同步
         */
        stackplus: function () {
            if (this.Operationstack > 4) {
                if (this.hassettimeoutfun) {
                    clearTimeout(this.senddatalocalnumber);
                    this.hassettimeoutfun = false;
                }
                that.ipc.send('refreshlocaldata', this.data);
                this.Operationstack = 0;
            } else {
                this.Operationstack++;
                if (!this.hassettimeoutfun) {
                    this.hassettimeoutfun = true;
                    this.senddatalocalnumber = setTimeout(() => {
                        that.ipc.send('refreshlocaldata', this.data);
                        this.Operationstack = 0;
                    }, 10000);
                }
            }
        },
        createRandomId: function () {
            if (!this.data) return;
            return (Math.random() * 10000000).toString(16).substr(0, 4) + '-' + (new Date()).getTime() + '-' + Math.random().toString().substr(2, 5);
        },
        /**
         * 给传入的对象添加一个唯一localid属性
         * @param {Object} 用于被设置的对象
         */
        setlocalid: function (elem) {
            elem.localid = this.createRandomId();
            return this.stackplus();
        },
        /**
         * 用于遍历当前数组判断数组中是否有该值的存在
         * - 参数 attr是需要比较的值
         * - 参数 equals 字符串也是循环中指定比较的数组对象
         * @param {*} attr 需要比较的值
         * @param {String} equals 数组的属性 
         * @returns {Boolean|Object} Object结果 or false 是否查找到
         */
        each: function (attr, equals) {
            var arr = this.data.reuslt;
            var i = 0, len = arr.length;
            while (i < len) {
                if (attr == arr[i][equals]) {
                    return i;
                }
                i++;
            }
            return false;
        },
        /**
         * 该方法用于检查项目是否存在于列表中并返回一个index值
         * - 需要传入musicid 和 localid 如果查找到了返回内容下标,如果两个参数都没有找到则返回false
         * - 依赖该方法的有 getcanplaylist removeitem
         * @param {String|number} musicid 用于查找次要比较flag
         * @param {String|number} localid 用于查找首要比较flag
         * @returns {Boolean|Number}
         */
        checkitem: function (musicid, localid) {
            var i = false;
            if (localid) {
                i = this.each(localid, 'localid');
            } else if (!!musicid) {
                i = this.each(musicid, 'musicid');
                this.setlocalid(this.data.result[i]);
            }
            return i;
        },
        /**
         * 该方法提供将data深拷贝一份而且为其添加当前播放id的功能
         * 适合在播放列表中使用
         * 
         * - 注意 如果两次查找均没有找到将抛出一个错误
         * @param {String|number} musicid 用于查找次要比较flag
         * @param {String|number} localid 用于查找首要比较flag
         */
        getcanplaylist: function (musicid, localid) {
            var arr = this.data.result, i = 0, len = arr.length;
            i = this.checkitem(musicid, localid);
            if (i <= len) {
                return JSON.parse(JSON.stringify(this.data)).playnowid = i;
            } else {
                throw Error("Error can not find item:查找不到ID");
            }
        },
        removeitem: function (musicid, localid) {
            var arr = this.data.result, i = 0, len = arr.length;
            // 查找id 保存在变量i上
            i = this.checkitem(musicid, localid);
            // 小于len即表示循环中途break;掉了也就是找到了
            if (i <= len) {
                arr.splice(i, 1);
                return this.stackplus();
            }
        },
        /**
         * 该方法负责查询json对象利用ipc传递检索到的信息,没有信息不会产生任何效果
         * 
         * **参数**
         * - name 触发事件元素内部的文本 例如: 点击歌曲触发的改事件对应的就是该歌曲名称
         * - localid 用于检索的id
         */
        search: function (musicid, localid) {
            if (!this.data && localid) return false;
            var result = this.checkitem(musicid, localid);
            if(result){
                return this.data.result[result];
            }
            return result;
        },
        getfilepath: function (musicid, localid) {
            var arr= this.search(musicid, localid);
            // 如果找到数组返回内容
            if(arr){
                return arr.result.folderpath;
            }
            // 找不到返回flase
            return arr;
        }
    };

    // 构造函数挂架
    var createcenter = {
        localsongs: undefined,
        foldermanagement: undefined,
    };
    var process={
        /**
         * 用于解析本地数据字符串
         * - 参数 data 需要解析的数据 列表格式v4.1
         * - 返回 string 格式化好的html字符串
         * @param {Object} 需要解析的数据
         * @returns 返回的字符串
         */
        formatoflocallist:function (data){
            // 解析可能有变动
            // 排序内容
            var array = data.result;
            var BCP47code = 'zh-CN', options = { ignorePunctuation: true };
            array.sort((param1, param2) => {
                return param1.songname.localeCompare(param2.songname, BCP47code, options);
            });
            // 字符串制作
            BCP47code = 0, options = array.length;
            var stringcache = '';
            while (BCP47code < options) {
                var cache = array[BCP47code];
                stringcache += `<li data-artistsid="${cache.result.otherinf.artistsid}" data-albumid="${cache.result.otherinf.albumid}" data-musicid="${cache.musicid}">
										<div class="autolist-row-2-left">
											<div>
												<span data-type="searchbymusicid" class="cursor-pointer">${cache.songname}</span>
											</div>
											<div>
												<span data-type="searchbyartistsid" class="cursor-pointer">${cache.result.otherinf.artists}</span>
											</div>
											<div>
												<span data-type="searchbyalbumid" class="cursor-pointer">${cache.result.otherinf.album}</span>
											</div>
										</div>
										<div class="autolist-row-2-right">
											<div data-type="playbutton" class="cursor-pointer" title="点击播放">
												<span class="fa fa-play fa-lg"></span>
											</div>
											<div data-type="likebutton" class="cursor-pointer" title="收藏到歌单">
												<span class="fa fa-plus-square-o fa-lg"></span>
											</div>
											<div data-type="openfolderbutton" class="cursor-pointer" title="打开文件夹">
												<span class="fa fa-folder-open fa-lg"></span>
											</div>
											<div data-type="removebutton" class="cursor-pointer" title="移出列表">
												<span class="fa fa-remove fa-lg"></span>
											</div>
										</div>
									</li>`;
                BCP47code++;
            }
            // 将数据交由上级
            database.setdata(data);
            return stringcache;
        },
        /**
         * 用于解析本地文件夹JSON数据格式,该格式的读取实际上有两种
         * 1. 本地路径有变化全新解析 - 先模板化 - 再生成需要的数据然后进行向后端填充
         * 2. 加载已经存在的格式 - 直接模板化
         * @param {Object} data 需要解析的JSON数据
         * @returns String 解析后的字符串
         */
        formatoflocalfolder:function (data){
            // 判断数据格式 如果是本地数据v4.1执行步骤1 如果是纯数组执行步骤2
            /**
             * 该函数返回解析后的字符串
             * @param {Array} data 
             * @returns string
             */
            function getHtml(data) {
                var result="",i,len=data.length;
                while (i<len) {
                    result += `<li title="${data[i]}">
										<span class="fa fa-chevron-right fa-lg flag"></span>
										<span class="textoverflowhidden flag">${data[i]}</span>
										<div class="cursor-pointer flag" title="移除文件夹">
											<span class="fa fa-remove fa-lg"></span>
										</div>
									</li>`
                    i++;
                }
                return result;
            };
            if(Array.isArray(data)){
                return getHtml(data);
            }else{
                var result=data.result,i=0,len=array.length;
                var array=[];
                while (i<len) {
                    array.push(result[i].result.folderpath);
                    i++;
                }
                if(array.length==0)return '';
                return getHtml(array);
                // TODO 书写列表展开函数 2018年4月2日 20:40:09
            }
        },
        /**
         * 用于本地列表标题栏的创建
         */
        createlistoflocallist:function (elem,HTMLstring){
            // 和我的歌单页面的逻辑不一样 本地列表第一加载,li中的内容就已经准备好了,所以内容将在此处追加进去
            elem.find('.autolist-row-2').append(HTMLstring);
            return elem.children();
        },
        /**
         * 用于本地文件夹的管理
         */
        createlistoflocalfloder:function (elem,HTMLstring){
            elem.find('.autolist-row-2').append(HTMLstring);
            return elem.children();
        },
            /**
         * 本函数用于用户点击本地列表的左边三个选项的时候创建新窗口
         * - 参数 elem jquery对象 也是用户点击的元素一般为span
         * - 参数 type string 元素点击对应的id名称 取值有 musicid artistsid albumid
         */
        processformodelwindow:function (elem,type){
            var name = elem.text(), elemfather = elem.parents('li[data-artistsid][data-albumid][data-musicid]');

            that.ipc.emit('openmodelpagebylcoaldatabase', type, name, elemfather.data(type));
        },
            /**
         * 本函数用于处理用户点击本地歌曲项目的时候点击右边的内容
         * 对歌曲进行操作的处理
         * - 参数 jquery对象 也是用户点击的元素一般为div
         * - 参数 type string 用于判断是哪个元素被点击
         */
        processforlcoalsong:function (elem,type){
            var elemfather = elem.parents('li[data-artistsid][data-albumid][data-musicid]');
            switch (type) {
                case 'removebutton':
                    database.removeitem(elemfather.data('musicid'), elemfather.data('localid'));
                    return elemfather.empty();
                    break;
                case 'playbutton':
                    try {
                        that.ipc.emit('locallistupdate', database.getcanplaylist(elemfather.data('musicid'), elemfather.data('localid')));
                    } catch (error) {
                        // TODO 抛出错误未查找到
                    }
                    break;
                case 'likebutton':
                    // 给没有添加localid的元素添加id
                    var result = database.search(elemfather.data('musicid'), elemfather.data('localid'));
                    if (reuslt) {
                        that.ipc.emit('locallistlike', elemfather.data('musicid'), elemfather.data('localid'));
                    } else {
                        // TODO 抛出查找失败错误
                    }
                    break;
                case 'openfolderbutton':
                    // 过滤掉没有用的类型
                    var result = database.getfilepath(elemfather.data('musicid'), elemfather.data('localid'));
                    if (typeof reuslt == 'string') {
                        that.ipc.emit('locallistopenfolderbutton', result);
                    } else {
                        // TODO 抛出查找失败错误
                    }
                    break;
            }
        },
        /**
         * 当用户点击对象的时候并且目标触发事件被拦截后移送到该函数处理
         * 
         * 拦截本地歌曲的所有点击事件
         * @param {object} elem 
         */
        clickevent:function (elem){
            var datatype = elem.data('type');
            switch (datatype) {
                case 'searchbymusicid':
                case 'searchbyartistsid':
                case 'searchbyalbumid':
                    return process.processformodelwindow(elem, datatype.split('by')[1]);
                    break;
                case 'playbutton':
                case 'likebutton':
                case 'openfolderbutton':
                case 'removebutton':
                    return process.processforlcoalsong(elem, datatype);
                    break;
                default:
                    // TODO 报错
                    break;
            }
        },
        /**
         * 双击事件在本地列表中不做处理
         */
        nulldblclickevent:function (){

        },
        /**
         * 打开事件对于本地列表来说不做处理
         */
        nullopenevent:function (){
        
        }
    };
    /**
     * 分析本地歌曲功能
     * 首先需要初始化初始化后填入
     * 这里引出两个问题,初始化何时完成,根据设计在窗口加载完成前数据就已近被送到了页面
     * 而如果用户点击的太快的话点击事件是没有被注册的 结果:不用担心
     * //
     * 初始化后创建一个对象,所有的处理交由该对象处理
     * 这里有引出一个问题,本地数据是保留在html中还是在json中保存在变量中
     * 两种操作都很繁琐,但是将数据格式化到html还需要额外操作不如直接放入josn中使用id进行区分
     * //
     * 添加分为两种一种是立即添加,另外一种是显式添加即只是看的到而已但是数据并没有写入,只是被缓存了起来,延迟写入
     * 移出则是统一显式移出而后延迟向服务端发送清除请求
     * //
     * 为了让用户有主动控制权,移出后的文件会在软件目录中创建一个文件,以json格式保存了路径和隐藏歌曲的关系
     * 而获取本地歌曲的时候会先打开数据库读取用户的所有歌曲,然后打开json文件,进行比较将隐藏的歌曲标记上隐藏flag
     * 将其他的隐藏flag取消标记,而将无匹配的删除,如果错误,则删除文件,放弃匹配直接打开,并弹出错误窗口
     */
    this.ipc.on('setuserlocalsongs', (result) => {
        if (typeof result !== 'string') {
            if (!createcenter.localsongs) {
                createcenter.localsongs = new this.universallistclass($('#localplaylist'),process.createlistoflocallist,process.formatoflocallist(result));
                createcenter.localsongs.listopeneventregister(process.nullopenevent);
                createcenter.localsongs.listclickeventregister(process.clickevent,process.nulldblclickevent);
            } else {
                createcenter.localsongs.init($('#localplaylist'),process.createlistoflocallist,process.formatoflocallist(result));
            }
        }
    });
    this.ipc.on('setuserlocalflolders',(result)=>{
        if(typeof result !== 'string'){
            if (!createcenter.foldermanagement){
                // TODO 使用模板函数快速创建本地文件夹管理
                createcenter.localsongs = new this.universallistclass($('flodermanagement'),process.createlistoflocalfloder,process.formatoflocalfolder(result))
            }else{
                
            }
        }
    });
};
/**
 * 本函数用于托管列表对象 返回一个对象
 * 首次运行需要传入 类名为listcard对象 列表创建器(一个函数) 和 用于插入到html中的字符串
 */
listviewinit.prototype.universallistclass = function (elem, callback, strarray) {
    // 两个阶段创建阶段第一阶段需要传入构造器和解析器，因为每个ul的创建和解析都不一样
    // elem 返回的是数组或者单个元素，用于统一的注册事件
    var that = this;
    function test() {
        this.ipc = that.ipc;
        /**
         * 用于清空所有的下拉列表栏,一般用于刷新所有的列表组的时候
         */
        this.clearlist = function () {
            if (!this.elems.length) {
                this.elems.remove();
            }
        };
        /**
         * 删除所有的列表组的hidden类,一般用于列表载入dom后,在删除隐藏类
         */
        this.removehiddenclass = function (elem) {
            elem.children().removeClass('hidden');
        };
        /**
         * 列表点击后展开事件的注册,一般用于列表创建后注册
         * 该方法提供了callback参数
         *  - callback 该参数是一个回调,该回调提供一个参数及被点击的对象(jquery)
         */
        this.listopeneventregister = function (clickfun) {
            var elem = this.elems.length;
            if (elem) {
                elem = $(this.elems[0]);
            } else {
                elem = this.elems.end()
            }
            elem.parent('div').on('click', '.suptitle', function () {
                var elem = $(this);
                if (elem.next('ul').children().length == 1) {
                    clickfun(elem);
                }
                if (elem.data('switch')) {
                    elem.next('ul').removeClass('playlistopen').addClass('playlistclosed');
                    setTimeout(() => {
                        elem.next('ul').addClass('hidden');
                    }, 260);
                    elem.find('span.fa-sort-down').removeClass('palylistmarkopen').addClass('palylistmarkclosed');
                    elem.data('switch', false);
                } else {
                    elem.next('ul').removeClass('hidden playlistclosed').addClass('playlistopen');
                    elem.find('span.fa-sort-down').removeClass('palylistmarkclosed').addClass('palylistmarkopen');
                    elem.data('switch', true);
                }
            });
        };
        /**
         * 用于注册列表内容点击及双击的事件 该方法是一次性的建议只调用一次
         * 
         * 该方法提供了两个回调 一个是span元素点击产生的回调 另外一个是双击产生的回调
         * 
         * 每个回调都提供了一个参数是jquery对象,即该事件触发时候被触发的对象
         * @param {function} clickcallback 
         * @param {function} doubleclickcallback 
         */
        this.listclickeventregister = function (clickcallback, doubleclickcallback) {
            var elem;
            if (this.elems.length) {
                elem = $(this.elems[0]);
            } else {
                elem = this.elems.end()
            }
            elem.parent('div').on('dblclick', 'ul>li', function () {
                // 不一定仅仅收集id数据,没准后面交由列表对象处理的的时候需要更多的数据
                doubleclickcallback($(this));
            });
            elem.parent('div').on('click', 'ul [data-type]', function (event) {
                clickcallback($(this));
            });
        };
        /**
         * 该方法用于解析列表中的每一项,然后填入dom中,在数据来的时候调用
         * 
         * 该方法类似于foreach 但是该函数提供的回调函数只提供一个参数即
         * 
         * 列表栏(也就是单击展开元素 jquery对象),当你在回调函数中返回true的时候该连续触发会终止
         * 
         * 否则继续迭代所有的列表栏元素
         * @param {function} callback 
         */
        this.updatelistitem = function (callback) {
            var len = this.elems.length, i = 0;
            if (len) {
                while (i < len) {
                    if (callback(this.elems.eq(i).find('.suptitle'))) {
                        break;
                    }
                    i++;
                }
            }
        };
        /**
         * 初始化方法reuslt是jquery对象
         */
        this.init = function (elem, callback, strarray) {
            this.elems = elem.children();
            this.elems = callback.call(this, elem, strarray);
        }
        this.init(elem, callback, strarray);
    }
    return new test();
};
/**
 * 由于歌单内容改动频繁所以提供一些对象及方法供其方便操作
 * 
 * 由于歌单的多少具有易变性,但是每个歌单事件是一致的,所以
 * 将dom对象处理函数放置在闭包中,而拥有this的环境,主要用来
 * 和ipc进行互动处理变动的歌单,和变动后的歌单,交由函数处理
 */
listviewinit.prototype.playlistpageRegister = function () {
    var that = this;
    // usercarete对应用户创建列表对象
    // othercreate对应其他用户创建列表对象
    // parseuserlist用于解析我的歌单中的歌单项
    // parseplaylistdata用于解析歌单项对应的内容
    var process = {
        usercreate: undefined,
        othercreate: undefined,
        parseuserlist: function (result, userid) {
            if (result.playlist && result.playlist.length > 0) {
                var playlist = result.playlist, len = playlist.length, i = 0;
                var array = [];
                while (i < len) {
                    var cache = playlist[i];
                    array.push([cache.creator.nickname, cache.creator.userId, cache.name, cache.id, cache.tags, cache.playCount]);
                    i++;
                }
                // 参数意义为:遍历终点 遍历下标 保存歌单由用户创建的数组 保存歌单由其他用户创建的数组
                len = array.length, i = 0
                var createaggregate = [], collectionaggregate = [];
                // 遍历参数将其转化为dom节点
                while (i < len) {
                    var cache = $.parseHTML(`<div class="autolistcontainer hidden">
                    <div class="suptitle cursor-normal" data-listopen="false" data-id="${array[i][3]}">
                    <span class="fa fa-list fa-lg"></span>
                    ${array[i][2]}
                    <span class="fa fa-sort-down fa-lg"></span>
                    </div>
                    <ul class="autolist-column-4 hidden">
                    <li class="cursor-pointer" ><div>标题</div><div>歌手</div><div>专辑</div><div>时长</div></li>
                    </ul>
                    </div>`);
                    if (userid == array[i][1]) {
                        createaggregate.push(cache);
                    } else {
                        collectionaggregate.push(cache);
                    }
                    i++;
                }
                // 修改用户创建的歌单中第一个节点的class为红心样式
                $(createaggregate[0]).find('span.fa-list').removeClass('fa-list').addClass('fa-heart');
                if (collectionaggregate.length) {
                    return [createaggregate, collectionaggregate];
                } else {
                    return [createaggregate];
                }
            }
        },
        parseplaylistdata: function (playlistdata) {
            /**
             * 用于解析api返回的歌单中的数据,整合成
             * html字符串用于添加到网页中
             * @param {object} playlistdata 
             */
            function parseplaylist(playlistdata) {
                if (playlistdata.code == 200 && playlistdata.result) {
                    var arr = playlistdata.result.tracks,
                        i = 0,
                        len = arr.length;
                    var result = "";
                    // 通用艺人名称解析函数
                    function formatartistsname(arr) {
                        if (arr.length == 1) return arr[0].name;
                        var namearr = [];
                        while (arr.length) {
                            namearr.push(arr.shift().name);
                        }
                        return namearr.join(' | ');
                    };
                    // 通用艺术家id解析函数
                    function formatartistsid(arr) {
                        if (arr.length == 1) return arr[0].id;
                        var idarr = [], i = 0, len = arr.length;
                        while (i < len) {
                            idarr.push(arr[i].id);
                            i++;
                        }
                        return idarr.join('|');
                    }
                    // 通用时间解析函数 传入时间单位 毫秒
                    function parsetime(timebymil) {
                        var timebysec = parseInt(timebymil / 1000);

                        function getsec(time) {
                            var m = time % 60;
                            if (m > 9) {
                                return m.toString();
                            } else {
                                return '0' + m.toString();
                            }
                        };

                        function gethou(time) {
                            var h = parseInt(timebysec / 3600);
                            if (h > 9) {
                                return h.toString();
                            } else {
                                return '0' + h.toString();
                            }
                        };

                        function getmin(time) {
                            var m = parseInt(time / 60);
                            if (m > 59) {
                                return "00";
                            } else {
                                if (m > 9) {
                                    return m.toString();
                                } else {
                                    return '0' + m.toString();
                                }
                            }
                        };
                        if (gethou(timebysec) == '00') {
                            return getmin(timebysec) + ':' + getsec(timebysec);
                        } else {
                            return gethou(timebysec) + ':' + getmin(timebysec) + ':' + getsec(timebysec);
                        }
                    };
                    while (i < len) {
                        var cache = arr[i];
                        if (!!cache.hMusic) {
                            result += `<li class="cursor-normal" data-artistsId="${formatartistsid(cache.artists)}" data-albumId="${cache.album.id}" data-musicId="${cache.hMusic.id}" ><div><span data-type="playing-button-name" class="cursor-pointer">${cache.name}</span></div><div ><span data-type="playing-button-artists" class="cursor-pointer">${formatartistsname(cache.artists)}</span></div><div><span data-type="playing-button-album" class="cursor-pointer">${cache.album.name}</span></div><div>${parsetime(cache.duration)}</div></li>`;
                        } else if (!!cache.mMusic) {
                            result += `<li class="cursor-normal" data-artistsId="${formatartistsid(cache.artists)}" data-albumId="${cache.album.id}" data-musicId="${cache.mMusic.id}" ><div><span data-type="playing-button-name" class="cursor-pointer">${cache.name}</span></div><div ><span data-type="playing-button-artists" class="cursor-pointer">${formatartistsname(cache.artists)}</span></div><div><span data-type="playing-button-album" class="cursor-pointer">${cache.album.name}</span></div><div>${parsetime(cache.duration)}</div></li>`;
                        } else if (!!cache.lMusic) {
                            result += `<li class="cursor-normal" data-artistsId="${formatartistsid(cache.artists)}" data-albumId="${cache.album.id}" data-musicId="${cache.lMusic.id}" ><div><span data-type="playing-button-name" class="cursor-pointer">${cache.name}</span></div><div ><span data-type="playing-button-artists" class="cursor-pointer">${formatartistsname(cache.artists)}</span></div><div><span data-type="playing-button-album" class="cursor-pointer">${cache.album.name}</span></div><div>${parsetime(cache.duration)}</div></li>`;
                        }
                        i++;
                    }
                    return result;
                }
            };

            return parseplaylist(playlistdata);
        }
    };
    // 返回用户收藏的歌单
    this.ipc.on('setuserplaylist', (result) => {
        if (typeof reuslt !== 'string') {
            // 如果没有创建那就创建列表对象,如果已经有对象了那么就初始化对象刷新数据
            var arr = process.parseuserlist(result, this.userid);
            /**
             * 用于创建
             * @param {object} elem 父节点对象(jquery)
             * @param {array} strarray 节点需要插入的html字符串(array格式)
             */
            function createlist(elem, strarray) {
                // 删除旧的节点
                this.clearlist();
                strarray.forEach((value) => {
                    elem.append(value);
                });
                // 刚添加完成不显示,取出隐藏类
                this.removehiddenclass(elem);
                return elem.children();
            };
            function openevent(jqueryobj) {
                that.ipc.emit('getplaylistresult', jqueryobj.data('id'));
            };
            function clickevent(jqueryobj) {
                console.log(jqueryobj)
            };
            function dblclickevent(jqueryobj) {
                console.log(jqueryobj)
            };
            if (process.othercreate) {
                // 没有收藏其他用户的歌单的时候就跳过
                if (arr.length != 1) {
                    process.othercreate.init(arr[1]);
                }
                process.usercreate.init(arr[0]);
            } else {
                // 如果有其他用户创建的列表才会创建相对的对象
                if (arr.length != 1) {
                    process.othercreate = this.universallistclass($('#otherusercreatelist'), createlist, arr[1]);
                    process.othercreate.listopeneventregister(openevent);
                    process.othercreate.listclickeventregister(clickevent, dblclickevent);
                }
                // 数据第一次执行,创建列表
                process.usercreate = this.universallistclass($('#mycreatelist'), createlist, arr[0]);
                // 注册列表对象的展开事件
                process.usercreate.listopeneventregister(openevent);
                // 注册列表对象的单击和双击事件
                process.usercreate.listclickeventregister(clickevent, dblclickevent);
            }
        }
    });
    // 根据歌单id返回的数据,用于列表内容的刷新
    this.ipc.on('refreshplaylist', (id, result) => {
        function parsedata(jqueryobj) {
            var cache = jqueryobj.data('id');
            if (jqueryobj.data('id') == id) {
                jqueryobj.next('ul').find('li+li').remove();
                jqueryobj.next('ul').append(process.parseplaylistdata(result));
                return true;
            }
        };
        // 只有在用户列表管理对象存在的情况下才可以列表内容的刷新
        if (typeof reuslt !== 'string' && process.usercreate) {
            process.usercreate.updatelistitem(parsedata);
            if (process.othercreate) {
                process.othercreate.updatelistitem(parsedata);
            }
        }
    });
};
/**
 * 延迟加载首页内容获取
 */
listviewinit.prototype.homepagedelayload = function () {
    setTimeout(() => {
        this.createtabtemplate('homepage');
    }, 1000);
};
/**
 * 统一注册swiper的父级的事件拦截
 * 和其他部分利用id来区分swiper执行不同的操作不一样
 * 
 * 利用不同的目的来区分swiper的事件中的处理函数
 */
listviewinit.prototype.swipercontainerclickRegister = function () {
    var recommendationlist = document.getElementById('recommendationlistswiper');
    recommendationlist.addEventListener('click', (event) => {
        // 由于特殊的html设计,所有的swiper保证了event.path[1]取出的是swiper-slide
        // event.path[1].dataset.id
        // 创建每日推荐页面
    });
};
/**
 * 当接收到修改某一swiper内容的事件的时候
 * 该内部处理器会调用对应的解析函数,将不同
 * swiper的内容修改
 */
listviewinit.prototype.listcardcontentchangedRegister = function () {
    /**
     * swiper处理函数,主要是通过id来进行区分
     * 
     * @param {string} containerid 
     * @param {string} elemid 
     * @param {object} result 
     */
    function process(containerid, elemid, result) {
        // 通用swiper配置
        var generalswiperconfigure = {
            direction: 'horizontal',
            speed: 1000,
            mousewheel: true,
            releaseOnEdges: false,
            preventLinksPropagation: false//防止拖动冒泡到click事件上
        };
        // 通用变量
        var elem = $('#' + elemid + '>.swiper-wrapper'), i = 0;
        // 易变量
        var resultarrays = [], len = 0;
        // 通用艺人名称解析函数
        function formatartistsname(arr) {
            if (arr.length == 1) return arr[0].name;
            var namearr = [];
            while (arr.length) {
                namearr.push(arr.shift().name);
            }
            return namearr.join(' | ');
        };
        switch (elemid) {
            case 'recommendationlistswiper':
                Object.assign(generalswiperconfigure, {
                    autoplay: true,
                    grabCursor: true,
                    slidesPerView: 4,
                    slidesPerColumn: 2,
                    spaceBetween: 10,
                    effect: 'coverflow',
                    coverflowEffect: {
                        rotate: 5,
                        stretch: 0,
                        depth: 40,
                        modifier: 2,
                        slideShadows: false
                    }
                });
                resultarrays = result.result;
                break;
            case 'recommendationmusic':
            case 'newdisc':
                Object.assign(generalswiperconfigure, {
                    slidesPerView: 3,
                    slidesPerColumn: 1,
                    spaceBetween: 10,
                    freeMode: true,
                    freeModeMomentumVelocityRatio: 1.5,//拖动移动距离倍数
                    pagination: {
                        el: '.swiper-pagination',
                        type: 'progressbar',
                    }
                });
                if (elemid == 'recommendationmusic') {
                    resultarrays = result.result;
                } else {
                    resultarrays = result.albums;
                }
                break;
            default:
                return;
                break;
        }
        // 给长度赋值用于循环
        len = resultarrays.length;
        // 通用遍历器
        var template = {
            recommendationlistswiper: function (arr) {
                while (i < len) {
                    cache = arr[i];
                    elem.append(`<div class="swiper-slide recommendationlistslidecontainer" data-id="${cache.id}" data-type="recommendationlist">
                            <span class="fa fa-headphones">${Math.floor(Number(cache.playCount) / 10000) > 0 ? (Math.floor(Number(cache.playCount) / 10000)) + '万' : cache.playCount}</span>
                            <img src="${cache.picUrl}param=177y177">
                            <p>${cache.copywriter}</p>
                            <div class="subtitle">
                                ${cache.name}
                            </div>
                        </div>`);
                    i++;
                }
            },
            recommendationmusic: function (arr) {
                while (i < len) {
                    cache = arr[i];
                    elem.append(`<div class="swiper-slide scrollcardslidecontainer " data-id="${cache.id}" data-type="recommendationmusic">
                                <img src="${cache.song.album.picUrl}param=177y177">
                                <p class="suptitle">${cache.name}</p>
                                <p class="subtitle">${formatartistsname(cache.song.artists)}</p>
                            </div>`);
                    i++;
                }
            },
            newdisc: function (arr) {
                while (i < len) {
                    cache = arr[i];
                    elem.append(`<div class="swiper-slide scrollcardslidecontainer" data-id="${cache.id}" data-type="newdisc">
                                    <img src="${cache.picUrl}param=177y177">
                                    <p class="suptitle">${cache.name}</p>
                                    <p class="subtitle">${formatartistsname(cache.artists)}</p>
                                </div>`);
                    i++;
                }
            }
        }
        // 创建文档前隐藏内容
        elem.addClass('hidden');
        // 创建dom片段
        template[elemid](resultarrays, generalswiperconfigure);
        // 显示dom
        elem.removeClass('hidden');
        // 创建swiper
        new Swiper('#' + elemid, generalswiperconfigure);
    };

    // 用于设置swiper内容的事件,主要是利用id来进行分别处理不同swiper之间数据的差异
    this.ipc.on('setswipercontainer', (pagecontainerid, swipertypeid, result) => {
        process(pagecontainerid, swipertypeid, result);
    });
};
/**
 * 本方法用于各个模板之间切换的控制
 * 控制切换动画,发起卡片的资源请求
 * 
 * 需要传入的参数
 * - id 将指定页面内容更新
 */
listviewinit.prototype.createtabtemplate = (function () {
    /**
     * 利用ipc
     * 用于不同页面之间的多个请求发送
     * 
     *  **参数**
     * - id 一个id值类型为string,实质上是列表不同主页面间的id
     * 
     *  **注意**
     * - 如果传入的id本函数内没有分支将会抛出错误
     */
    function process(id) {
        switch (id) {
            case 'homepage':
                return this.ipc.emit('getapicontent',
                    'getswipercontentbypage',
                    id,
                    [['recommendationlistswiper', 'getrecommendlist'],
                    ['recommendationmusic', 'getnewsong'],
                    ['newdisc', 'getnewdisc']]);
                break;
            case 'findpage':
            case 'playlistpage':
            case 'localpage':
            case 'searchpage':
            case 'aboutmepage':
                break;
            default:
                id = false;
                break;
        }
        if (!id) throw Error('Error functionucreatetabtemplate param value:' + id + 'is not def');
    };
    return function (id) {
        // 第一次的情况
        if (this.cacheforbeforepage == null) {
            // TODO 暂时禁止请求页面资源 针对不同页面进行处理后发送不同的请求
            process.call(this, id);
            // 移出隐藏类然后添加动画类100ms后将动画类删除
            $('#' + id).addClass('fadein').removeClass('hidden').delay(100).removeClass('fadein');
            this.cacheforbeforepage = 'homepage';
        } else {
            // 老旧页面执行动画
            // 执行模糊动画100ms后执行隐藏动画100ms后添加隐藏类然后将动画类抹除
            $('#' + this.cacheforbeforepage).addClass('tabpagedonttouch').delay(100).addClass('fadeoutandhidden').delay(100).addClass('hidden').removeClass('tabpagedonttouch fadeoutandhidden');
            // 发起请求给页面添加内容
            this.ipc.emit('getapicontent','getswipercontentbypage',id);
            // 当前页面显示
            $('#' + id).delay(200).addClass('fadein').removeClass('hidden');
            // 不需要过滤同id点击两次的情况,调用方已经过滤掉了
            this.cacheforbeforepage = id;
        }
    };
})();
/**
 * 用于注册选项卡直接切换的方法
 * 更改选项卡的动画类 触发切换选项卡页面的动画事件
 */
listviewinit.prototype.tabandsearchRegister = (function () {
    var tablist = $('#navbarbuttons');
    var oldelemtext = '首页';
    return function () {
        /*列表切换具体步骤
        * 1.移出兄弟元素的动画类
        * 2.自己添加动画类
        * 3.利用储存的data信息传入模板构造器
        */
        tablist.on('click', 'li', (event) => {
            if (event.target.innerText == oldelemtext)
                return false;
            else
                oldelemtext = event.target.innerText;

            var target = $(event.target);
            // 选项卡的动画
            target.siblings().removeClass('navbarbuttonsclick');
            target.addClass('navbarbuttonsclick');
            //创建模板等待时机成熟测试
            this.createtabtemplate(target[0].dataset.type);
        });
    };
})();
/**
 * TODO test
 * 该方法保存当前播放的列表的所有信息
 * 该方法处理处理audio对象的当前播放列表
 */
listviewinit.prototype.playinglistRegister = function () {
    // 列表格式v4.1
    /**
     * {
     *    listname:'',
     *    listid:'',
     *    localid:'',//保存的是本地唯一识别码用于索引
     *    musicid:'',
     *    musicname:'fade',
     *    result:{
     *          otherinf:{
     *             artists: 'Alan Walker',
     *             artistsid:'',
     *             album: 'Fade',
     *             albumid:'',
     *             songsource: 'listname'
     *          },
     *          cache:true||false,
     *          src:null||string,
     *          folderpath:null||string,// 定义规则该文件夹路径必须是全长
     *          time:时间戳Date,
     *          duration:(来自于api时长),
     *          like:true||flase,
     *          download:true||flase,
     *          collection:true||false
     * }
     * }
     */

    // 历史记录格式和上方一致,对于歌词和专辑图片,不缓存直接利用api获取
    // 实际中inf保存的表中有src属性,信息也要比这个丰富一些
    var inf = [{
        id: 1,
        otherinf: {
            songname: 'Fade',
            singer: 'Alan Walker',
            album: 'Fade',
            songsource: '搜索页'
        }
    }, {
        id: 2,
        otherinf: {
            songname: 'Faith',
            singer: 'Calvin Harris',
            album: 'Motion',
            songsource: '搜索页'
        }
    }, {
        id: 3,
        otherinf: {
            songname: 'Blame',
            singer: 'Calvin Harris',
            album: 'Motion',
            songsource: '搜索页'
        }
    }, 1];
    // 为了模拟查找路径,将src和inf分开了
    var srcandlyrics = [{
        id: 1,
        src: 'src/fade.mp3',
        lyr: {
            "nolyric": true,
            "sgc": false,
            "sfy": true,
            "qfy": true,
            "code": 200
        }
    }, {
        id: 2,
        src: 'src/01. Faith.flac',
        lyr: {
            "sgc": false,
            "sfy": true,
            "qfy": false,
            "transUser": {
                "id": 29593101,
                "status": 0,
                "demand": 1,
                "userid": 44427473,
                "nickname": "KOWTON",
                "uptime": 1429182868408
            },
            "lyricUser": {
                "id": 29593101,
                "status": 0,
                "demand": 0,
                "userid": 44427473,
                "nickname": "KOWTON",
                "uptime": 1445174291924
            },
            "lrc": {
                "version": 108,
                "lyric": "[by:KOWTEN]\n[ti:Faith]\n[ar:Calvin Harris]\n[al:]\n[by:九九Lrc歌词网～www.99Lrc.net]\n[00:07.16]I need a little space in my mind\n[00:10.94]I need that little hope I can find\n[00:14.61]I need a little, I need a little faith\n[00:19.44]Is that too much to ask for?\n[00:22.13]I need to feel my soul come alive\n[00:26.12]I need to feel the strength to get by\n[00:29.73]I need a little, I need a little faith\n[00:34.35]Is that too much to ask for?\n[00:38.39]To ask for, too ask for, to ask for?\n[01:06.94]I need a little space in my mind\n[01:10.74]I need that little hope I can find\n[01:14.37]I need a little, I need a little faith\n[01:19.36]Is that too much to ask for?\n[01:22.15]I need to feel my soul come alive\n[01:25.72]I need to feel the strength to get by\n[01:29.33]I need a little, I need a little faith\n[01:34.09]Is that too much to ask for?\n[01:38.26]To ask for, too ask for, to ask for?\n[02:08.63]I need a little faith\n[02:12.39]I need a little faith\n[02:16.23]I need a little faith\n[02:18.99]Is that too much to ask for?\n[02:24.91]To ask for, too ask for, to ask for?\n[02:26.42]I need a little faith\n[02:28.23]I need a little faith\n[02:31.03]I need a little faith\n[02:33.94]Is that too much to ask for?\n[02:37.87]To ask for, too ask for, to ask for?\n"
            },
            "klyric": {
                "version": 0,
                "lyric": null
            },
            "tlyric": {
                "version": 1,
                "lyric": "[by:KOWTEN]\n[ti:Faith]\n[ar:Calvin Harris]\n[al:]\n[by:九九Lrc歌词网～www.99Lrc.net]\n[00:07.16]我需要一点空间考虑\n[00:10.94]我需要找回一点希望\n[00:14.61]我需要一点，我需要一点信心\n[00:19.44]是否问的太多\n[00:22.13]我需要我的灵魂仍然活着\n[00:26.12]我需要感觉的力量\n[00:29.73]我需要一点，我需要一点信心\n[00:34.35]是否问的太多\n[00:38.39]问得太多，问的太多，太多\n[01:06.94]我需要一点空间考虑\n[01:10.74]我需要找回一点希望\n[01:14.37]我需要一点，我需要一点信心\n[01:19.36]是否问的太多\n[01:22.15]我需要我的灵魂仍然活着\n[01:25.72]我需要感觉的力量\n[01:29.33]我需要感觉的力量\n[01:34.09]是否问的太多\n[01:38.26]问得太多，问的太多，太多\n[02:08.63]我需要一点信心\n[02:12.39]我需要一点信心\n[02:16.23]我需要一点信心\n[02:18.99]是否问的太多\n[02:24.91]是否问的太多\n[02:26.42]我需要一点信心\n[02:28.23]我需要一点信心\n[02:31.03]我需要一点信心\n[02:33.94]是否问的太多\n[02:37.87]是否问的太多"
            },
            "code": 200
        }
    }, {
        id: 3,
        src: 'src/03. Blame (feat. John Newman).flac',
        lyr: {
            "sgc": true,
            "sfy": false,
            "qfy": false,
            "transUser": {
                "id": 29129632,
                "status": 99,
                "demand": 1,
                "userid": 68220522,
                "nickname": "Dr_卢瑟",
                "uptime": 1505285922600
            },
            "lrc": {
                "version": 10,
                "lyric": "[00:08.940]Can't be sleeping\n[00:10.780]Keep on waking\n[00:12.430]Without the woman next to me\n[00:16.410]Guilt is burning\n[00:18.060]Inside I'm hurting\n[00:19.850]This aint a feeling I can keep\n[00:22.240]So blame it on the night\n[00:25.920]Don't blame it on me\n[00:27.920]Don't blame it on me\n[00:30.010]Blame it on the night\n[00:33.450]Don't blame it on me\n[00:35.390]Don't blame it on me\n[00:37.480]Blame it on the night\n[00:40.860]Don't blame it on me\n[00:42.750]Don't blame it on me\n[00:44.600]So blame it on the night\n[00:48.290]Don't blame it on me\n[00:50.130]Don't blame it on me\n[00:52.230]Don't blame it on me\n[01:12.360]Can't you see it\n[01:13.360]I was manipulated\n[01:15.250]I had to let her through the door\n[01:19.740]I had no choice in this\n[01:21.390]I was the friend she missed\n[01:23.730]She needed me to talk\n[01:25.880]So blame it on the night\n[01:29.310]Don't blame it on me\n[01:31.210]Don't blame it on me\n[01:33.310]Blame it on the night\n[01:36.790]Don't blame it on me\n[01:38.740]Don't blame it on me\n[01:40.830]Blame it on the night\n[01:44.320]Don't blame it on me\n[01:46.120]Don't blame it on me\n[01:48.020]So blame it on the night\n[01:51.700]Don't blame it on me\n[01:53.590]Don't blame it on me\n[01:55.530]Don't blame it on me\n[02:19.520]Oh I'm so sorry, so sorry baby\n[02:30.330]I Promise(I'll be better this time)\n[02:39.140]Oh I Promise I will be better this time\n[02:44.990]Don't blame it on me\n[02:50.530]Don't blame it on me\n"
            },
            "klyric": {
                "version": 0,
                "lyric": null
            },
            "tlyric": {
                "version": 3,
                "lyric": "[by:Dr_卢瑟]\n[00:08.940]彻夜不眠\n[00:10.780]一直清醒着\n[00:12.430]只因身边情人悄然离去\n[00:16.410]愧疚在不断地燃烧\n[00:18.060]内心亦不断在滴血\n[00:19.850]我无法忍受这种痛苦的感觉\n[00:22.240]所以请归咎于这夜晚吧\n[00:25.920]不要责备于我\n[00:27.920]不要怪罪于我\n[00:30.010]请归咎于这夜晚吧\n[00:33.450]不要推卸于我\n[00:35.390]不要斥责于我\n[00:37.480]请归咎于这夜晚吧\n[00:40.860]不要叱责于我\n[00:42.750]不要喝斥于我\n[00:44.600]请归咎于这夜晚吧\n[00:48.290]不要非难于我\n[00:50.130]不要呵斥于我\n[00:52.230]不要诘责于我\n[01:12.360]你难道就看不清事实嘛？\n[01:13.360]我已被她人操纵\n[01:15.250]我才不得以让她进入家门\n[01:19.740]我别无选择\n[01:21.390]她一直想念着我\n[01:23.730]她需要与我倾诉\n[01:25.880]所以请归咎于这夜晚吧\n[01:29.310]不要非难于我\n[01:31.210]不要呵斥于我\n[01:33.310]请归咎于这夜晚吧\n[01:36.790]不要叱责于我\n[01:38.740]不要怪罪于我\n[01:40.830]请归咎于这夜晚吧\n[01:44.320]不要推卸于我\n[01:46.120]不要呵斥于我\n[01:48.020]请归咎于这夜晚吧\n[01:51.700]不要诘责于我\n[01:53.590]不要怪罪于我\n[01:55.530]不要归咎于我\n[02:19.520]我真的非常非常抱歉，亲爱的\n[02:30.330]我向你承诺（这一次我会做得更好）\n[02:39.140]我跟你保证这一次我会做得更好\n[02:44.990]不要怪罪于我\n[02:50.530]不要归咎于我\n"
            },
            "code": 200
        }
    }];


    var history = [];
    // 历史记录添加
    this.ipc.on('setplayhistorybypackage', (result) => {
        history.push(result);
        if (history.length > 50) history.shift();
    });
    // 获取src,自动触发歌词,以及图形(目前没有)
    this.ipc.on('getsrcbypackage', () => {
        var len = history.length - 1;
        var id = history[len].id;
        srcandlyrics.forEach((value) => {
            if (value.id == id) {
                this.ipc.emit('setsrcbylist', value.id, value.src);
                console.log(value.id + '  ' + value.src);
                this.ipc.emit('setlyricsbylist', value.id, value.lyr)
            }
        });
    });
    this.ipc.on('checksrcoflastsong', () => {
        // 用于检测最后一首歌曲src的错误
        // 实际上,无论是本地还是在线,
        // 检测的过程都是通过重新获取本地src来完成的
        console.log('checklastsong');
    });
    // 历史记录算法
    // 检测是否有历史播放的flag,格式为数组的下标
    // 如果有把下标上移,移出历史记录中的最后一项
    // 如果没有历史播放flag,将下标改成数组长度-2
    // 再把下标指向的历史记录数组的一项添加到数组最后
    this.ipc.on('getprevinfbypackage', () => {

    })

    // 关键一句,触发audio和列表进行交互 
    this.ipc.emit('newlist', inf);
}

/**
 * 音乐播放界面控制的构造函数
 */
function audiocontrolviewinit(ipc) {
    this.ipc = ipc;

    // 挂载音频播放器 
    this.audioelementRegister();
    // 注册播放控制按钮事件
    this.songcontrolbuttonRegister();
    // 注册播放器滑块事件
    this.songrangeRegister();
    // 注册播放器音频滑块事件
    this.volumerangeRegister();
    // 注册播放器模式切换事件
    this.playmodeswitchRegister();
    // 注册歌曲歌曲信息事件
    this.songinfmorationRegister();
    // 注册歌词部分
    this.lyricsRegister();
    // 注册音乐加载及播放部分
    this.songslistpackageRegister();
};

/**
 * 本函数主要负责将list对象利用ipc发送过来的列表进行包装然后交由audio对象进行播放
 * 
 * **但是出于复杂度考虑该包装对象的过程如下**
 * 1. 抛弃对网易云api返回的json对象进行包装的操作(对于列表对象来说),但是本包装对象还是
 * 需要简化json的过程(暂定)
 * 
 * 2. 列表包装对象中不在留存列表对象的副本(例如历史记录功能,一律利用ipc向列表对象通信保留历史记录)
 * 3. 出于性能考虑获取播放界面基本信息和获取实际的src是分开的,获取src也是由对象利用ipc向列表进行通信获取
 * 
 * 所以该对象完成的操作如下,级那个
 */
audiocontrolviewinit.prototype.songslistpackageRegister = function () {
    // 假设ipc发送过来的歌曲结构如下(类似addsong函数接收的格式)由于是列表对象发送的
    // 很大的情况下歌曲对象src.otherinf已经拥有了,不过这个不是必要的参数
    /*接收的格式如下
             [{
            id:number(必选),
            otherinf:{
                songname:string,
                singer:string,
                album:string,
                songsource:string,
                ...
            }
        },...,nowtargetindex(number列表中播放的起始位置必须拥有没有设置为0)]
     */

    // 歌曲是否需要缓存的功能由audio触发

    var that = this;
    this.ipc.on('newlist', (list) => {
        /**
            * 用于包装对象的构造函数
            * 传入错误的数组格式将会报错
            * @param {array} list
            */
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
                 * 下一首
                 * 即将播放的歌曲的信息
                 */
                function getinf() {
                    var isended = (this.startindex == this.list.length - 1);
                    // 此举是为了在order情况下向对象写入ended属性
                    var result = Object.assign({}, list[this.startindex]);
                    result.ended = false;
                    switch (this.playmode) {
                        case 'order':
                            if (isended) result.ended = true;
                            break;
                        case 'single':
                        case 'listcycle':
                            if (isended) this.startindex = 0;
                            break;
                        case 'random':
                            this.startindex = Math.floor(Math.random() * this.list.length);
                            result = Object.assign({}, list[this.startindex]);
                            // 如果随机模式下最后一个是结尾,那么重置下标为0,防止切换模式出错
                            if (this.startindex == this.list.length - 1) {
                                isended = true;
                                this.startindex = 0;
                            } else {
                                // 如果不是最后一个,将下标加一
                                // 是为了在切换循环播放的时候不再次播放本歌曲
                                this.startindex++;
                            }
                            break;
                    }
                    // 如果当前不是最后一个
                    if (!isended) this.startindex++;
                    this._addplayhistory(result);
                    return result;
                };
                this.getinf = getinf;
                /**
                 * 同步获取上一首歌曲的信息
                 * 实际上调用列表对象内部维护的
                 * 历史记录列表返回的信息,回调一定有值
                 * 历史记录播放完后,自动播放的依然是当前列表中的歌曲
                 */
                function getprevinf(callback) {
                    ipc.emit('getprevinfbypackage');
                    ipc.once('setprevinfbylist', (inf) => {
                        callback(inf);
                    });
                };
                this.getprevinf = getprevinf;
                /**
                 * 异步的返回src,返回格式{id:...,src:...}
                 * 回调函数中需要两个参数
                 * - err 可能的值有 timeout (可靠结果)
                 * - result 结果
                 * 
                 * 追加,一并将专辑封面和歌词发送
                 * 
                 * **有意将信息获取和歌曲地址获取分开是为了提高效率**
                 * 因为用户有可能一直连续更改歌曲,而且为了确保可靠性
                 * 只有歌曲信息和srcid一致的时候才会进行更换新的src
                 * @param {function} callback
                 */
                function getsrc(callback) {
                    ipc.once('setsrcbylist', (id, result) => {
                        console.log('setsrcbylist');
                        switch (result) {
                            case 'timeout':
                                // 超时再次确认
                                checkerror((err, id, result) => {
                                    if (!err) {
                                        callback(null, id, result);
                                    } else {
                                        callback('timeout');
                                    }
                                });
                                break;
                            case 'destroy':
                                callback = null;
                                break;
                            default:
                                callback(null, id, result);
                        }
                    });
                    ipc.emit('getsrcbypackage');
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
                    // 实质上和getsrc作用一样只是再次发起一次请求
                    ipc.once('lastsongerrorresult', (id, result) => {
                        switch (result) {
                            case 'destroy':
                                callback('destroy');
                                break;
                            case 'timeout':
                                callback('timeout');
                                break;
                            default:
                                callback(null, id, result);
                                break;
                        }
                    });
                };
                // 检测最后一首歌错误
                ipc.emit('checksrcoflastsong');
            } else {
                throw Error('Error function package param list must be array and length greater than or equal to two');
            }
        };
        this.audio.setplaylist(new package(list, that.ipc));
    });
};
/**
 * 挂载歌词处理函数
 */
audiocontrolviewinit.prototype.lyricsRegister = (function () {
    var lrcwarp = $('#lrcwarp');
    /**
     * 用于解析歌词,传入的是api的结果
     * 返回的是解析后的格式
     *  - 无歌词返回格式 {result:[10000,'无歌词']}
     *  - 纯音乐返回格式 {result:[10000,'纯音乐']}
     *  - 没有翻译返回格式 {author:...,result:[[毫秒数,歌词],...]}
     *  - 有翻译返回格式 {author:...,tauthor:...,result:[[毫秒数,歌词,翻译],...]}
     * @param {object} lyrobj 
     * @api private
     */
    function getlyr(lyrobj) {
        function formatlyr(value) {
            var srclist = value.split('\n'), newlist = [];
            var srcauthor = null;
            if (srclist[0].indexOf('by:') !== -1) srcauthor = srclist.shift().replace('[by:', '').replace(/\]$/, '');
            if (srclist[srclist.length - 1] == '') srclist.pop();

            var i = 0, len = srclist.length;
            var reg = /^\[\d\d:\d\d\.\d+\]/;
            var timetext = null, contentoflyr = '';
            while (i < len) {
                var index = srclist[i];
                try { timetext = index.match(reg)[0]; } catch (e) { timetext = null };
                if (timetext) {
                    contentoflyr = index.replace(reg, '');
                    newlist.push([timetext, contentoflyr]);
                }
                i++;
            }
            return {
                author: srcauthor,
                result: newlist
            };
        };
        if (lyrobj.nolyric) {
            return {
                result: [[10000, '纯音乐']]
            };
        }
        // 是否有歌词
        if (lyrobj.code == 200 && lyrobj.lrc.lyric) {
            var lyr = formatlyr(lyrobj.lrc.lyric);
            var tlyr;
            var i, len;
            // 如果有翻译处理翻译
            if (lyrobj.tlyric.lyric) tlyr = formatlyr(lyrobj.tlyric.lyric);

            // 合并翻译版和无翻译版本
            if (tlyr && tlyr.result.length != 0) {
                var tlyrcatche = tlyr.result;
                var lyrcache = lyr.result;
                i = 0; len = lyrcache.length;
                // 匹配是建立在翻译歌词少于原歌词之上的
                while (i < len) {
                    if (lyrcache[i][0] == tlyrcatche[0][0])
                        lyrcache[i].push(tlyrcatche.shift()[1])
                    else
                        lyrcache.push('');

                    i++;
                }
                // 将翻译作者加入lyr对象中
                lyr.tauthor = tlyr.author;
                lyr.translate = 'translate';
            }
            // 将字符串时间,转化为毫秒数
            i = 0;
            while (i < len) {
                lyrcache[i][0] = (parseInt(lyrcache[i][0].slice(1, 3)) * 60) + parseInt(lyrcache[i][0].slice(4, 6));
                i++;
            }
            return lyr;
        } else {
            return {
                result: [[10000, '无歌词']]
            };
        }
    };
    /**
     * 用于批量创建dom对象
     * 并返回处理好的格式
     * [毫秒数,元素高度]
     * @param {object} lyrresult 
     */
    function createdom(lyrresult) {
        lrcwarp.html('<ul id="lyricscontainer"></ul>');
        var ul = $('#lyricscontainer');
        var cache = 0;
        if (lyrresult.translate) {
            lyrresult.result.map(function (value) {
                var li = $('<li></li>').appendTo(ul);
                li.append('<p>' + value[1] + '</p>' + '<p>' + value[2] + '</p>');
                // 累计高度值
                cache += parseInt(li.css('height'));
                value[1] = cache;
            });

        } else {
            lyrresult.result.map(function (value, index) {
                var li = $('<li></li>').appendTo(ul);
                li.append('<p>' + value[1] + '</p>');
                // 累计高度值
                cache += parseInt(li.css('height'));
                value[1] = cache;
            });
        }
        if (lyrresult.tauthor && lyrresult.author) {
            // 最后添加作者
            ul.append('<li><p>歌词:' + lyrresult.author + '</p><p>翻译:' + lyrresult.tauthor + '</p></li>');
        } else if (lyrresult.tauthor) {
            // 最后添加作者
            ul.append('<li><p>翻译:' + lyrresult.tauthor + '</p></li>');
        } else if (lyrresult.author) {
            // 最后添加作者
            ul.append('<li><p>歌词:' + lyrresult.author + '</p></li>');
        }
        return lyrresult.result;
    };
    return function () {
        // 歌词数组
        var rolllyrics = null;
        // 用于储存jquery集合,其中存放的是ul下的li元素;lastelem储存li元素用于取消类的时候使用;
        var childrens, lastelem, flag;
        // 用于清除所有的歌词对象
        this.removelyrics = function () {
            lrcwarp.empty();
            lrcwarp.addClass('invisible');
            rolllyrics = childrens = flag = lastelem = null;
        };

        this.ipc.on('setlyricsbylist', (id, purelyrics) => {
            if (id != this.audio._id) return;
            this.removelyrics();
            var formatlyr = getlyr(Object.assign({}, purelyrics));
            // 过滤各种结果
            rolllyrics = createdom(formatlyr);
            // 交给进度并移除隐藏class
            lrcwarp.removeClass('invisible');
            // childrens li元素合集 lastelem 保存li元素,用于动画 
            // 数组长度一半,用于遍历减少时间
            childrens = lrcwarp.find('ul').children();
            lastelem = childrens.eq(0);
            flag = Math.floor(rolllyrics.length / 2);
        });
        this.audio.on('progress', (time) => {
            if (!rolllyrics) return;
            var i, len = rolllyrics.length;
            // 如果中间元素的时间大于当前时间,从0开始遍历，否则从中心开始遍历
            if (rolllyrics[flag][0] > time) {
                i = 0;
                while (i < flag) {
                    if (rolllyrics[i][0] == time) {
                        // 歌词整体移动效果
                        lrcwarp.animate({ scrollTop: rolllyrics[i][1] }, 250);
                        // 上个元素变暗
                        lastelem.removeClass('lyricsrollingcolor');
                        // 当前歌词加亮  替换上个元素
                        lastelem = childrens.eq(i).addClass('lyricsrollingcolor');
                    }
                    i++;
                }
            } else {
                i = flag;
                while (i < len) {
                    if (rolllyrics[i][0] == time) {
                        // 歌词整体移动效果
                        lrcwarp.animate({ scrollTop: rolllyrics[i][1] }, 250);
                        // 上个元素变暗
                        lastelem.removeClass('lyricsrollingcolor');
                        // 当前歌词加亮  替换上个元素
                        lastelem = childrens.eq(i).addClass('lyricsrollingcolor');
                    }
                    i++;
                }
            }
        });
    };
})()
/**
 * 挂载audio对象
 * 
 */
audiocontrolviewinit.prototype.audioelementRegister = function () {
    // 获取audio对象
    var audio = document.getElementById('realpower');
    var that = this;

    /**
     * 用于包装audio对象的构造函数
     * 使用请传入audio对象
     * @param {object} audio 
     * @api private
     */
    function packageforaudio(audio) {
        'use strict';
        // 挂载事件对象
        event.call(this);

        // 保存settimeoutid使用的
        this.clearid = undefined;
        // 用于触发进展事件
        this._progress = function () {
            this.clearid = setTimeout(() => {
                if (this.playstatus() == 'playing') {
                    this.emit('progress', Math.floor(this._audio.currentTime));
                    return this._progress.call(this);
                }
            }, 300);
        };
        // 用于清除进展事件
        this._stopprogress = function () {
            clearTimeout(this.clearid);
        };

        this.playlist = undefined;
        // 用于载入列表
        this.setplaylist = function (list) {
            if (typeof list == 'object') {
                this.playlist = list;
                this.autoplay();
                // 后续的自动播放建立在audio对象的 error事件 canplay事件 和ended事件上
            }
        };
        // 用于自动完成播放等动作
        this.autoplay = function () {
            this.addinf(this.playlist.getinf());
            console.log('autoplay');
            this.playlist.getsrc((error, id, result) => {
                if (!error) {
                    this.addsrc(id, result, true);
                } else {
                    // 报错执行下一首
                    setTimeout(() => {
                        return this.autoplay.call(this, list);
                    }, 400);
                }
            });
        };

        // 播放模式切换事件
        this.setplaymode = function (mode) {
            if (this.playlist) {
                // TODO 停止测试播放切换功能
                // this.playlist.changeplaymode(mode);
            }
        };

        this._audio = audio;
        this.getaudio = function () {
            return this._audio;
        };

        this.isplayed = false;
        this.readyplay = false;
        this.ended = false;
        // 设置播放时间,单位秒
        this.setcurrenttime = function (time) {
            console.log('被设置的秒数' + time);
            if (this.readyplay || this.isplayed) {
                this._audio.currentTime = time;
            }
        };
        // 获取歌曲总时间返回结构[hou,min,sec]
        this.getduration = function () {
            if (this.isplayed || this.readyplay) {
                var duration = Math.floor(this._audio.duration);
                var min = Math.floor(duration / 60);
                var sec = Math.floor(duration - min * 60);
                return min > 60 ? [Math.floor(min / 60), min % 60, sec, duration] : [0, min, sec, duration];
            } else {
                return [];
            }
        };
        // 用于获取播放状态
        this.playstatus = function () {
            if (this.isplayed || this.readyplay) {
                if (this.isplayed) {
                    return 'playing';
                } else {
                    return 'waitplay';
                }
            } else {
                return 'nosong';
            }
        }
        // 播放音乐前提有音乐可放,返回true播放成功,false表示播放失败
        this.play = function () {
            switch (this.playstatus()) {
                case 'playing':
                    this.pause();
                    return true;
                    break;
                case 'waitplay':
                    // 切换播放类
                    that.playbuttontoggleclass('play');
                    this._audio.play();
                    this._progress();
                    this.readyplay = false;
                    this.isplayed = true;
                    return true;
                    break;
                case 'nosong':
                    // 返回false
                    return false;
                    break;
            }
        };
        this.pause = function () {
            switch (this.playstatus()) {
                case 'playing':
                    // 切换暂停类
                    that.playbuttontoggleclass('pause');
                    this._audio.pause();
                    this.readyplay = true;
                    this.isplayed = false;
                    this._stopprogress();
                    return true;
                    break;
                default:
                    return false;
                    break;
            }
        };
        // 音乐播放改成两部分模式
        // 1. 首先获取歌曲信息
        // 2. 获取src
        // 3. play
        this.addinf = function (obj) {
            if (!!obj.id)
                this._id = obj.id;
            else
                throw Error('Error function addsong miss parameter src');

            var id = obj.id;
            var otherinf = obj.otherinf;
            if (otherinf) {
                for (var key in otherinf) {
                    if (otherinf.hasOwnProperty(key)) {
                        var element = otherinf[key];
                        switch (key) {
                            case 'songname':
                                that.changesongname(id, element);
                                break;
                            case 'album':
                                that.changealbum(id, element);
                                break;
                            case 'singer':
                                that.changesinger(id, element);
                                break;
                            case 'songsource':
                                that.changesongsource(id, element);
                                break;
                        }
                    }
                }
            }
            // 将列表中是否最后一首歌曲的标志挂载到对象上
            this.ended = obj.ended;
        };
        // 考虑到性能问题,分开添加歌曲信息和
        // 添加歌曲源功能,添加歌曲源前必须调用
        // 只有在源id和信息id一致的情况下,歌曲
        // 才会播放
        this.addsrc = function (id, src, type) {
            if (id == this._id) {
                if (typeof src == 'string')
                    this._audio.src = src;
                else
                    throw Error('Error function addsong miss parameter src');

                this.readyplay = true;
                if (!!type) {
                    this.isplayed = false;
                    this.play();
                }
            }
        };
        // 本方法用于修改音量,输入的值为0-100之间的任何数值
        this.changevolume = function (value) {
            if (value >= 0 && value <= 100) {
                this._audio.volume = value / 100;
            }
        };

        // 注册audio对象的事件
        // 经过观察audio对象加载的时候会按照如下的顺序触发事件
        // 错误事件 资源初始化事件 歌曲第一帧加载事件 获取到元信息 第一帧加载完毕

        // 由于错误事件不一定触发的是真正的错误,空src属性情况下也会触发错误
        this._audio.addEventListener('error', () => {
            if (this.playstatus() == 'nosong' && this._audio.error.message == 'MEDIA_ELEMENT_ERROR: Empty src attribute') {
                // 不报错
            } else {
                // 错误情况1 播放本地歌曲报错然后再次获取在线链接时切换歌曲
                // 错误情况2 播放本地歌曲报错后

                // 总之在此处执行 checkerror() 进行处理


                // 在线歌曲播放错误,此处不处理

                // 处理错误 例如:播放列表中的下一首歌
                console.log(this._audio.error);
            }
        });
        // 由于结束后适合做一些清空变量引用的作用
        this._audio.addEventListener('ended', () => {
            // 清空flag
            this.isplayed = false;
            this.readyplay = false;
            // 如果没有列表或者列表播放结束
            if (!this.playlist || this.ended) {
                // 无论如何都要清除进度事件
                this._stopprogress();
                // 切换成播放按钮,意思等待下一个列表中的内容(如果有的话),此时点击播放不会有任何效果
                that.playbuttontoggleclass('play');
                // 清空标题
                that.clearsonginfmoration();
                // 清空进度条
                that.clearaudiocontroltime();
            } else {
                this.autoplay();
            }
        });
        //  加载元信息事件后可以更改时间
        this._audio.addEventListener('loadedmetadata', () => {
            // 给滑杆添加时间
            console.log('元信息加载');
            that.setaudiocontroltime(this.getduration());
        });
    };
    this.audio = new packageforaudio(audio);
    audio = null;
};
/**
 * 用于注册歌曲信息事件
 */
audiocontrolviewinit.prototype.songinfmorationRegister = (function () {
    var object = {
        songname: $('#songname>div'),
        album: $('#album>div>a'),
        singer: $('#singer>div>a'),
        songsource: $('#songsource>div>a')
    };
    return function () {
        /**
         * 用于挂载上方对象中的方法
         * 挂载的名字如下change+name
         * 用于改变标题的方法,使用需要传入
         * 歌曲的id,和改变的值
         * @param {Object} obj 
         */
        function addattr(obj) {
            var that = this;
            for (var key in obj) {
                (function (element, key) {
                    if (key != 'songname') {
                        that['change' + key] = function (songid, value) {
                            if (songid == this.audio._id) {
                                element.text(value);
                                element.attr('title', value);
                            }
                        }
                    } else {
                        that['change' + key] = function (songid, value) {
                            if (songid == this.audio._id)
                                element.text(value);
                        }
                    }
                    key = null;
                })(obj[key], key);
            }
        };
        addattr.call(this, object);

        this.clearsonginfmoration = (id) => {
            this.changealbum(id, '');
            this.changesongname(id, '');
            this.changesongsource(id, '');
            this.changesinger(id, '');
        };

        object = null;
    };
})();


/**
 * 用于注册主要播放按钮事件
 */
audiocontrolviewinit.prototype.songcontrolbuttonRegister = (function () {
    var playbutton = $('#playswitch'),
        prevbutton = $('#prevsong'),
        nextbutton = $('#nextsong');
    var isplayed = false;

    function throttle(method, delay) {
        var timer = null;
        return function () {
            clearTimeout(timer);
            timer = setTimeout(function () {
                method(...arguments);
            }, delay);
        };
    };
    // TOOD 改成对象或者注册事件

    return function () {
        var audio = this.audio;
        // 延迟播放,点击后200ms触发,连续触发只触发最后的
        var delayprevbutton = throttle(() => {

        }, 200);
        var delaynextbutton = throttle(() => {
            audio.playlist.getsrc((err, id, result) => {
                if (!err)
                    audio.addsrc(id, result, true);
                else
                    audio.autoplay();
            });
        }, 200);

        this.playbuttontoggleclass = function (type) {
            switch (type) {
                case 'play':
                    playbutton.find('span').removeClass('fa-play').addClass('fa-pause');
                    isplayed = true;
                    break;
                case 'pause':
                    playbutton.find('span').removeClass('fa-pause').addClass('fa-play');
                    isplayed = false;
                    break;
                case false:
                    break;
            };
        };

        throttle = null;

        // 这些按钮的特性都是
        // 点击界面立即显示当前歌曲信息
        // 但是统一延时100ms后才发送请求
        playbutton.on('click', (event) => {
            if (isplayed)
                this.audio.pause();
            else
                this.audio.play();
        });
        prevbutton.on('click', (event) => {

        });
        nextbutton.on('click', (event) => {
            // TODO test
            if (audio.playlist) {
                audio.addinf(audio.playlist.getinf());
                delaynextbutton();
            }
        });
    };
})();


/**
 * 用于注册播放界面模式切换按钮
 */
audiocontrolviewinit.prototype.playmodeswitchRegister = (function () {
    var modeswitchlist = $('#playmodeswitch');
    // 默认是列表循环是首选项,所以先缓存列表循环
    var catcheelem = modeswitchlist.children().first();
    catcheelem.removeClass('hidden');
    // 一个锁
    var flag = true;
    function delayAddClass(jqueryelem, classname, delaytime, remove = false) {
        return new Promise((resolve) => {
            if (remove)
                jqueryelem.removeClass(classname);
            else
                jqueryelem.addClass(classname);

            if (delaytime !== 0) {
                setTimeout(() => {
                    resolve(jqueryelem);
                }, delaytime);
            } else {
                resolve(jqueryelem);
            }
        });
    };
    function getnextelem() {
        var catche = catcheelem.next();
        if (catche.length != 0) {
            catcheelem = catche;
            return catche;
        }
        else {
            catcheelem = modeswitchlist.children().first();
            return catcheelem;
        }
    };
    return function () {
        var that = this;
        modeswitchlist.on('click', 'li', function () {
            // 此处进行动画处理
            if (flag) {
                flag = false;
                var nextelem = getnextelem();
                that.audio.setplaymode(nextelem[0].dataset.playmode)
                // 自身消失
                new delayAddClass($(this), 'fadeout', 100).then((elem) => {
                    // 添加隐藏,删除动画类
                    elem.addClass('hidden').removeClass('fadeout');
                    // 下一个对象删除隐藏,添加动画
                    return new delayAddClass(nextelem.removeClass('hidden'), 'fadein', 100);
                }).then((elem) => {
                    // 删除动画
                    elem.removeClass('fadein');
                    // 解除锁
                    flag = true;
                });
            }
        });
    };
})();
/**
 * 用于注册音乐界面的滑杆事件
 */
audiocontrolviewinit.prototype.songrangeRegister = function () {
    var range = $('#songrange'),
        lefttime = $('#lefttime'),
        righttime = $('#righttime');
    var time = [];
    var timebysec;
    var isinputing;
    /**
     * 用于进度条background样式的设置,以及value的设置
     * 传入数值使用指定的数值设置背景的渐变和value
     * 什么都不传入使用进度条的input.value进行设置
     * @param {number} value 
     * @api private
     */
    function modifybackground(value) {
        if (value != undefined) {
            range[0].value = value;
            range[0].style.background = 'linear-gradient(90deg,rgb(245, 96, 96) ' + value + '%, rgba(0,0,0,.1) ' + value + '%)';
        }
        else {
            range[0].style.background = 'linear-gradient(90deg,rgb(245, 96, 96) ' + range[0].value + '%, rgba(0,0,0,.1) ' + range[0].value + '%)';
        }
    };
    /**
     * 格式化时间函数
     *  - 传入时间(单位秒) 返回数组 [hou,min,sec]格式
     *  - 传入数组[hou,min,sec] 返回 字符串格式 [00:]00:00
     * 
     *  **需要注意的是转化字符串传入的数值必须保证是整数**
     * @api private
     */
    var formattime = (function () {
        var cacheformin, cacheforhou;
        function getmin(value) {
            cacheformin = Math.floor(value / 60);
            if (cacheformin < 60) {
                return cacheformin;
            } else {
                cacheformin = cacheformin % 60;
                return cacheformin;
            }
        };
        function getsec(value) {
            return value - (cacheforhou * 3600 + cacheformin * 60);
        };
        function gethou(value) {
            if (value < 3600) {
                cacheforhou = 0;
                return 0;
            } else {
                cacheforhou = Math.floor(value / 3600)
                return cacheforhou;
            }
        };
        /**
         * 将传入的数值,变成两位长度的字符串
         * 一位长的数前面补0
         *  **传入的数值必须是整形数,audio.getcurrenttime数组返回的都是整数**
         * @param {number} value 
         * @api private
         */
        function timetostring(value) {
            var cache = value.toString();
            switch (value.toString().length) {
                case 0:
                    return '00';
                    break;
                case 1:
                    return '0' + cache;
                    break;
                case 2:
                    return cache;
                    break;
            }
        };
        return function (value) {
            cacheformin = cacheforhou = 0;
            if (typeof value == 'number') {
                return [gethou(value), getmin(value), getsec(value)];
            } else if (value[0] == 0) {
                return timetostring(value[1]) + ':' + timetostring(value[2]);
            } else if (value[0] != 0) {
                return timetostring(value[0]) + ':' + timetostring(value[1]) + ':' + timetostring(value[2]);
            }
        };
    })();

    /**
     * 用于设置右边时间的函数
     * 需要传入audio.getcurrenttime返回的数组
     * @param {array} timearray 
     * @api private
     */
    function setrighttime(timearray) {
        righttime.text(formattime(timearray));
    };
    /**
     * 用于设置左边边时间的函数
     * 需要传入audio.getcurrenttime返回的数组
     * @param {array} timearray 
     * @api private
     */
    function setlefttime(timearray) {
        lefttime.text(formattime(timearray));
    };

    range.on('input', function () {
        var nowtime = Math.floor(this.value / 100 * timebysec);
        var timetoarray = formattime(nowtime);
        var timetostring = formattime(timetoarray);
        lefttime.text(timetostring);
        modifybackground();
    });

    // change事件用来真正的修改音乐时间
    range.on('change', () => {
        // result格式[hou,min,sec]如果length=0就意味着无法获取时间
        switch (time.length) {
            case 0:
                // 此时如果出现了错误,会被audio对象清空时间数组
                modifybackground(0);
                break;
            default:
                this.audio.setcurrenttime(parseInt((range[0].value / 100) * timebysec));
                break;
        }
    });
    // 这个事件是用来解决input事件中
    // audio的progress事件覆盖input样式的问题
    // 按下去后提供一个flag用来判断,是否按下
    // 如果按下progress不会修改样式反之修改样式
    range.on('mousedown', () => {
        isinputing = true;
    });
    // 弹起后清空flag
    range.on('mouseup', () => {
        isinputing = false;
    });

    // 给外部用于设置当前作用域时间flag
    this.setaudiocontroltime = function (result) {
        time = result;
        // 以秒数展现
        timebysec = time[3];
        setrighttime(result);
    };
    // 给外部用于清空当前作用域时间flag
    this.clearaudiocontroltime = function () {
        time = [];
        lefttime.text('00:00');
        righttime.text('00:00');
        modifybackground(0);
    };
    // 歌曲播放进度的事件,需要说明的是
    // 调用的时候本地的时间变量一定获取了
    // 何况progress还是延迟触发的,在终止的时候
    // 在终止和暂停的时候该进度事件都不会触发
    // 歌曲终止后,当前作用域的时间变量会被清空
    // !! 注意指定value并不会触发change 和 input 事件
    this.audio.on('progress', (nowtime) => {
        if (!isinputing) {
            // nowtime就是当前的时间,即调用了audio的getcurrenttime方法
            setlefttime(formattime(nowtime));
            var progress = nowtime / timebysec;
            // 设置进度条
            modifybackground(Math.floor(100 * progress));
        }
    });
};
/**
 * 用于注册音量调节滑杆的事件
 */
audiocontrolviewinit.prototype.volumerangeRegister = (function () {
    var range = $('#volumerange');
    var left = parseInt(range.css('left'));
    var value = range[0].value;

    // 初始化音量,默认音量50%
    $('#realpower')[0].volume = (value * 2) / 100;

    // 试图获取伪元素
    // var test = document.styleSheets[3];
    // test.addRule('.volumeoff::-webkit-slider-runnable-track', 'background-color:#fff');
    return function () {
        var that = this;
        range.on('input', function () {
            // 如果当前的value>缓存的value
            // 说明left因该负修改
            var thisvalue = this.value;
            if (thisvalue > value) {
                left = left + (value - thisvalue);
                range[0].style.left = left + 'px';
                value = thisvalue;
            } else if (thisvalue < value) {
                left = left + (value - thisvalue);
                range[0].style.left = left + 'px';
                value = thisvalue;
            }
            that.audio.changevolume(thisvalue * 2);
        });
        range.on('change', function () {
            switch (true) {
                case this.value == 0:
                    range.removeClass('volumeup').addClass('volumeoff');
                    that.audio.getaudio().muted = true;
                    break;

                default:
                    that.audio.getaudio().muted = false;
                    range.removeClass('volumeoff').addClass('volumeup');
                    break;
            }
        });
    };
})();

/**
 * 视图层的构造函数
 * 需要传入ipc对象创建
 * @param {object} ipc
 */
function viewinit(ipc) {
    // 创建系统界面控制对象
    this.systemview = new systemviewinit(ipc);
    // 挂载播放界面控制对象
    this.audiocontrolview = new audiocontrolviewinit(ipc);
    // 挂载列表界面控制对象
    this.listview = new listviewinit(ipc);
};