/**
 * --------------------------------------------------------
 * Copyright (c) 2015 All rights reserved.
 * @version: 2.0.0
 * @author: roeis
 * @description: menghu mobile solution, mu-2.0.0.min.js
 * --------------------------------------------------------
 */
(function(global, $, undefined) {
    'use strict';
    var mu = global.mu = global.mu || {};
     
    mu.version = '2.4.6';
    mu.$doc = $(document);
    mu.$win = $(window);
    mu.hasTouch = 'ontouchstart' in window;
    mu.UA = window.navigator.userAgent.toLowerCase();
})(this, window.Zepto || window.jQuery);

/**
 * known issue: lots of css3 animation function didn't work in 
 * meizu's self browser, so suggest alert a message in meizu to ignore
 * it is not well cost to fix those issue in meizu
 */
(function(global, undefined){
    'use strict';
    var mu = global.mu || {},
        ua = mu.UA,
        core = {
            isWeixin : /micromessenger/.test(ua),
            isAndroid: /android/.test(ua),
            isIOS:/iphone|ipad|ipod/.test(ua),
            isMeizu: /m[0-9x]{1,3}/.test(ua),
            isChrome: /chrome/.test(ua),
            isUC : /ucbrowser/.test(ua),
            isQQ : /mqqbrowser/.test(ua),
            isWP : /windows phone|iemobile/.test(ua),
            isBlackBerry : /blackberry/i.test(ua)
        };
    mu.detect = core;

    mu.detect.isMobile = core.isAndroid || core.isBlackBerry || core.isWindowPhone || core.isIOS;
    mu.detect.isPC = !core.isWeixin && !core.isMobile;
})(this);

/**
 * utility
 */
(function(global, undefined){
    'use strict';
    var mu = global.mu || {};
    var core = {
        /**
         * 获取querystring
         * @param  {String} name
         * @return {String} 
         */
        getQueryString: function(name) {
            var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i'),
                r = window.location.search.substr(1).match(reg);

            if (r !== null) return window.unescape(r[2]);
            return null;
        },
        /**
         * 阻止全局页面滚动
         */
        preventScroll: function() {
            document.addEventListener('touchmove', core._preventDefault, false);
            this.isScrollPrevented = true;
        },
        /**
         * 回复全局页面滚动
         */
        recoverScroll: function() {
            document.removeEventListener('touchmove', core._preventDefault, false);
            this.isScrollPrevented = false;
        },
        _preventDefault: function(e) {
            e.preventDefault();
        },
        /**
         * encode 内容
         * @param  {string} str 
         */
        htmlEncode: function(str) {
            var div = document.createElement('div'),
                text = document.createTextNode(str);
            div.appendChild(text);
            return div.innerHTML;
        },
        /**
         * decode 内容
         * @param  {string} str 
         */
        htmlDecode: function(str) {
            var div = document.createElement('div');
            div.innerHTML = str;
            return div.innerText;
        },
        /**
         * [getGUID description]
         * @return {[type]} [description]
         */
        getGUID: function() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random() * 16 | 0,
                    v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            }).toUpperCase();
        },

        /**
         * 获取元素的类型
         * @param  {any} o 目标对象
         * @return {string}   'string', 'object', 'number' etc;
         */
        getType: function(obj) {
            return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();
        },

        isNumber: function(obj){
            return core.getType(obj) === 'number';
        },
        isObject: function(obj){
            return core.getType(obj) === 'object';
        },
        isFunction: function(obj){
            return core.getType(obj) === 'function';
        },
        isArray: function(obj){
            return core.getType(obj) === 'array';
        },
        isString: function(obj){
            return core.getType(obj) === 'string';
        },
        /**
         * 深拷贝
         * @param  {array or object} obj 传入对象或数组
         * @return {object}
         */
        copy: function(obj) {
            var type = core.getType(obj),
                o = type === 'array' ? [] : {};

            if (type === 'array') {
                o = obj.slice(0);
            }
            for (var key in obj) {
                var _type = core.getType(obj[key]);
                o[key] = _type === 'object' || _type === 'array' ? core.copy(obj[key]) : obj[key];
            }
            return o;
        },
        /**
         * [extend description]
         * @param  {Object} obj 
         * @return {Object}     
         */
        extend: function(obj){
            for (var index = 1; index < arguments.length; index++) {
                var sourceObj = arguments[index];
                for (var item in sourceObj) {
                    obj[item] = sourceObj[item];
                }
            }
            return obj;
        },
        /**
         * 动态加载样式
         * @param  {String} url 样式URL
         * @return 
         */
        requireCss: function(url){
            var node = document.createElement('link'),
                head = document.getElementsByTagName('head');

            node.type = 'text/css';
            node.rel = 'stylesheet';
            node.href = url;
            head = head.length ? head[0] : document.documentElement;
            head.appendChild(node);
        }
    };
    mu.util = core;
})(this);

