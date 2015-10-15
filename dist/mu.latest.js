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
     
    mu.version = '2.4.7';
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
            isMeizu: /meizu|m[0-9x]{1,3}/.test(ua),
            isSamsung: /samsung|\b(?:sgh|sch|gt|sm)-([a-z0-9]+)/.test(ua),
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
/**
 * -------------------------------------------------------------
 * Copyright (c) 2014 All rights reserved.
 * @version: 1.1.0
 * @author: roeis
 * @description: rewrite touch event, fix some issue in offical js
 *               it can scroll vertically when trigger the touchstart of swipe
 *               compatiable with pc mouse event
 *               IMPORTANT: 
 *               when u use swipeUp and swipeDown
 *               prevent global touchmove event
 * -------------------------------------------------------------
 */
(function($) {
    'use strict';
    var $elem,
        start = {},
        delta = {},
        tapTimeout = null,
        longTapTimeout = null,
        isScrolling;

    function cancelLongTap() {
        if (longTapTimeout) clearTimeout(longTapTimeout);
        longTapTimeout = null;
    }

    var events = {
        start: function(event) {

            var touches = event || event.originalEvent,
                touch = touches.touches ? touches.touches[0] : event;

            start = {
                x: touch.clientX,
                y: touch.clientY,
                time: Date.now()
            };
            $elem = $(this._parentIfText(touch.target));

            //used for testing the first touch event
            isScrolling = undefined;

            //reset delta
            delta = {
                x : 0,
                y : 0
            };

            longTapTimeout = setTimeout(function(){
                longTapTimeout = null;
                $elem.trigger('longTap');
            }, 700);
        },

        move: function(event) {
            var touches = event || event.originalEvent,
                touch = touches.touches ? touches.touches[0] : event;
            if (touches && touches.length > 1 || event.scale && event.scale !== 1) return;

            cancelLongTap();

            delta = {
                x: touch.clientX - start.x,
                y: touch.clientY - start.y
            };

            //determine if scroll test has run !important!
            //return trendence if updown or leftright
            if (typeof isScrolling === 'undefined') {
                isScrolling = isScrolling || Math.abs(delta.x) < Math.abs(delta.y);
            }

            if (!isScrolling) {
                //issue: preventDefault to fire the touchmove and touchend event
                event.preventDefault();
            }
        },

        end: function(event) {

            var duration = Date.now() - start.time,
                isHorizontal = duration < 250 && Math.abs(delta.x) > 20 || Math.abs(delta.x) > 80,
                isVertical = duration < 250 && Math.abs(delta.y) > 20 || Math.abs(delta.y) > 80,
                isSwipeLeft = delta.x < 0,
                isSwipeUp = delta.y < 0;

            cancelLongTap();


            if (!isScrolling && isHorizontal) {
                $elem.trigger(isSwipeLeft ? 'swipeLeft' : 'swipeRight');
            }else if(isScrolling && isVertical){
                $elem.trigger(isSwipeUp ? 'swipeUp' : 'swipeDown');
            }

            tapTimeout = setTimeout(function(){
                tapTimeout = null;
                if(Math.abs(delta.x) < 5 && Math.abs(delta.y) < 5 && duration < 300) {
                    var evt = $.Event('tap');                    
                    $elem.trigger(evt);
                }
            }, 0);
        },

        _parentIfText: function(node) {
            return 'tagName' in node ? node : node.parentNode;
        }
    };

    var isMobile   = window.mu ? window.mu.detect.isMobile : true,
        startEvent  = isMobile ? 'touchstart' : 'mousedown',
        moveEvent   = isMobile ? 'touchmove' : 'mousemove',
        endEvent    = isMobile ? 'touchend' : 'mouseup',
        cancelEvent = isMobile ? 'touchcancel' : 'mouseup';

    $(document).on(startEvent, function(event) {
        events.start(event);
    }).on(moveEvent, function(event) {
        events.move(event);
    }).on(endEvent, function(event) {
        events.end(event);
    }).on(cancelEvent, function() {
        delta = {};
    });

    ['swipeLeft', 'swipeRight', 'swipeUp', 'swipeDown', 'tap', 'longTap'].forEach(function(eventName) {
        $.fn[eventName] = function(callback) {
            return this.on(eventName, callback);
        };
    });

})(window.Zepto || window.jQuery);
/**
 * --------------------------------------------------------
 * Copyright (c) 2015 All rights reserved.
 * @version: 1.0.0
 * @author: roeis
 * @description: new dialog component using animation not transition
 * --------------------------------------------------------
 */
