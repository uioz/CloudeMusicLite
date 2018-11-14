// 本文件用于测试及研究歌词解析部分

// 从接收到歌词再到播放的过程如下
// 列表中的歌曲开始播放getsrc()->audio调用getlrc()载入到lrc模块中(判断id是否一致)
// ->lrc模块解析(1)->载入dom(2)->progress开始检测(3)
/*
1. 解析算法
检测是否接收成功判断对象是否拥有code属性而且值为200,其次判断
是否lrc或者tlyric属性
如果不符合条件返回一个错误,时间长度为[00:00]文字为 无歌词

由于lrc和tlyric格式一致,在此之解析lrc的
第一步利用\n,吧全部歌词切割为一个数组
然后将数组的每一项如此处理
1先判断第一项是否是作者
如果是,将第一项提出去,不是如下处理
将时间和歌词分离开来,储存到原来的下标中例如[[[00:17.33],I might]...]

2. 合并,如果有翻译如下操作
先判断两个数组的长度是否相等
如果相等,将翻译数组中的每一项中的歌词追加到,普通歌词的后面
如果不相等
遍历没有翻译的数组
如下操作
将翻译歌词的第一项也就是时间和没有翻译的时间做比较
如果相同,将该翻译数组中的结果添加到歌词中,然后将此项删除

3. 将合并后的数组,的时间项,转化为毫秒

4. 添加佐料
查看是否有作者信息,如果有将两位(或者一位作者)
添加到歌词的最后



*/