/**
 * request data
 */
(function(global, $) {
    'use strict';

    var mu = global.mu,
        CACHE_PREFIX = '_H_cache_',
        option = {
            url: '',
            data: {},
            success: null,
            error: null,
            contentType: 'application/x-www-form-urlencoded',
            dataType: 'jsonp',
            storage: false,     //单位: 分钟
        };

    var core = {

        get: function(opts) {
            opts = $.extend({}, option, opts);

            var storageId,
                cacheData,
                now = Date.now();

            opts.url += '?v=' + Math.random();

            // get a fake uid
            for (var key in opts.data) {
                storageId += '_' + opts.data[key];
            }

            // storage 判断缓存数据是否存在
            //      存在 -> 判断时间是否需要更新
            //          1 -> 重新请求
            //          0 -> 处理数据
            //      不存 -> 重新请求

            if (opts.storage && localStorage[CACHE_PREFIX + storageId]) {

                cacheData = core.getData(storageId);

                if (cacheData && (now - cacheData.cacheTime > opts.storage * 1000 * 60)) {
                    core._ajaxData(opts, storageId);
                } else {
                    opts.success && opts.success(cacheData.data);
                }

            } else {
                core._ajaxData(opts, storageId);
            }
        },

        _ajaxData: function(opts, storageId) {
            opts = $.extend({}, option, opts);
            $.ajax({
                type: 'GET',
                url: opts.url,
                dataType: opts.dataType,
                data: opts.data,
                jsonp: 'callback',
                success: function(data) {
                    opts.success && opts.success(data);
                    if (opts.storage && storageId) {
                        core.saveData(storageId, data);
                    }
                },
                error: function(err) {
                    opts.error && opts.error(err);
                }
            });
        },

        post: function(opts) {
            opts = $.extend({}, option, opts);
            $.ajax({
                type: 'POST',
                url: opts.url,
                data: opts.data,
                contentType: opts.contentType,
                dataType: opts.dataType,
                success: function(data) {
                    opts.success && opts.success(data);
                },
                error: function(err) {
                    opts.error && opts.error(err);
                }
            });
        },

        saveData: function(key, value) {
            var data = {
                data: value,
                cacheTime: Date.now()
            };
            localStorage[CACHE_PREFIX + key] = JSON.stringify(data);
        },

        getData: function(key) {
            if (localStorage[CACHE_PREFIX + key]) {
                return JSON.parse(window.localStorage[CACHE_PREFIX + key]);
            }
            return false;
        },

        clearData: function() {
            for (var key in localStorage) {
                if (key.indexOf(CACHE_PREFIX) === 0) localStorage.removeItem(key);
            }
        }
    };

    mu.request = core;

})(this, window.Zepto || window.jQuery);

// console info
(function(){
    'use strict';
    window.console.log('%cUI Component Powered by MU %chttps://github.com/Roeis', 'color: #30286B;', 'color:#BD5656;');
})();