(function($) {
    'use strict';
    // extend Dialog to make confirm, dialog, tip, alert
    // with common style, change the default pop system
    // not support scroll element yet
    //
    // known issue: can't work in meizu's browser, but work well in meizu's weixin browser
    // known issue: what is the best implementation to how to put the bg element

    function Dialog(el, options) {
        this.$el = $(el);
        this.options = options;
        this.init();
    }

    var defaults = {
        isBgCloseable: true,                    // 点击背景是否关闭弹窗
        showClass: 'mu-scaleDownIn',            // 自定义弹窗进场动画, css3 animation
        hideClass: 'mu-scaleDownOut',           // 自定义弹窗出场动画
        preset: 'scaleDownIn',                  // 样式组合, scaleUpIn, scaleDownIn, fadeIn, fadeInUp, fadeInDown, fadeInRight
        isCenter: true,
        zIndex: 1000,                           // 大于这个值
        opacity: 0.8,                          // 背景透明度
        beforeOpen: function() {},
        afterOpen: function() {},
        beforeClose: function() {},
        afterClose: function() {}
    };

    var isScrollPrevented = window.mu.util.isScrollPrevented;
    var needAdaptDevices = window.mu.detect.isMeizu || window.mu.detect.isSamsung;

    var $body = $(document.body),
        // bgShowed = 0,
        classSets = {
            'scaleUpIn': ['mu-scaleUpIn','mu-scaleDownOut'],
            'scaleDownIn': [defaults.showClass, defaults.hideClass],
            'fadeIn':  ['mu-fadeIn','mu-fadeOut'],
            'fadeInDown':  ['mu-fadeInDown','mu-fadeOutDown'],
            'fadeInUp':  ['mu-fadeInUp','mu-fadeOutUp'],
            'fadeInRight':  ['mu-fadeInRight','mu-fadeOutRight'],
        };

    Dialog.prototype = {
        constructor: Dialog,
        init: function() {
            this.options = $.extend({}, defaults, this.options);
            if(!this.$el.length) return;
            this._create();
            this._bind();
        },

        _create: function() {
            this.$bg = $(document.createElement('div')).addClass('mu-dialog-bglayer');
            this.$dialog = this.$el;
            this.isOpen = false;
            
            // get the element, add class, not choose the way that wrap the element
            // make this element fixed, add styles on what u want
            this.$dialog
                .addClass('mu-dialog')
                .show()
                .css({
                    'z-index' : this.options.zIndex
                });
            this.$bg.css({
                'z-index': this.options.zIndex - 1,
                'background-color': 'rgba(0,0,0,'+ this.options.opacity +')'
            });
            $body.append(this.$bg).append(this.$dialog);

            this._adjust();

            // change the class of dialog animation
            if (this.options.preset && classSets[this.options.preset]) {
                this.options.showClass = classSets[this.options.preset][0];
                this.options.hideClass = classSets[this.options.preset][1];
            }
        },

        // adjust the dialog's postion 
        // set this way to adjust postion for fix uc, firefox, etc;
        _adjust: function(){
            var height,
                width;
            if(this.options.isCenter){
                height = this.$dialog.height();
                width = this.$dialog.width();
                this.$dialog.css({
                    'left': '50%',
                    'top': '50%',
                    'margin-left': -width/2,
                    'margin-top': -height/2
                });
            }
        },

        // event bind
        _bind: function() {
            var self = this;
            if (self.options.isBgCloseable) {
                self.$bg.on('tap', function(event) {
                    self.close();
                    event.stopPropagation();
                });
            }
            
            //solve orientchange issue, it recalculate its size when screen changes
            //solve orientchange in chrome between others browsers
            //change orientchange event to resize
            $(window).on('resize', function(){
                self._adjust();
            });
        },

        html: function(html){
            this.$dialog.html(html);
            this._adjust();
        },

        open: function() {
            if (this.isOpen) return;
            this.isOpen = true;
            // bgShowed ++;
            this.options.beforeOpen.call(this);

            this._show(this.$dialog, this.options.showClass, $.proxy(function() {
                this.options.afterOpen.call(this);
                window.mu.util.preventScroll();
            }, this));
            this._show(this.$bg, 'mu-fadeIn');
        },

        close: function() {
            if (!this.isOpen) return;

            this.options.beforeClose.call(this);

            this._hide(this.$dialog, this.options.hideClass, $.proxy(function() {
                this.options.afterClose.call(this);
                this.isOpen = false;
                if(!isScrollPrevented){
                    window.mu.util.recoverScroll();
                }
            }, this));
            this._hide(this.$bg, 'mu-fadeOut');
        },

        // require $.fn.oneAnimationEnd
        // encapsulate two functions that handle showing and closing the dialog
        // with css3 animation end callback
        // !important : change the property from display to visibility
        // when the dialog is unvisible, its properties still can be read
        // such as height, width etc;
        _show: function($obj, cls, callback) {

            if(needAdaptDevices){
                $obj.addClass('mu-visible').show();
                callback && callback();
            }else{
                $obj.addClass('mu-visible').oneAnimationEnd(cls, function() {
                    $obj.removeClass(cls);
                    callback && callback();
                });
            }
        },
        _hide: function($obj, cls, callback) {
            if(needAdaptDevices){
                $obj.hide();
                callback && callback();
            }else{
                $obj.oneAnimationEnd(cls, function() {
                    $obj.removeClass('mu-visible').removeClass(cls);
                    callback && callback();
                });
            }
        }
    };
    
    window.MuDialog = Dialog;

    $.fn.muDialog = function(options){
        var args = Array.prototype.slice.call(arguments, 1);
        this.each(function() {
            var $this = $(this),
                instance = $.fn.muDialog.instances[$this.data('muDialog')];

            if (!instance) {
                //cache the instance , use $.data in jquery, but in zepto data function is not fully supperted
                $.fn.muDialog.instances[$.fn.muDialog.instances.i] = new Dialog(this, options);
                $this.data('muDialog', $.fn.muDialog.instances.i);
                $.fn.muDialog.instances.i++;
            }else if(typeof options === 'string' && instance[options]){
                instance[options].apply(instance, args);
            }

        });
        return this;
    };
    $.fn.muDialog.instances = {
        i: 0
    };


})(window.Zepto || window.jQuery);
/**
 * --------------------------------------------------------
 * Copyright (c) 2015 All rights reserved.
 * @version: 1.0.0
 * @author: roeis
 * @description: extend common pop plugin to utility
 * --------------------------------------------------------
 */
