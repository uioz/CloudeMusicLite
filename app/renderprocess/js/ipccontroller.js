// 脚本加载策略
// 先加载ipc控制对象
// 视图对象加载完成后
// 加载ipc
// ipc中需要视图对象 
// 视图对象分别挂载
// 1. 系统界面控制
// 2. 音乐播放控制
// 3. 列表界面控制

/**
 * 为当前对象挂载事件对象
 * 为当前对象挂载对应的emit
 * 和on方法
 * @api private
 */
function event() {
    let event = nodeRequire('events');
    this.__proto__ = Object.setPrototypeOf({}, event.prototype);
    // this.emit = this._e.emit;
    // this.on = this._e.on;
    // event = null;
}

/**
 * ipc控制器构造函数
 * 需要传入视图控制器
 * 在网页中视图控制器的代码加载必须
 * 在ipc控制器的前面
 * @param {object} viewcontroller 
 */
function ipccontrollerinit() {

    // 挂载事件对象
    event.call(this);

    // 挂载ipcRenderer对象
    const { ipcRenderer } = nodeRequire('electron');
    this.ipcRenderer = ipcRenderer;

    // 注册事件
    ipccontrollerregister.call(this);

    // 挂载视图对象
    this.viewcontroller = new viewinit(this);
}
/**
 * 统一监听ipc
 * 和注册ipc的事件
 * 调用需要改变上下文
 * @api private
 */
function ipccontrollerregister() {
    var ipcRenderer = this.ipcRenderer;
    var that = this;
    // 每次窗体创建向后端获取必要的信息
    ipcRenderer.send('neednedbresult');
    ipcRenderer.once('nedbresultbymain', (event, result) => {
        console.log(result);
    });
    // 首次加载获取歌曲信息
    // ipcRenderer.send('needStartInfomration');
    // ipcRenderer.once('StartInfomrationbymain',(event,result)=>{
    //     that.emit('StartInfomrationbymain',result);
    // });

    // 转发三个控制按钮的事件
    this.on('buttonsgroupevent', (type) => {
        ipcRenderer.send('buttonsgroupevent',type);
    });
    /**
     * 该事件主要负责api的处理
     * 将不同类别的请求转发
     */
    this.on('getapicontent', (type, flag,result) => {
        ipcRenderer.send(type,flag,result);
    });
    /**
     * 主要列表中swiper内容返回事件
     * 并且过滤错误的结果例如网络错误和回复错误
     * - event ipcrenderer提供的event对象
     * - type1 提供页面辨别
     * - type2 提供id辨别
     * - reuslt 提供结果
     */
    ipcRenderer.on('setswipercontentbymusicapi',(event,type1,type2,result)=>{
        that.emit('setswipercontainer',type1,type2,result);
    });
};

// 构造ipc对象,也是程序的开始
var start = new ipccontrollerinit();