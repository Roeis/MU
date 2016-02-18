/**
 * Copyright (C) 2016 Roei - All rights reserved.
 * if has any issue, contact <roeichow@gmail.com>
 */
// (function() {
    'use strict';

    (function (global) {
        var link = 'http://player.youku.com/player.php/sid/XMTQ1OTU5NzE2OA==/v.swf'
        // var link = 'http://v.youku.com/v_show/id_XMTQ1OTU5NzE2OA==.html'
        // var link = 'http://www.tudou.com/v/WFpNHXDfajM/%26bid=05%26resourceId=0_05_05_99/v.swf'
        // var link = 'http://www.tudou.com/albumplay/GK-qgdyMMwI/WFpNHXDfajM.html'
        // var link = 'http://player.video.qiyi.com/e19a631c94ea22c874975f87cbd0e070/0/0/v_19rrl381y4.swf-albumId=444065200-tvId=444065200-isPurchase=0-cnId=6'
        // var link = 'http://www.iqiyi.com/v_19rrl381y4.html?list=19rroaifzy'
        // var link = 'http://static.video.qq.com/TPout.swf?vid=x0175w9cob7%26auto=0'
        // var link = 'http://v.qq.com/cover/b/btiwlze2ftoy54i.html?vid=x0175w9cob7'
        // var link = 'http://player.yinyuetai.com/video/player/2486753/v_0.swf'
        // var link = 'http://v.yinyuetai.com/video/2486753?f=SY-MVSB-QB-1'
        // var link = 'http://cdn.aixifan.com/player/ACFlashPlayer.out.swf?type=page%26url=http://www.acfun.tv/v/ac2434350'
        // var link = 'http://www.acfun.tv/v/ac2434350'
        // var link = 'http://static.hdslb.com/miniloader.swf?aid=3676843%26page=1'
        // var link = 'http://www.bilibili.com/video/av3860771/';

        global.HJVideo.showVideo({
            videoURLorID: link, //视频的分享的URL或者ID。
            containerID:'tudou', //为步骤二种的容器ID
            width: '100%',
            height: 'auto',
            getVideoUrl: function(url){
                console.log(url)
            }
        });


    })(this);
// }());