(function($, undefined){
    'use strict';

    var mu = window.mu;

    var dialog = new window.MuDialog('<div class="mu-pop"></div>', {
        zIndex: 9999,
        isBgCloseable: false,
        opacity: 0.7,
        preset: 'scaleUpIn'
    });
    /**
     * tip
     * @param  {[type]} string  
     * @param  {[type]} timeout 
     * @return {[type]}         
     */
    mu.util.tip = function(string, timeout){
        var html = '<div class="mu-pop-title">提示</div><div class="mu-pop-content">' + string + '</div>';
        $.extend(dialog.options, {});

        dialog.html(html);
        dialog.open();
        setTimeout(function(){
            dialog.close();
        }, timeout || 3000);
    };
    /**
     * alert
     * @param  {[type]} string 
     * @return {[type]}        
     */
    mu.util.alert = function(string){
        var html = '<div class="mu-pop-content">' + string + '</div>'+
                    '<div class="mu-btns">'+
                    '<div class="mu-btn mu-btn-ok">确定</div>'+
                    '</div>';
        $.extend(dialog.options, {});
        dialog.html(html);
        dialog.open();
        $(document).on('click', '.mu-btn-ok', function(){
            dialog.close();
        });
    };
    /**
     * [confirm description]
     * @return {[type]} [description]
     */
    mu.util.confirm = function(string, callback){
        var html =  '<div class="mu-pop-content">' + string + '</div>' +
                    '<div class="mu-btns mu-2btns cf">'+
                    '<div class="mu-btn mu-btn-confirm">确定</div>' +
                    '<div class="mu-btn mu-btn-cancel">取消</div>'+
                    '</div>';
        $.extend(dialog.options, {});
        dialog.html(html);
        dialog.open();
        $('.mu-btn').on('click', function(){
            dialog.close();
            var $this = $(this);
            if($this.hasClass('mu-btn-confirm')){
                callback && callback.call(this, true);
            }else{
                callback && callback.call(this, false);
            }
        });
    };

})(window.Zepto || window.jQuery);
/**
 * -------------------------------------------------------------
 * Copyright (c) 2015 All rights reserved.
 * @version: 1.1.0
 * @author: roeis
 * @description: extend slider from swipeable
 * @dependency: $.fn.swipeable
 * -------------------------------------------------------------
 */