/**
 * name: css3 animationEvent callback
 * author: roeis
 * version: 1.0.0
 * description: add animation extension on $.fn;
 */
(function($) {
    'use strict';
    var animationEvent = function() {
            var body = document.body || document.documentElement,
                animationEventNames = {
                    'WebkitTransition': ['webkitAnimationEnd','webkitTransitionEnd','webkitAnimationIteration', 'webkitAnimationStart'],
                    'OTransition': ['oanimationend ','oTransitionEnd otransitionend','oanimationiteration', 'oanimationstart'],
                    'transition': ['animationEnd','transitionend','animationiteration', 'animationstart']
                };

            for (var name in animationEventNames) {
                if (typeof body.style[name] === 'string') {
                    return {
                        animationStart: animationEventNames[name][3],
                        animationIteration: animationEventNames[name][2],
                        animationEnd: animationEventNames[name][0],
                        transitionEnd: animationEventNames[name][1]
                    };
                }
            }
            return false;
        };

    var animationEvents = animationEvent(),
        fnNames = {
            'animationStart': animationEvents.animationStart,
            'animationIteration': animationEvents.animationIteration,
            'animationEnd': animationEvents.animationEnd,
            'transitionEnd': animationEvents.transitionEnd
        };

    window.animationEvents = animationEvents;
    /**
     * callback after adding one css animation that ends
     * @param  {String}   cls      
     * @param  {Function} callback 
     * @return {Object}            
     */
    $.fn.oneAnimationEnd = function (cls, callback){
        $(this[0]).addClass(cls).one(fnNames.animationEnd, function(){
            callback && callback.call(this);
        });
        return this;
    };
    
})(window.Zepto || window.jQuery);

/**
 * -------------------------------------------------------------
 * Copyright (c) 2015 All rights reserved.
 * @version: 1.1.0
 * @author: roeis
 * @description: extend a custom simple touch function collection
 * @todo add mouse event
 * -------------------------------------------------------------
 */
(function($) {
    'use strict';
    var start, delta, isScrolling,
        defaults = {
            enableVertical: false,
            start: function(){},
            move: function(){},
            end: function(){}
        };
    var isMobile   = window.mu ? window.mu.detect.isMobile : true,
        startEvent  = isMobile ? 'touchstart' : 'mousedown',
        moveEvent   = isMobile ? 'touchmove' : 'mousemove',
        endEvent    = isMobile ? 'touchend' : 'mouseup';

    $.fn.swipeable = function(opts) {
        opts = $.extend({}, defaults, opts);
        return this.each(function() {
            var $this = $(this);

            $this
            .on(startEvent, function(event) {
                var touches = event || event.originalEvent,
                    touch = touches.touches ? touches.touches[0] : event;

                start = {
                    x: touch.clientX,
                    y: touch.clientY,
                    time: Date.now()
                };

                isScrolling = undefined;
                delta = {};
                opts.start.call(this, {touch: touch , start: start});

            })
            .on(moveEvent, function(event) {
                var touches = event || event.originalEvent,
                    touch = touches.touches ? touches.touches[0] : event;

                if (touches && touches.length > 1 || event.scale && event.scale !== 1) return;
                if(!start) return;

                delta = {
                    x: touch.clientX - start.x,
                    y: touch.clientY - start.y
                };

                // set a flag which detemine the page is scrolling,
                // purpose here is avoid that page can't scroll when you touch on the target which is on current function
                if (typeof isScrolling == 'undefined') {
                    isScrolling = isScrolling || Math.abs(delta.x) < Math.abs(delta.y);
                }
                if(!opts.enableVertical){
                    if (isScrolling) return;
                    event.preventDefault();
                }
                opts.move.call(this, {touch: touch, delta: delta});
            })
            .on(endEvent, function() {
                if(!opts.enableVertical){
                    if (isScrolling) return;
                }
                opts.end.call(this, {touch: {}, delta: delta, deltatime: Date.now() - start.time});
            });
        });
    };

})(window.Zepto || window.jQuery);