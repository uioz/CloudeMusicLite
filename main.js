
/**
 * Created by Shinelon on 2017/10/6.
 */
const {app,BrowserWindow}=require('electron');
const path=require('path');
const url=require('url');
let win;
function creatWindow() {
    win=new BrowserWindow({width:1200,
        height:675,
        transparent:true,
        frame:false,
        show:false,
        resizable:false,
    });
    //说明:防止绘制延迟，延迟加载窗口，等待绘制完成后一次性显示
    win.once('ready-to-show',()=>{
        win.show();
        let child=new BrowserWindow({
            parent:win,
            modal: true,
            frame:false,
            resizable:false,
            width:360,
            height:180
        });
        child.show();
    });
    
    //加载应用的index.html
    win.loadURL(url.format({
        pathname:path.join(__dirname,'app','renderprocess','index.html'),
        protocol:'file',
        slashes:true,
    }));
    
    //打开开发者工具
    win.webContents.openDevTools();

    //当windows关闭时触发事件
    win.on('closed',()=>{
        //取消引用window对象,如果你的应用支持多窗口的话
        //通常会把多个window对象存放在一个数组里面
        //与此同时，你应该删除相应的元素
        win=null;
    });
}
//Electron 会在初始化后并准备
//创建浏览器窗口时候，调用这个函数
//部分API的ready事件触发后才能使用
app.on('ready',creatWindow);

//当全部窗口关闭时候退出

app.on('window-all-closed',()=>{
    //的macOS上，除非用户用Cmd+q确定的退出
    //否则绝大部分引用机器菜单栏将会保持激活
    if(process.platform!=='darwin'){
        app.quit();
    }
});

app.on('activate',()=>{
    //在这文件，你可以续写应用剩下主进程代码
    //也可以拆分成几个文件，然后使用require导入
    if(win===null){
        creatWindow();
    }

});
console.log(process.type);
//在这文件，你可以续写应用剩下主进程代码
//也可以拆分成几个文件，然后使用require导入