(function($) {
    'use strict';

    var Slider = function(el, opts) {
        this.$el = $(el);
        this.opts = opts;
        this.init();
    };
    var defaults = {
        autoSlide: false,
        speed: 500,
        isLoop: false,
        isVert: false,
        isHidden: true,
        timing: 'ease',                     // timing: 'cubic-bezier(.61,.07,.05,.87)'
        beforeSlide: function($nextPage, $prevPage) {},
        afterSlide: function($nextPage, $prevPage, index) {}
    };
    Slider.prototype = {
        init: function() {
            this.opts = $.extend({}, defaults, this.opts);
            if(!this.$el.length) return;
            this._create();
            this._bind();
        },
        _create: function() {
            var self = this;
            self.$children = self.$el.children();
            self.max = self.$children.length;
            self.animating = false;     //正在动画
            self.isMoving = false;      //正在手势滑动
            self.looptime = null;
            self.index = 0;             // 起始序号
            self.clones = 0;            // 克隆数
            
            if(self.opts.isLoop){
                self.index = 1;
                self.clones = 2;
                self.max += self.clones;
            }

            self.$children.wrapAll('<div class="slider-wrap"></div>');
            // maintain each instance standlone, when initialize lot of instance with a same class
            // in jump function, the active target is self.$slider, and this would be current target's parent
            self.$slider = self.$children.closest('.slider-wrap');

            // in vertical mode , it resolve a different value
            self._setHeight();

            if(self.opts.isHidden){
                self.$el.css('overflow', 'hidden');
            }

            self.$el.css('position', 'relative');
            self.$slider.css({
                'position': 'absolute',
                '-webkit-transition-timing-function': self.opts.timing,
                'transition-timing-function': self.opts.timing
            });

            if(self.opts.isVert){
                //ATTENTION: prevent global touchmove event
                window.mu && mu.util.preventScroll();
                self.$slider.css({'height': self.max * 100 + '%', 'width': '100%'});
                self.$children.css({'height': 100 / self.max + '%'});
            }else{
                self.$slider.css({'width': self.max * 100 + '%'});
                self.$children.css({'width': 100 / self.max + '%', 'float': 'left'});
            }

            if(self.opts.isLoop){
                self._setClone();
            }
            self.curIndex = 0;
            self.$prevPage = self.$children.eq(self.curIndex);

            self._jump(self.index);

            if(self.opts.autoSlide){
                self.loop();
            }
        },
        _setHeight: function(){
            var height;

            if(!this.opts.isVert) height = this.$children.height();
            if(height > 0) this.$el.css('height', height);
        },
        _setClone: function(){
            if(this.opts.isLoop){
                var $cloneFirst = this.$children.eq(0).clone().addClass('mu-clone'),
                    $cloneLast = this.$children.eq(this.max - this.clones - 1).clone().addClass('mu-clone');

                this.$slider.prepend($cloneLast).append($cloneFirst);
            }
        },
        loop: function(){
            var self = this;
            if(self.index >= self.max - 1 ){
                // self.stopLoop();
                self.index = this.clones - 1;
                // return;
            }
            
            self.looptime = setTimeout(function(){
                // Plus index before transform, attention when loop
                self.index ++;
                self.jump(self.index);
                self.loop();
            }, 3000);
            
        },
        stopLoop: function(){
            clearTimeout(this.looptime);
        },
        _bind: function() {
            var startPoint = 0,
                self = this;

            self.$el.swipeable({
                enableVertical: self.opts.isVert,
                start: function(data) {
                    if(self.opts.autoSlide){
                        self.stopLoop();
                    }
                    // fix slider flick that are not 100% size, minus the offset
                    if(self.opts.isVert){
                        startPoint = self.$slider.offset().top - self.$el.offset().top;
                    }else{
                        startPoint = self.$slider.offset().left - self.$el.offset().left;
                    }
                    if(self.animating) return;
                    // ATTENTION: in mobile device, in continous quick touchevents
                    // touchstart won't fire, so set a flag forcely
                    // enable touchstart callback do properly
                    self.isMoving = true;

                    self._clearTransition();
                },
                move: function(data) {
                    if(self.animating || !self.isMoving) return;
                    var deltaX = startPoint + data.delta.x,
                        deltaY = startPoint + data.delta.y,
                        transValue = '';

                    if(self.opts.isVert){
                        transValue = 'translate(0,' + deltaY + 'px) translateZ(0)';
                    }else{
                        transValue = 'translate(' + deltaX + 'px, 0) translateZ(0)';
                    }
                    self.$slider.css({
                        '-webkit-transform': transValue,
                        'transform': transValue
                    });
                },
                end: function(data) {
                    // ATTENTION: here is flag that determine if trigger the slider
                    // one is a quick short swipe , another is distance diff
                    if(!self.isMoving) return;
                    self.isMoving = false;

                    var deltaValue = self.opts.isVert ? data.delta.y : data.delta.x;
                    if (data.deltatime < 250 && Math.abs(deltaValue) > 20 || Math.abs(deltaValue) > 100) {
                        if (deltaValue > 0) {
                            self.index--;
                            self.index = self.index < 0 ? 0 : self.index;
                        } else {
                            self.index++;
                            self.index = self.index > self.max - 1 ? self.max - 1 : self.index;
                        }
                    }
                    // FIX: avoid click event to trigger jump, make sure delta greater than zero
                    if(Math.abs(deltaValue) > 0){
                        self.jump(self.index);
                    }
                }
            });

            //solve orientchange issue, it recalculate its size when screen changes
            var orientationEvt = 'onorientationchange' in window ? 'orientationchange' : 'resize';
            window.addEventListener(orientationEvt, function() {
                self._jump(self.index);
            }, false);
        },
        _clearTransition: function(){
            this.$slider.css({
                '-webkit-transition-duration': '0s',
                'transition-duration': '0s'
            });
        },
        _setTransition: function(){
            this.$slider.css({
                '-webkit-transition-duration': '.4s',
                'transition-duration': '.4s'
            });
        },
        _destory: function(){
            if(this.opts.isLoop){
                $('.mu-clone').remove();
            }
            this.$children.removeAttr('style').unwrap();
        },
        prev: function() {
            var idx = this.index;
            idx--;
            if (!this.opts.autoSlide && idx < 0) return;
            if (this.opts.autoSlide && idx < 0) {
                idx = this.max - 1;
            }
            this.jump(idx);
        },
        next: function() {
            var idx = this.index;
            idx++;
            if (!this.opts.autoSlide && idx > this.max - 1) return;
            if (this.opts.autoSlide && idx > this.max - 1) {
                idx = 0;
            }
            this.jump(idx);
        },
        jump: function(index){
            var self = this;
            self.animating = true;
            this._setTransition();

            var realIndex = self._getPageIndex(index),
                flag = this.curIndex === realIndex;

            this.$nextPage = this.$children.eq(realIndex);
            this.$prevPage = this.$children.eq(this.curIndex);

            // console.log(this.curIndex, realIndex, 'next');

            self._jump(index, function(){
                if(!flag) self.opts.beforeSlide.call(self, self.$nextPage, self.$prevPage);
            });

            self._transitionCallback(flag);
        },

        _getPageIndex: function(index){
            var cloneIndex = index;

            if(this.opts.isLoop){
                // till the last clone
                if(cloneIndex === 0) cloneIndex = this.max - this.clones;
                // till the first clone
                if(cloneIndex === this.max - 1) cloneIndex = 1;
                // get the origin index
                cloneIndex --;
            }
            return cloneIndex;
        },

        /**
         * 静态位置变化
         * @param  {[type]}   index    [description]
         * @param  {Function} callback [description]
         * @return {[type]}            [description]
         */
        _jump: function(index, callback) {
            // get a width of px value, because % value does not work in andriod
            var distance = this.opts.isVert ? this.$slider.height() : this.$slider.width(),
                value = -distance * (index / this.max),
                transValue = this.opts.isVert ? 'translate(0,' + value + 'px) translateZ(0)' : 'translate(' + value + 'px, 0) translateZ(0)';
            this.index = index;
            callback && callback();
            this.$slider.css({
                '-webkit-transform': transValue,
                'transform': transValue
            });
        },
        _transitionCallback: function(flag){
            var self = this;
            self.$slider.one(window.animationEvents.transitionEnd, function(){
                self.animating = false;
                self._clearTransition();
                // handle actual index, with or without loop
                if(self.opts.isLoop){
                    if(self.index === 0) self.index = self.max - self.clones;
                    if(self.index === self.max - 1) self.index = 1;
                    
                    self._jump(self.index);
                    // because add clone, current Index minus one
                    self.curIndex = self.index - 1;
                }else{
                    self.curIndex = self.index;
                }
                if(!flag) self.opts.afterSlide.call(self, self.$nextPage, self.$prevPage, self.curIndex);
            });
        }
    };

    window.MuSlider = Slider;

    $.fn.muSlider = function(options) {
        var args = Array.prototype.slice.call(arguments, 1);
        this.each(function() {
            var $this = $(this),
                instance = $.fn.muSlider.instances[$this.data('muSlider')];

            if (!instance) {
                //cache the instance , use $.data in jquery, but in zepto data function is not fully supperted
                $.fn.muSlider.instances[$.fn.muSlider.instances.i] = new Slider(this, options);
                $this.data('muSlider', $.fn.muSlider.instances.i);
                $.fn.muSlider.instances.i++;
            }else if(typeof options === 'string' && instance[options]){
                instance[options].apply(instance, args);
            }

        });
        return this;
    };

    $.fn.muSlider.instances = {
        i: 0
    };

})(window.Zepto || window.jQuery);
/**
 * --------------------------------------------------------
 * Copyright (c) 2015 All rights reserved.
 * @version: 1.0.0
 * @author: roeis
 * @description: page transition use css3 animation
 * --------------------------------------------------------
 */