let slide = {
    "sgc": false,
    "sfy": false,
    "qfy": false,
    "transUser": {
        "id": 461544911,
        "status": 99,
        "demand": 1,
        "userid": 54449910,
        "nickname": "聪聪爸",
        "uptime": 1488450345975
    },
    "lyricUser": {
        "id": 461544911,
        "status": 0,
        "demand": 0,
        "userid": 90526230,
        "nickname": "Sherry_Esther",
        "uptime": 1488173450415
    },
    "lrc": {
        "version": 9,
        "lyric": "[by:蠢梨Sherry]\n[00:17.33]I might\n[00:18.86]Empty my bank account\n[00:20.82]And buy that boy with a pipe\n[00:23.20]Buy that boy with a pipe\n[00:25.42]I might, I might\n[00:27.96]Empty my bank account\n[00:30.09]And buy that boy with a pipe\n[00:32.37]Buy that boy with a pipe\n[00:34.56]I might\n[00:35.84]\n[00:55.13]Do you slide on all your nights like this?\n[00:59.66]Do you try on all your nights like this? (I might)\n[01:04.15]Put some spotlight on the slide\n[01:08.67]Whatever comes, comes through clear\n[01:13.48]Do you slide on all your nights like this?\n[01:18.09]Do you try on all your nights like this? (I might)\n[01:22.72]Put some spotlight on the side\n[01:27.10]And whatever comes, comes through clear\n[01:31.84]All this jewelry ain't no use when it's this dark\n[01:36.41]It's my favorite part, we see the lights, they got so far\n[01:40.45]It went too fast, we couldn't reach it with our arms\n[01:45.06]Wrist on a wrist, a link of charms, yeah\n[01:48.26]Laying, we're still a link apart\n[01:50.87]It's like we could die here all young\n[01:53.09]Like we could dye hair all blonde\n[01:55.31]If we could see in twenty twin\n[01:57.71]Twice we could see it 'til the end\n[02:00.05]Put that spotlight on her face (spotlight)\n[02:04.30]Put that spotlight on her face (ah, yeah)\n[02:08.86]We gon' pipe up and turn up (pipe up)\n[02:11.28]We gon' light up and burn up (burn up)\n[02:13.50]Mama too hot like a (like what?)\n[02:15.73]Mama too hot like a furnace (furnace)\n[02:17.94]I got a hundred G's in my Goyard (G's)\n[02:20.30]My diamonds gon' shine when the lights dark (shine)\n[02:22.51]You and I take a ride down the boulevard (yeah)\n[02:24.89]And your friends really wanna break us apart\n[02:26.92]Good lord\n[02:27.77](Offset!) Good gracious\n[02:30.42]Starin' at my diamonds while I'm hoppin' out a spaceship\n[02:32.54]Need your information, take vacation to Malaysia\n[02:34.76]You my baby, the paparazzi flashin' crazy\n[02:37.13]She swallowed the bottle\n[02:38.17]While I sit back and smoke gelato\n[02:39.40]Walk in my mansion, twenty thousand painting, Picasso\n[02:41.68]Bitches be dippin', dabbin' with niggas like a nacho\n[02:43.94]Took off her panties, diamonds dancin' like Rick Riccardo\n[02:46.26]She havin' it\n[02:47.06]When they call her workin' on The Bachelor\n[02:48.74]I know you got a past, I got a past, that's in the back of us\n[02:51.01]Average, I'ma make a million on the average\n[02:53.27]I'm ridin' with no brain, bitch, I'm out of it\n[02:55.56]Do you slide on all your nights like this?\n[02:59.60]Do you try on all your nights like this? (I might)\n[03:04.22]Put some spotlight on the slide\n[03:08.81]Whatever comes, comes through clear\n[03:13.03]Do you slide on all your nights like this?\n[03:18.02]Do you try on all your nights like this?\n[03:22.65]Put some spotlight on the side\n[03:27.17]And whatever comes, comes through clear (I might)\n[03:32.47]I might empty my bank account (ooh)\n[03:34.69]And buy that boy with a pipe (ooh, yeah)\n[03:36.86]Buy that boy with a pipe\n[03:39.19]I might, I might (slide)\n[03:41.75]Empty my bank account (ooh, slide)\n[03:43.96]And buy that boy with a pipe (slide, yeah)\n[03:46.26](Do you slide on all your nights like this?)\n[03:47.42]Buy that boy with a pipe\n[03:48.44]I might\n[03:50.16]\n"
    },
    "klyric": {
        "version": 0
    },
    "tlyric": {
        "version": 1,
        "lyric": "[by:聪聪爸]\n[00:17.33]也许\n[00:18.86]我会花光所有积蓄\n[00:20.82]买下毕加索油画“boy with a pipe”（此画10年苏富比拍卖价格1.04亿刀）\n[00:23.20]买下毕加索油画\"boy with a pipe\"\n[00:25.42]我应该会这么做\n[00:27.96]将银行存款花的一干二净\n[00:30.09]来买下毕加索油画\"boy with a pipe\"\n[00:32.37]买下毕加索油画\"boy with a pipe\"\n[00:34.56]应该吧\n[00:55.13]每个夜晚你都在不同男人身上气喘吁吁吗？\n[00:59.66]每个夜晚你都尝试这无脑的糜烂吗？（嗯）\n[01:04.15]强光照射下\n[01:08.67]任何偷鸡摸狗都逃不过我的法眼\n[01:13.48]每个夜晚你都在不同男人身上气喘吁吁吗？\n[01:18.09]每个夜晚你都尝试这无脑的糜烂吗？（确实）\n[01:22.72]强光照射下\n[01:27.10]任何偷鸡摸狗都逃不过我的法眼\n[01:31.84]失去光的照射，黯淡的钻石和别的金属一样\n[01:36.41]这是我最喜欢的地方，着迷彩色流光，但她极易消逝\n[01:40.45]她消逝得太快，我们来不及伸手环绕\n[01:45.06]你我双手紧握，情侣手链叮叮作响，耶\n[01:48.26]躺在一起，仿佛心还紧紧相依\n[01:50.87]其实青年的我们早已死去\n[01:53.09]但把握当下的自由，将头发染得金黄（Blonde是法海上张专辑，体现他之前未感受到的自由意志）\n[01:55.31]如果我们目光犀利深远\n[01:57.71]在这段关系结束前就了然结局\n[02:00.05]将聚光灯打在她脸颊（聚光灯）\n[02:04.30]将聚光灯洒在她脸上（噢，耶）\n[02:08.86]立体的光折射我们的疯狂（全体起立）\n[02:11.28]情绪达到沸点（将我们点燃）\n[02:13.50]小妞，她的身材一级棒...（像谁）\n[02:15.73]小妞，她火热如熔炉...（熔炉）\n[02:17.94]现在的我富得流油，高雅德屯了成百上千（数不清）\n[02:20.30]我的钻石在夜里也灿烂夺目（耶）\n[02:22.51]我开车载你扫街（耶）\n[02:24.89]你的朋友却想拆散我们处心积虑\n[02:26.92]和蔼的上帝\n[02:27.77]（offset在此！）敬仰的圣母\n[02:30.42]她觊觎我的钻石在我忙于事业无法顾及时\n[02:32.54]等待你的消息，想带你去马来群岛度假\n[02:34.76]一起出街，狗仔的闪光灯亮个不停\n[02:37.13]她在车里舔着“瓶口”\n[02:38.17]而我享受进口冰淇淋gelato的冰爽（意大利冰淇淋gelato）\n[02:39.40]走近我收藏上万毕加索作品的别墅\n[02:41.68]小妞表示要跟我走，看上我的财富主动示好\n[02:43.94]脱掉她内裤，钻石飞舞如Rick Ricardo的脚步（此人是电视节目的舞蹈演员）\n[02:46.26]被她得手\n[02:47.06]他们让她上《The Bachelor》真人秀（升级版非诚勿扰）\n[02:48.74]我就知道你有不为人知的过去，我也有，但这都无所谓\n[02:51.01]平均一下，我也是个百万玩家\n[02:53.27]小爷甩掉你头也不回，小妞我玩够了\n[02:55.56]每个夜晚你都在不同男人身上气喘吁吁吗？\n[02:59.60]每个夜晚你都尝试这无脑的糜烂吗？（嗯）\n[03:04.22]强光照射下（噢，耶）\n[03:08.81]所有将偷鸡摸狗都逃不过我的法眼\n[03:13.03]每个夜晚你都在不同男人身上气喘吁吁吗？\n[03:18.02]每个夜晚你都尝试这无脑的糜烂吗？（会的）\n[03:22.65]强光照射下\n[03:27.17]任何偷鸡摸狗都逃不过我的法眼（是的）\n[03:32.47]我应该会花光所有积蓄（噢）\n[03:34.69]买下毕加索油画“boy with a pipe”（噢，耶）\n[03:36.86]买下毕加索油画“boy with a pipe”\n[03:39.19]我应该会这么做\n[03:41.75]把银行存款花的一干二净（噢）\n[03:43.96]来买下毕加索油画“boy with a pipe”\n[03:46.26]（每个夜晚你都在不同男人身上气喘吁吁吗？）\n[03:47.42]买下毕加索油画“boy with a pipe”\n[03:48.44]也许吧\n"
    },
    "code": 200
};
let rollin = {
    "sgc": false,
    "sfy": false,
    "qfy": false,
    "transUser": {
        "id": 478029097,
        "status": 99,
        "demand": 1,
        "userid": 46016101,
        "nickname": "OctobersVeryOwn",
        "uptime": 1494908026134
    },
    "lyricUser": {
        "id": 478029097,
        "status": 0,
        "demand": 0,
        "userid": 105176028,
        "nickname": "hondoes",
        "uptime": 1494568776014
    },
    "lrc": {
        "version": 3,
        "lyric": "[by:hondoes]\n[00:41.06]I've been rollin' on the freeway\n[00:43.63]I've been riding 85\n[00:46.20]I've been thinking way too much\n[00:48.83]And I'm way too gone to drive\n[00:51.39]I got anger in my chest\n[00:54.03]I got millions on my mind\n[00:56.63]And you didn't fit the picture\n[00:59.21]So I guess you weren't the vibe\n[01:01.78]I've been rollin' on the freeway\n[01:04.45]I've been riding 85\n[01:06.95]I've been thinking way too much\n[01:09.66]And I'm way too gone to drive\n[01:12.21]I got anger in my chest\n[01:14.82]I got millions on my mind\n[01:17.41]And you didn't fit the picture\n[01:20.12]So I guess you weren't the vibe\n[01:22.62]\n[01:23.37]L-O-V-E on my right leg, that's Gucci (know what I'm sayin'?)\n[01:25.97]L-O-V-E on my main ho, that's pucci (get what I'm sayin'?)\n[01:28.62]Caught a lil' jetlag but I'm golden, damn\n[01:31.17]We deserve Grammys and some Oscars, damn\n[01:33.88]They deserve wammys, they imposters\n[01:36.15]I be rollin' with my project homies, it's a vibe\n[01:39.06]I just did some pills with the homie, it's a vibe\n[01:41.46]Bend her over, switch sides, it's a vibe\n[01:43.37]\n[01:44.33]I come through with strippers and some shottas\n[01:46.91]I gotta accept that I'm a monster\n[01:49.47]I pull up in several different options\n[01:51.89]Not all, but most of 'em came topless\n[01:54.23]I'll shatter your dreams with this cream I make\n[01:56.81]Gotta be on codeine to think of shit I say\n[01:59.91]I can't feel my toes and ain't gon' fold up\n[02:02.56]I was in the parkin' lot when I rolled up\n[02:04.52]\n[02:04.53]I've been rollin' on the freeway\n[02:07.12]I've been riding 85\n[02:09.64]I've been thinking way too much\n[02:12.31]And I'm way too gone to drive\n[02:14.85]I got anger in my chest\n[02:17.41]I got millions on my mind\n[02:20.11]And you didn't fit the picture\n[02:22.66]So I guess you weren't the vibe\n[02:25.19]I've been rollin' on the freeway\n[02:27.90]I've been riding 85\n[02:30.53]I've been thinking way too much\n[02:33.16]And I'm way too gone to drive\n[02:35.69]I got anger in my chest\n[02:38.30]I got millions on my mind\n[02:40.90]And you didn't fit the picture\n[02:43.50]So I guess you weren't the vibe\n[02:46.07]\n[02:46.16]Pluto\n[02:47.05]Gotta dig what I'm sayin', Chanel draped on me, baby\n[02:49.56]Gotta dig what I'm sayin', she look like she's sponsored by Mercedes\n[02:52.33]Dig what I'm sayin', this cree cologne is on me, baby (you dig?)\n[02:55.08]Dig what I'm sayin'? I'm goin' hard (hard, yeah)\n[02:57.67]I pop up bubbly in your memory\n[03:00.18]You should be glad I'm showin' you sympathy (show you sympathy)\n[03:02.77]I gave you, took you up out the gutter (out the gutter)\n[03:05.33]Ever let you go, you gon' suffer (you gon' suffer from it)\n[03:07.80]\n[03:07.81]I come through with strippers and some shottas\n[03:10.38]I gotta accept that I'm a monster\n[03:12.96]I pull up in several different options\n[03:15.47]Not all, but most of 'em came topless\n[03:17.85]I'll shatter your dreams with this cream I make\n[03:20.31]Gotta be on codeine to think of shit I say\n[03:23.44]I can't feel my toes and ain't gon' fold up\n[03:26.02]I was in the parkin' lot when I rolled up\n[03:27.93]\n[03:32.35]Yeah, L.O.V.E. on my right leg\n[03:44.66]Nah Hendrix overload, dig what I'm sayin'?\n[03:49.08]I feel like I should be giving up\n[03:54.66]You can't leave this, it's too much\n[03:59.44]But I'm tired of you leading me on, oh no\n[04:04.76]I don't like where this shit is going\n[04:09.96]You heart is stuck in all your apologies\n[04:15.55]Gave you all but you went off on me\n[04:20.72]Keep your love, it doesn't feel the same\n[04:25.73]I hope it hurts you when you're hearin' my name\n"
    },
    "klyric": {
        "version": 0
    },
    "tlyric": {
        "version": 3,
        "lyric": "[by:OctobersVeryOwn]\n[00:41.06]在高速路上肆意狂飙\n[00:43.63]亚特兰大洲际公路便是我的赛道\n[00:46.20]各种思绪充斥大脑\n[00:48.83]飘飘欲仙的我连方向盘都握不牢\n[00:51.39]我也不愿怒火中烧\n[00:54.03]只想思考如何赚更多钞票\n[00:56.63]你的出现毁了这一刻的美妙\n[00:59.21]你太违和 别来搅我的兴可好？\n[01:01.78]在高速路上肆意狂飙\n[01:04.45]亚特兰大洲际公路便是我的赛道\n[01:06.95]各种思绪充斥大脑\n[01:09.66]飘飘欲仙的我连方向盘都握不牢\n[01:12.21]我也不愿怒火中烧\n[01:14.82]实在有太多问题需要思考\n[01:17.41]你的出现毁了这一刻的美妙\n[01:20.12]你太违和 别来搅我的兴可好？\n[01:23.37]右腿裤管上的“LOVED”刺绣 可懂这裤子来自古驰？\n[01:25.97]爱我的正牌女友 买买emilio pucci那都不是事\n[01:28.62]有点倒不过时差 但这对我来说算是小意思\n[01:31.17]奥斯卡和格莱美奖 简直就是我的“量身定制”\n[01:33.88]他们活该碌碌无为 因为本来就是群江湖骗子\n[01:36.15]和兄弟驾车狂飙(共事) 驶上人生快车道\n[01:39.06]和朋友一起嗑药 这感觉挺好\n[01:41.46]让她趴下解锁各种姿势 玩的就是骚\n[01:44.33]我也是从底层混起来的【stripper指脱衣舞女 shotta在牙买加英语中指帮派成员】\n[01:46.91]我承认我就是那么牛逼\n[01:49.47]每天我都开着不同座驾\n[01:51.89]虽不是全部 但大部分都是拉风的敞篷车\n[01:54.23]不要有一夜暴富的白日梦 我从白手起家到收获名利【cream=Cash Rules Everything Around Me】\n[01:56.81]紫水喝多了让我语无伦次\n[01:59.91]甚至连脚趾都麻木了 但我不会就此停下\n[02:02.56]停车场就是我吞云吐雾的地方\n[02:04.53]在高速路上肆意狂飙\n[02:07.12]亚特兰大洲际公路便是我的赛道\n[02:09.64]各种思绪充斥大脑\n[02:12.31]飘飘欲仙的我连方向盘都握不牢\n[02:14.85]我也不愿怒火中烧\n[02:17.41]实在有太多问题需要思考\n[02:20.11]你的出现毁了这一刻的美妙\n[02:22.66]你太违和 别来搅我的兴可好？\n[02:25.19]在高速路上肆意狂飙\n[02:27.90]亚特兰大洲际公路便是我的赛道\n[02:30.53]各种思绪充斥大脑\n[02:33.16]飘飘欲仙的我连方向盘都握不牢\n[02:35.69]我也不愿怒火中烧\n[02:38.30]实在有太多问题需要思考\n[02:40.90]你的出现毁了这一刻的美妙\n[02:43.50]你太违和 别来搅我的兴可好？\n[02:46.16]【Pluto是Future的小名】\n[02:47.05]懂我说的吗 我周身闪耀如香奈儿珠宝\n[02:49.56]她端庄优雅 好像奔驰是她的独家赞助\n[02:52.33]我逼格满满 只用Creed牌的古龙香水\n[02:55.08]你最好明白 我用的手段都是强硬无情\n[02:57.67]我留给你的都是如香槟开瓶般的美好记忆\n[03:00.18]你该庆幸 我对你从来都是包容无比\n[03:02.77]带你离开了破败不堪的贫民区\n[03:05.33]要是哪一天我离开了你 你必会痛苦不堪\n[03:07.81]我也是从底层混起来的\n[03:10.38]我承认我就是那么牛逼\n[03:12.96]每天我都开着不同座驾\n[03:15.47]虽不是全部 但大部分都是拉风的敞篷车\n[03:17.85]不要有一夜暴富的白日梦 我从白手起家到收获名利【cream=Cash Rules Everything Around Me】\n[03:20.31]得喝点紫水才能说几句像样的歌词\n[03:23.44]甚至连脚趾都麻木了 但我不会就此停下\n[03:26.02]停车场就是我吞云吐雾的地方\n[03:32.35]耶 右腿上的L.O.V.E纹身\n[03:44.66]破事再多我也能搞定 懂我说的吗\n[03:49.08]我觉得是时候放弃\n[03:54.66]你也脱不了干系 这对于你同样沉重无比\n[03:59.44]但我讨厌曾经对你的言听计从\n[04:04.76]我已经厌倦这段该死的感情\n[04:09.96]无尽悔意让你的心备受煎熬\n[04:15.55]曾经为你付出所有 但还是各自远走\n[04:20.72]收起你的爱吧 我对你的感觉已不复存在\n[04:25.73]希望今后你听到我的名字 仍会痛心无比"
    },
    "code": 200
};
// var sweetnothing = { "sgc": true, "sfy": true, "qfy": false, "transUser": { "id": 25655028, "status": 0, "demand": 1, "userid": 66458764, "nickname": "Echoes__h", "uptime": 1433115834920 }, "lrc": { "version": 4, "lyric": "[00:04.04]You took my heart and you held it in your mouth\n[00:10.23]And with a word all my love came rushing out\n[00:16.36]\n[00:17.86]And every whisper; it's the worst, emptied out by a single word\n[00:25.80]\n[00:26.67]There is a hollow in me now\n[00:29.26]\n[00:33.32]So I'll put faith in something I know\n[00:36.63]\n[00:37.44]I'm living on such sweet nothing\n[00:40.88]But I'm tired of hope with nothing to hold\n[00:44.13]\n[00:44.70]I'm living on such sweet nothing\n[00:47.44]\n[00:48.13]And it's hard to learn\n[00:50.13]And it's hard to love\n[00:51.95]When you're giving me such sweet nothing\n[00:54.76]\n[00:55.57]Sweet nothing, sweet nothing\n[00:58.63]\n[00:59.57]You're giving me such sweet nothing\n[01:02.52]\n[01:19.04]It isn't easy for me to let it go\n[01:23.48]\n[01:25.17]Cause, I've swallowed every single word\n[01:30.85]\n[01:32.86]And, every whisper, every sigh\n[01:36.55]\n[01:37.80]Eats away at this heart of mine\n[01:40.48]\n[01:41.36]And there is a hollow in me now\n[01:44.30]\n[01:48.30]So I'll put faith in something I know\n[01:51.35]\n[01:52.42]I'm living on such sweet nothing\n[01:54.86]\n[01:55.67]But I'm tired of hope with nothing to hold\n[01:58.98]\n[01:59.61]I'm living on such sweet nothing\n[02:02.23]\n[02:03.17]And it's hard to learn\n[02:05.11]And it's hard to love\n[02:06.48]\n[02:07.17]When you're giving me such sweet nothing\n[02:09.73]\n[02:10.42]Sweet nothing, sweet nothing\n[02:13.54]\n[02:14.61]You're giving me such sweet nothing\n[02:17.76]\n[02:33.61]And it's not enough\n[02:34.61]\n[02:36.30]To tell me that you care\n[02:38.49]\n[02:39.99]When we both know the words are empty air\n[02:46.12]\n[02:47.24]You give me nothing\n[02:48.43]\n[02:51.80]Uoooh\n[02:52.43]Uoooh\n[02:53.49]Uoooh\n[02:54.68]Nothing\n[02:55.32]\n[03:12.38]Uoooh\n[03:13.82]Uoooh\n[03:15.76]Uoooh\n[03:16.88]Sweet nothing\n[03:17.88]\n[03:19.51]Uoooh\n[03:20.82]Uoooh\n[03:22.32]Uoooh\n[03:23.44]\n[03:24.07]Sweet nothing\n" }, "klyric": { "version": 4, "lyric": "[ti:Sweet Nothing]\n[ar:calvin harris]\n[by:1433836@网易云音乐_2]\n[#:http://music.163.com/#/song?id=25655028]\n[3710,6334](0,254)You(0,1) (0,151)took(0,1) (0,506)my(0,1) (0,1318)heart(0,1) (0,252)and(0,1) (0,254)you(0,1) (0,507)had(0,1) (0,455)it(0,1) (0,279)in(0,1) (0,303)your(0,1) (0,2045)mouth\n[10044,7683](0,1320)And,(0,203)with(0,1) (0,253)the(0,1) (0,1841)word(0,1) (0,152)all(0,1) (0,253)my(0,1) (0,354)love(0,1) (0,557)came(0,1) (0,253)rushing(0,1) (0,2489)out\n[17727,8695](0,1176)And,(0,305)every(0,1) (0,1470)whisper,(0,154)it(0,203)’(0,151)s(0,1) (0,152)the(0,1) (0,1218)worst,(0,355)empty(0,1) (0,355)though(0,1) (0,202)by(0,1) (0,151)a(0,1) (0,254)single(0,1) (0,2541)word\n[26422,6964](0,203)There(0,1) (0,303)is(0,1) (0,406)a(0,1) (0,202)hollow(0,1) (0,1025)in(0,1) (0,4820)me\n[33386,3707](0,204)So(0,1) (0,151)I(0,1) (0,202)put(0,1) (0,355)my(0,1) (0,760)faith(0,1) (0,202)in(0,1) (0,456)something(0,1) (0,354)I(0,1) (0,1015)know\n[37093,3647](0,204)I(0,254)’(0,157)m(0,1) (0,203)living(0,1) (0,692)on(0,1) (0,458)such(0,1) (0,202)sweet(0,1) (0,1472)nothing\n[40740,3711](0,203)But(0,1) (0,202)I(0,202)’(0,153)m(0,1) (0,203)trying(0,1) (0,253)to(0,1) (0,612)hope(0,1) (0,201)with(0,1) (0,202)nothing(0,1) (0,456)to(0,1) (0,1016)hope\n[44451,3563](0,203)I(0,202)’(0,203)m(0,1) (0,203)living(0,1) (0,203)on(0,1) (0,202)such(0,1) (0,1224)sweet(0,1) (0,1118)nothing\n[48014,1370](0,254)And(0,1) (0,203)it(0,151)’(0,153)s(0,1) (0,201)hard(0,1) (0,200)to(0,1) (0,204)learn\n[49382,2457](0,729)And(0,1) (0,203)it(0,303)’(0,205)s(0,1) (0,203)hard(0,1) (0,150)to(0,1) (0,660)love\n[51839,3870](0,204)When(0,1) (0,201)you(0,409)’(0,202)re(0,1) (0,304)giving(0,1) (0,203)me(0,1) (0,253)such(0,1) (0,355)sweet(0,1) (0,1733)nothing\n[56248,3354](0,458)Sweet(0,1) (0,1015)nothing,(0,457)sweet(0,1) (0,1422)nothing\n[59602,18605](0,203)You(0,205)’(0,254)re(0,1) (0,203)giving(0,1) (0,304)me(0,1) (0,457)such(0,1) (0,659)sweet(0,1) (0,16315)nothing\n[78207,6935](0,761)It(0,1) (0,152)isn(0,202)’(0,153)t(0,1) (0,713)easy(0,1) (0,1016)for(0,1) (0,657)me(0,1) (0,614)to(0,1) (0,253)let(0,1) (0,253)it(0,1) (0,2153)go\n[85142,7289](0,1121)Cause(0,1) (0,407)I've(0,1) (0,1927)swallowed(0,1) (0,96)every(0,1) (0,1808)single(0,1) (0,1925)word\n[92431,5201](0,1381)And(0,1) (0,354)Every(0,1) (0,1522)whisper,(0,214)every(0,1) (0,1727)sigh\n[97632,3667](0,303)Eats(0,1) (0,203)away(0,1) (0,710)at(0,1) (0,413)this(0,1) (0,303)heart(0,1) (0,304)of(0,1) (0,1425)mine\n[101299,7478](0,203)And(0,1) (0,202)there(0,1) (0,202)is(0,1) (0,405)a(0,1) (0,1025)hollow(0,1) (0,252)in(0,1) (0,5183)me\n[108777,3299](0,154)So(0,1) (0,150)I(0,1) (0,150)put(0,1) (0,253)my(0,1) (0,556)faith(0,1) (0,304)in(0,1) (0,152)something(0,1) (0,455)I(0,1) (0,1117)know\n[112076,3573](0,152)I(0,202)’(0,213)m(0,1) (0,203)living(0,1) (0,254)on(0,1) (0,513)such(0,1) (0,864)sweet(0,1) (0,1167)nothing\n[115649,3707](0,203)But(0,1) (0,202)I(0,153)’(0,203)m(0,1) (0,151)trying(0,1) (0,152)to(0,1) (0,812)hope(0,1) (0,252)with(0,1) (0,456)nothing(0,1) (0,355)to(0,1) (0,760)hope\n[119356,3615](0,407)I(0,305)’(0,202)m(0,1) (0,203)living(0,1) (0,202)on(0,1) (0,355)such(0,1) (0,913)sweet(0,1) (0,1023)nothing\n[122971,1937](0,211)And(0,1) (0,152)it(0,202)’(0,153)s(0,1) (0,201)hard(0,1) (0,202)to(0,1) (0,812)learn\n[124908,1979](0,152)And(0,1) (0,202)it(0,152)’(0,153)s(0,1) (0,201)hard(0,1) (0,304)to(0,1) (0,811)love\n[126887,4011](0,203)When(0,1) (0,302)you(0,305)’(0,203)re(0,1) (0,200)giving(0,1) (0,153)me(0,1) (0,303)such(0,1) (0,710)sweet(0,1) (0,1626)nothing\n[131445,3200](0,1319)Sweet(0,1) (0,963)nothing,(0,203)sweet(0,1) (0,713)nothing\n[134645,18786](0,303)You(0,203)’(0,203)re(0,1) (0,151)giving(0,1) (0,203)me(0,1) (0,353)such(0,1) (0,913)sweet(0,1) (0,16452)nothing\n[153431,6172](0,202)And(0,1) (0,152)it(0,204)’(0,357)s(0,1) (0,203)not(0,1) (0,1680)enough(0,1) (0,254)To(0,1) (0,208)tell(0,1) (0,762)me(0,1) (0,304)that(0,1) (0,306)you(0,1) (0,1531)care\n[159603,7575](0,1524)When,(0,304)we(0,1) (0,455)both(0,1) (0,1320)know(0,1) (0,763)the(0,1) (0,914)words(0,1) (0,201)are(0,1) (0,303)empty(0,1) (0,1784)air\n[167178,214047](0,161)You(0,1) (0,203)give(0,1) (0,354)me(0,1) (0,3972)nothing\n" }, "tlyric": { "version": 1, "lyric": "[by:Miracle_h]\n[00:04.04]你夺走我的心 你把它叼在嘴里\n[00:10.23]只是一句话 我的爱情便支离破碎\n[00:17.86]你的每句低语 都是谎言 一句话 便将一切都抹去\n[00:26.67]如今我的心中有个空洞\n[00:33.32]所以我把信念寄托在这未知中\n[00:37.44]我生活在一座空中楼阁中\n[00:40.88]但我已厌倦这毫无根据的希望\n[00:44.70]我生活在一座空中楼阁中\n[00:48.13]很难去认识到\n[00:50.13]很难去爱\n[00:51.95]当你给予我这些空头的承诺\n[00:55.57]密语甜言 空头承诺\n[00:59.57]你将我困于这空中楼阁中\n[01:19.04]很不容易才能放手\n[01:25.17]因为我已追悔莫及\n[01:32.86]每一句低语 每一声叹息\n[01:37.80]都在愈发侵蚀我的内心\n[01:41.36]如今我的心中有一个空洞\n[01:48.30]所以我把信念寄托在这未知中\n[01:52.42]我生活在一座空中楼阁中\n[01:55.67]但我已厌倦这毫无根据的希望\n[01:59.61]我生活在一座空中楼阁中\n[02:03.17]很难去认识到\n[02:05.11]很难去爱\n[02:07.17]当你给予我这些空头的承诺\n[02:10.42]密语甜言 空头承诺\n[02:14.61]你将我困于这空中楼阁中\n[02:33.61]你说你很在乎我 但这远远不够\n[02:36.30]你说你很在乎我 但这远远不够\n[02:39.99]我们彼此都知道 语言是如此空洞\n[02:47.24]到头仍是一场空\n[03:16.88]密语甜言\n[03:24.07]空头承诺\n" }, "code": 200 };

