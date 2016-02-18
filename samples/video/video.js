
(function(global) {
    'use strict';
    var HJVideoObject = function() {
        this.opts = {
            type: -1, //来源类型
            width: 400, //高度
            height: 300, //宽度
            videoURLorID: '', //视频ID
            containerID: '', //容器ID
            autoPlay: 0, //是否自动播放
            failure: null,
            getVideoUrl: null,
            callback: null,
            //apiHost:'127.0.0.1:8080'
            apiHost: '123.59.86.101'
        };
        this.SiteCode = {
            iqiyi: 0,
            youku: 1,
            tudou: 2
        }

        this.init = function(data) {
            if (!$.isEmptyObject(data)) {
                $.extend(this.opts, data);
            }
            this.getVideoData();
        };

        this.createYoukuVideo = function(videoID) {
            console.log("load youku id ok")
            var me = this;
            $.ajax({
                type: "GET",
                url: "http://player.youku.com/jsapi",
                dataType: "script",
                data: '',
                cache: true,
                complete: function(data) {
                    var container = $("#" + me.opts.containerID);
                    if (container) {
                        new YKU.Player(me.opts.containerID, {
                            client_id: '07b68fe2e243ab6d',
                            vid: videoID,
                            autoplay: (me.opts.autoPlay == 1),
                            show_related: false
                        });
                        container.width(me.opts.width);
                        container.height(me.opts.height);
                    }

                }
            });
        };


        this.createSohuVideo = function(videoID) {
            var me = this;

            var container = $("#" + me.opts.containerID);
            if (container) {
                createSHPlayer({
                    bid: videoID, //自媒体视频vid，可通过搜狐视频播放页面或OpenAPI接口获取
                    width: me.opts.width, //播放器宽度，像素值
                    height: me.opts.height, //播放器高度，像素值
                    lqd: 18072, //开放平台渠道号，配置正确，才会有数据统计
                    lcode: "0810c434145c7d682b42c50d002e21c2", //加密字符串，正式上线后在开放平台上获取
                    autoplay: false, //是否自动播放，默认false
                    enforceHTML5: false, //是否使用h5播放器, 默认true；
                    getHTML: false, //是否返回字符串，默认false; true时此方法返回播放器html，由使用者将html insert到合适位置， false时使用document.write输出html
                    src: 11510001 //搜狐视频播放来源，固定值
                });
                container.width(me.opts.width);
                container.height(me.opts.height);
            }
            //			$.ajax({
            //    		type: "GET",
            //			url: "",
            //			dataType: "script",
            //				data:'',
            //				cache: true,
            //				complete:function(data){
            //
            //
            //				}
            //		});
        }

        this.getVideoData = function() {
            var me = this;
            $.ajax({
                type: "get",
                async: false,
                url: "http://" + me.opts.apiHost + "/VideoAPI/VideoInfo?s=" + me.opts.videoURLorID + "&t=" + me.opts.type + "&autoplay=" + me.opts.autoPlay,
                dataType: "jsonp",
                jsonp: "callback",
                success: function(data) {

                    switch (data.type) {
                        case -2:
                        case -1:
                            {
                                if (me.opts.failure != null) {
                                    me.opts.failure(data);
                                }
                            }
                        case 0:
                        case 2:
                        case 3:
                        case 5:
                        case 6:
                        case 7:
                            var container = $("#" + me.opts.containerID);
                            if (data.videoUrl && me.opts.getVideoUrl) {
                                me.opts.getVideoUrl(data.videoUrl);
                            }
                            if (container) {
                                container.html(data.result);
                                container.width(me.opts.width);
                                container.height(me.opts.height);
                            }
                            break;
                        case 4:
                            if (data.videoUrl && me.opts.getVideoUrl) {
                                me.opts.getVideoUrl(data.videoUrl);
                            }
                            me.createSohuVideo(data.result);
                            break;
                        case 1:
                            if (data.videoUrl && me.opts.getVideoUrl) {
                                me.opts.getVideoUrl(data.videoUrl);
                            }
                            me.createYoukuVideo(data.result);
                            break;
                    }
                },
                error: function(e) {
                    if (me.opts.failure != null) {
                        me.opts.failure(data);
                    }

                    var container = $("#" + me.opts.containerID);
                    if (container) {
                        container.html("error");
                        container.width(me.opts.width);
                        container.height(me.opts.height);
                    }

                }
            });
        };

    };

    global.HJVideo = {
        showVideo: function(data) {
            if (!$.isEmptyObject(data)) {
                new HJVideoObject().init(data);
            }
        }
    }

})(this);