(function($, undefined) {
    'use strict';


    function Page(el, options) {
        this.$el = $(el);
        this.options = options;
        this.init();
    }

    // TODO : add mode such as 'slideVertical | slideHorizontal'
    // TODO : add an extra css3 animation plugin
    var defaults = {
        isLoop: true,
        pageStart: 0,
        classPrev: [],
        classNext: [],
        mode: 'vertical',                             // horizontal
        beforeSlide: function($pagein, $pageout) {},
        afterSlide: function($pagein, $pageout, index) {}
    };

    // prevent global default event

    var showCls = 'mu-page-current',
        classSets = {
            'vertical': {
                classPrev: ['mu-moveFromTop', 'mu-moveToBottom'],
                classNext: ['mu-moveFromBottom', 'mu-moveToTop']
            },
            'horizontal': {
                classPrev: ['mu-moveFromLeft', 'mu-moveToRight'],
                classNext: ['mu-moveFromRight', 'mu-moveToLeft']
            }
        };

    Page.prototype = {
        init: function() {
            this.options = $.extend({}, defaults, this.options);
            if (!this.$el.length) return;
            this._create();
        },
        _create: function() {
            this.size = this.$el.length;
            this.isAnimating = false;
            this.index = this.options.pageStart;
            this.$pageOut = this.$el.eq(this.index);
            this.$pageIn = null;
            this.pageInAnimated = false;
            this.pageOutAnimated = false;

            this.$el.each(function() {
                var $this = $(this);
                $this.addClass('mu-page');
            }).eq(this.index).addClass(showCls).siblings().removeClass(showCls);

            if (this.options.mode && classSets[this.options.mode]) {
                this.options.classPrev = classSets[this.options.mode].classPrev;
                this.options.classNext = classSets[this.options.mode].classNext;
            }

        },
        prev: function() {
            var idx = this.index;
            idx--;
            if (!this.options.isLoop && idx < 0) return;
            if (this.options.isLoop && idx < 0) {
                idx = this.size - 1;
            }
            this.jump(idx, this.options.classPrev[0], this.options.classPrev[1]);
        },
        next: function() {
            var idx = this.index;
            idx++;
            if (!this.options.isLoop && idx > this.size - 1) return;
            if (this.options.isLoop && idx > this.size - 1) {
                idx = 0;
            }
            this.jump(idx, this.options.classNext[0], this.options.classNext[1]);
        },
        /**
         * [jump description]
         * @param  {number} idx      [description]
         * @param  {string} inClass  [description]
         * @param  {string} outClass [description]
         * @return 
         */
        jump: function(idx, inClass, outClass) {
            var self = this;
            if (idx === self.index || idx > self.size - 1 || self.isAnimating) return;
            self.isAnimating = true;
            //1.cache a default class for page transition, compare idx and self.index to set prev or next
            //2.enable custom class for page transition
            inClass = inClass ? inClass : idx > self.index ? self.options.classNext[0] : self.options.classPrev[0];
            outClass = outClass ? outClass : idx > self.index ? self.options.classNext[1] : self.options.classPrev[1];

            // the target page transform in
            self.$pageIn = self.$el.eq(idx);
            self.$pageOut = self.$el.eq(self.index);
            self.$pageIn.addClass(showCls);

            self.options.beforeSlide.call(self, self.$pageIn, self.$pageOut);

            //FIX: page flicker when jump between pages
            // set one callback at the total transition
            self._animationEnd(self.$pageOut, outClass, function() {
                self.pageOutAnimated = true;
                if(self.pageInAnimated){
                    self.afterAnimation(idx, inClass, outClass);
                }
            });

            self._animationEnd(self.$pageIn, inClass, function() {
                self.pageInAnimated = true;
                if(self.pageOutAnimated){
                    self.afterAnimation(idx, inClass, outClass);
                }
            });
        },
        afterAnimation: function(idx, inClass, outClass){
            this.isAnimating = false;

            //remove page's transition class here
            this.pageOutAnimated = false;
            this.pageInAnimated = false;
            this.$pageOut.removeClass(showCls).removeClass(outClass);
            this.$pageIn.removeClass(inClass);

            this.index = idx;
            this.options.afterSlide.call(this, this.$pageIn, this.$pageOut, idx);
        },
        _animationEnd: function($obj, cls, callback) {
            $obj.addClass(cls).one(window.animationEvents.animationEnd, function() {
                callback(cls);
            });
        },
        destroy: function() {
            this.$el.removeClass('mu-page').removeClass('mu-page-current');
        },
    };

    window.MuPage = Page;

    $.fn.muPage = function(options) {
        var args = Array.prototype.slice.call(arguments, 1);
        this.each(function() {
            var $this = $(this),
                instance = $.fn.muPage.instances[$this.data('muPage')];

            if (!instance) {
                //cache the instance , use $.data in jquery, but in zepto data function is not fully supperted
                $.fn.muPage.instances[$.fn.muPage.instances.i] = new Page(this, options);
                $this.data('muPage', $.fn.muPage.instances.i);
                $.fn.muPage.instances.i++;
            } else if (typeof options === 'string' && instance[options]) {
                instance[options].apply(instance, args);
            }
        });
        return this;
    };
    $.fn.muPage.instances = {
        i: 0
    };


})(window.Zepto || window.jQuery);