var oldtime = Date.now();



let result = [[4,
    'You took my heart and you held it in your mouth',
    '你夺走我的心 你把它叼在嘴里'],
    [ 10,
'And with a word all my love came rushing out',
    '只是一句话 我的爱情便支离破碎' ],
[16, '', ''],
    [17,
        'And every whisper; it\'s the worst, emptied out by a single word',
        '你的每句低语 都是谎言 一句话 便将一切都抹去'],
    [25, '', ''],
    [26, 'There is a hollow in me now', '如今我的心中有个空洞'],
    [29, '', ''],
    [33, 'So I\'ll put faith in something I know', '所以我把信念寄托在这未知中'],
    [36, '', ''],
    [37, 'I\'m living on such sweet nothing', '我生活在一座空中楼阁中'],
    [40,
        'But I\'m tired of hope with nothing to hold',
        '但我已厌倦这毫无根据的希望'],
    [44, '', ''],
    [44, 'I\'m living on such sweet nothing', '我生活在一座空中楼阁中'],
    [47, '', ''],
    [48, 'And it\'s hard to learn', '很难去认识到'],
    [50, 'And it\'s hard to love', '很难去爱'],
    [51,
        'When you\'re giving me such sweet nothing',
        '当你给予我这些空头的承诺'],
    [54, '', ''],
    [55, 'Sweet nothing, sweet nothing', '密语甜言 空头承诺'],
    [58, '', ''],
    [59, 'You\'re giving me such sweet nothing', '你将我困于这空中楼阁中'],
    [62, '', ''],
    [79, 'It isn\'t easy for me to let it go', '很不容易才能放手'],
    [83, '', ''],
    [85, 'Cause, I\'ve swallowed every single word', '因为我已追悔莫及'],
    [90, '', ''],
    [92, 'And, every whisper, every sigh', '每一句低语 每一声叹息'],
    [96, '', ''],
    [97, 'Eats away at this heart of mine', '都在愈发侵蚀我的内心'],
    [100, '', ''],
    [101, 'And there is a hollow in me now', '如今我的心中有一个空洞'],
    [104, '', ''],
    [108,
        'So I\'ll put faith in something I know',
        '所以我把信念寄托在这未知中'],
    [111, '', ''],
    [112, 'I\'m living on such sweet nothing', '我生活在一座空中楼阁中'],
    [114, '', ''],
    [115,
        'But I\'m tired of hope with nothing to hold',
        '但我已厌倦这毫无根据的希望'],
    [118, '', ''],
    [119, 'I\'m living on such sweet nothing', '我生活在一座空中楼阁中'],
    [122, '', ''],
    [123, 'And it\'s hard to learn', '很难去认识到'],
    [125, 'And it\'s hard to love', '很难去爱'],
    [126, '', ''],
    [127,
        'When you\'re giving me such sweet nothing',
        '当你给予我这些空头的承诺'],
    [129, '', ''],
    [130, 'Sweet nothing, sweet nothing', '密语甜言 空头承诺'],
    [133, '', ''],
    [134, 'You\'re giving me such sweet nothing', '你将我困于这空中楼阁中'],
    [137, '', ''],
    [153, 'And it\'s not enough', '你说你很在乎我 但这远远不够'],
    [154, '', ''],
    [156, 'To tell me that you care', '你说你很在乎我 但这远远不够'],
    [158, '', ''],
    [159,
        'When we both know the words are empty air',
        '我们彼此都知道 语言是如此空洞'],
    [166, '', ''],
    [167, 'You give me nothing', '到头仍是一场空'],
    [168, '', ''],
    [171, 'Uoooh', ''],
    [172, 'Uoooh', ''],
    [173, 'Uoooh', ''],
    [174, 'Nothing', ''],
    [175, '', ''],
    [192, 'Uoooh', ''],
    [193, 'Uoooh', ''],
    [195, 'Uoooh', ''],
    [196, 'Sweet nothing', '密语甜言'],
    [197, '', ''],
    [199, 'Uoooh', ''],
    [200, 'Uoooh', ''],
    [202, 'Uoooh', ''],
    [203, '', ''],
    [204, 'Sweet nothing', '空头承诺']];


// 测试暴力循环后的时间

var nowtime;
result.forEach((value,index)=>{
    if (value[0] == 204) nowtime = Date.now();
});


console.log('花费的时间' + (nowtime - oldtime) + 'ms');
