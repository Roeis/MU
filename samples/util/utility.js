    // 加载JS
    var loadJs = function (src, callback) {
        var e = document.createElement('script');
        e.type = 'text/javascript';
        e.src = src;
        var s = document.getElementsByTagName('head')[0];
        s.appendChild(e);
        if (callback) {
            $(e).load(callback);
        }
    };

    var loadJSAsync = function (src, callback) {
        var runFunc = function () {
            loadJs(src, callback);
        };
        //如果页面已经加载完就延迟执行
        if (document.readyState == "complete") {
            window.setTimeout(runFunc, 30);
        }
        else {
            //非IE
            if (window.addEventListener) {
                window.addEventListener('load', runFunc, false);
            } else {
                window.attachEvent('onload', runFunc);
            }
        }
    };

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

    // 去掉空格
    trimStart: function (str) {
        var str = str || "";
        return str.toString().replace(/^\s+/, '');
    },

    // 去掉结尾
    trimEnd: function (str) {
        var str = str || "";
        return str.toString().replace(/\s+$/, '');
    },

    // 去空格
    trim: function (str) {
        var str = str || "";
        return str.toString().replace(/^\s+|\s+$/, '');
    },
    

    //扩展对象
    extend: function (dest, source, replace) {
        for (prop in source) {
            if (replace == false && dest[prop] != null) {
                continue;
            }
            dest[prop] = source[prop];
        };
        return dest;
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








    //html编码
    htmlEncode: function (text) {
        var $converter = $("<div></div>");
        $converter.text(text);

        var output = $converter.html();
        $converter = null;
        return output;
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

    hui.util.encode = function (str, decode) {
        str = String(str);
        // encodeURIComponent not encode '
        var fr = '%| |&|;|=|+|<|>|,|"|\'|#|/|\\|\n|\r|\t'.split('|'),
            to = '%25|%20|%26|%3B|%3D|%2B|%3C|%3E|%2C|%22|%27|%23|%2F|%5C|%0A|%0D|%09'.split('|');
        if (decode == 'decode') {
            for (var i = fr.length - 1; i > -1; i--) {
                str = str.replace(new RegExp('\\' + to[i], 'ig'), fr[i]);
            }
        }
        else {
            for (var i = 0, l = fr.length; i < l; i++) {
                str = str.replace(new RegExp('\\' + fr[i], 'ig'), to[i]);
            }
        }
        return str;
    };

    //用于对一长串字串生成一个类似md5标识的简单方法
    toCode: function (str, length) {
        var str = str || "0";
        var length = length || 16; //最大长度16位
        var num = 0;
        for (var i = 0; i < str.length; i++) {
            num += str.charCodeAt(i) * i;
        }
        return num.toString(16).substr(0, length);
    },

    function toCode(str, length) {
        var str = str || '0',
            length = length || 16; //最大长度16位
        var num = 0;
        for (var i = 0; i < str.length; i++) {
            num += str.charCodeAt(i) * i;
        }
        return num.toString(16).substr(0, length);
    }

    hui.util.decode = function (str) {
        return this.encode(str, 'decode');
    };




    //获取参数值
    getParam: function (src, name) {
        var match = src.match(new RegExp("[?&]" + name + "=(\\w+)"));
        if (match != null) {
            return match[1];
        }
        return null;
    },

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

    //分析请求字串
    parseQuery: function (query) {
        var str = (query || "").replace(/^#/, "");
        arr = str.split('&');
        var params = {};
        for (var i = 0; i < arr.length; i++) {
            var arr2 = arr[i].split('=');
            var name = arr2[0].toLowerCase();
            var value = decodeURIComponent(arr2[1]);
            if (value.match(/%[0-9A-F]{2}/)) {
                value = decodeURIComponent(value);
            }
            params[name] = value;
        }
        return params;
    },



    uniqID: function (string) {
        string = string || '_';
        return string + Math.floor(Math.random() * 10000000) + new Date().getTime().toString().substring(10, 13);
    },

    isRetina: function () {
        return window.devicePixelRatio && window.devicePixelRatio >= 1.5;
    },

    userId2face: function (userId) {
        var len = userId.length,
            str = "0000";
        if (length < 4) {
            userId = str.substring(0, (4 - len)) + userId;
            len = userId.length;
        }
        return "http://i2.hjfile.cn/f48/" + userId.substr(len - 4, 2) + "/" + userId.substr(len - 2, 2) + "/" + userId + ".jpg";
    },

    charlen: function (string) {
        if (!string) return 0;
        return string.replace(/[^\x00-\xff]/g, '00').length;
    },


jQuery.extend({
    highlight: function (node, re, nodeName, className) {
        if (node.nodeType === 3) {
            var match = node.data.match(re);
            if (match) {
                var highlight = document.createElement(nodeName || 'span');
                highlight.className = className || 'highlight';
                var wordNode = node.splitText(match.index);
                wordNode.splitText(match[0].length);
                var wordClone = wordNode.cloneNode(true);
                highlight.appendChild(wordClone);
                wordNode.parentNode.replaceChild(highlight, wordNode);
                return 1; //skip added node in parent
            }
        } else if ((node.nodeType === 1 && node.childNodes) && // only element nodes that have children
                !/(script|style)/i.test(node.tagName) && // ignore script and style nodes
                !(node.tagName === nodeName.toUpperCase() && node.className === className)) { // skip if already highlighted
            for (var i = 0; i < node.childNodes.length; i++) {
                i += jQuery.highlight(node.childNodes[i], re, nodeName, className);
            }
        }
        return 0;
    }
});

jQuery.fn.unhighlight = function (options) {
    var settings = { className: 'highlight', element: 'span' };
    jQuery.extend(settings, options);

    return this.find(settings.element + "." + settings.className).each(function () {
        var parent = this.parentNode;
        parent.replaceChild(this.firstChild, this);
        parent.normalize();
    }).end();
};

jQuery.fn.highlight = function (words, options) {
    var settings = { className: 'highlight', element: 'span', caseSensitive: false, wordsOnly: false };
    jQuery.extend(settings, options);
    
    if (words.constructor === String) {
        words = [words];
    }
    words = jQuery.grep(words, function(word, i){
      return word != '';
    });
    if (words.length == 0) { return this; };

    var flag = settings.caseSensitive ? "" : "i";
    var pattern = "(" + words.join("|") + ")";
    if (settings.wordsOnly) {
        pattern = "\\b" + pattern + "\\b";
    }
    var re = new RegExp(pattern, flag);
    
    return this.each(function () {
        jQuery.highlight(this, re, settings.element, settings.className);
    });
};




isPhone: function (v, split) {
    split = split || ',';
    v = v.split(split);
    for (var i = 0, len = v.length; i < len; i++) {
        if (!/^(0\d{2,3})*-?[1-9]\d{6,7}(-\d{1,8})*$/.test(v[i])) {
            return false;
        }
    }
    return true;
},

isMobile: function (v) {
    return /^1[0-9]{10}$/.test(v);
},


checkAddressForm: function () {
    var recipientName = $('#inboxName').val(),
        address = $('#inboxAddress').val(),
        postcode = $('#inboxCode').val(),
        telephone = $('#inboxTel').val();
        qq = $('#inboxQQ').val();
    if (!/[a-zA-Z\.\s\u4e00-\u9fa5]{1}/.test(recipientName)) {
        $('#inboxName').nextAll('.error').addClass('errorShow').prev().addClass('error-info-tips').show();
        return false;
    }
    if (!fundMall.isPhone(telephone) && !fundMall.isMobile(telephone)) {
        $('#inboxTel').nextAll('.error').addClass('errorShow').prev().addClass('error-info-tips').show();
        return false;
    }
    if (!/^\d{5,10}$/.test(qq)) {
        $('#inboxQQ').nextAll('.error').addClass('errorShow').prev().addClass('error-info-tips').show();
        return false;
    }
    if (address.length < 5) {
        $('#inboxAddress').nextAll('.error').addClass('errorShow').prev().addClass('error-info-tips').show();
        return false;
    }
    if (!/^[0-9]{6}$/.test(postcode)) {
        $('#inboxCode').nextAll('.error').addClass('errorShow').prev().addClass('error-info-tips').show();
        return false;
    }
    return true;
},



messenger.js

jQuery.getScript('path/to/file', function(data, textStatus) {
  //optional stuff to do after getScript
});


//正整数
// /^[0-9]*[1-9][0-9]*$/;
// //负整数
// /^-[0-9]*[1-9][0-9]*$/;
// //正浮点数
// /^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/;
// //负浮点数
// /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/;
// //浮点数
// /^(-?\d+)(\.\d+)?$/;
// //email地址
// /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/;
// //url地址
// /^[a-zA-z]+://(\w+(-\w+)*)(\.(\w+(-\w+)*))*(\?\S*)?$/;
// 或：^http:\/\/[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$ 
// //年/月/日（年-月-日、年.月.日）
// /^(19|20)\d\d[-/.](0[1-9]|1[012])[-/.](0[1-9]|[12][0-9]|3[01])$/;
// //匹配中文字符
// /[\u4e00-\u9fa5]/;
// //匹配帐号是否合法(字母开头，允许5-10字节，允许字母数字下划线)
// /^[a-zA-Z][a-zA-Z0-9_]{4,9}$/;
// //匹配空白行的正则表达式
// /\n\s*\r/;
// //匹配中国邮政编码
// /[1-9]\d{5}(?!\d)/;
// //匹配身份证
// /\d{15}|\d{18}/;
// //匹配国内电话号码
// /(\d{3}-|\d{4}-)?(\d{8}|\d{7})?/;
// //匹配IP地址
// /((2[0-4]\d|25[0-5]|[01]?\d\d?)\.){3}(2[0-4]\d|25[0-5]|[01]?\d\d?)/;
// //匹配首尾空白字符的正则表达式
// /^\s*|\s*$/;
// //匹配HTML标记的正则表达式
// <(\S*?)[^>]*>.*?|<.*?/>;
// //sql 语句
// ^(select|drop|delete|create|update|insert).*$
// //提取信息中的网络链接
// (h|H)(r|R)(e|E)(f|F)*=*('|")?(\w|\\|\/|\.)+('|"|*|>)?
// //提取信息中的邮件地址
// \w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*
// //提取信息中的图片链接
// (s|S)(r|R)(c|C)*=*('|")?(\w|\\|\/|\.)+('|"|*|>)?
// //提取信息中的 IP 地址
// (\d+)\.(\d+)\.(\d+)\.(\d+)
// //取信息中的中国手机号码
// (86)*0*13\d{9}
// //提取信息中的中国邮政编码
// [1-9]{1}(\d+){5}
// //提取信息中的浮点数（即小数）
// (-?\d*)\.?\d+
// //提取信息中的任何数字
// (-?\d*)(\.\d+)?
// //电话区号
// ^0\d{2,3}$
// //腾讯 QQ 号
// ^[1-9]*[1-9][0-9]*$ 
// //帐号（字母开头，允许 5-16 字节，允许字母数字下划线）
// ^[a-zA-Z][a-zA-Z0-9_]{4,15}$ 
// //中文、英文、数字及下划线
// ^[\u4e00-\u9fa5_a-zA-Z0-9]+$



/**
 * Created by chencaihua on 2014/10/30.
 */
;
(function() {
    function removeMenus() {
        $('.m-select').removeClass('m-focus').find('dd').hide();
    };
    var SelectorJS = {
        //地区选择器
        selector: {
            init: function(options) {
                this.select = $(options.id);
                this.data = options.data;
                this.value = options.value;
                this.height = options.height;
                this.width = options.width;
                this.curValue = this.select.find('dt');
                this.list = this.select.find('dd');
                this.input = this.select.find('input');
                this.click = options.click;

                this.height && this.list.css({
                    height: this.height,
                    overflowY: 'auto'
                });
                this.width && this.select.css({
                    width: this.width
                });

                this.create = function() {
                    var listHTML = '',
                        that = this;
                    if (typeof this.data !== 'string') {
                        $.each(this.data, function (index, val) {
                            if(val) {
                                if (val[0] == that.value) {
                                    that.input.val(val[0]);
                                    that.curValue.html(val[1]);
                                }
                                if (val.length > 2) {
                                    if (val[1] == that.value || val[0] == that.value) {
                                        listHTML += '<a class="selected" val="' + val[0] + '" data-type="' + val[2] + '" href="javascript:;">' + val[1] + '</a>';
                                    } else {
                                        listHTML += '<a val="' + val[0] + '" data-type="' + val[2] + '" href="javascript:;">' + val[1] + '</a>';
                                    }
                                } else {
                                    if (val[1] == that.value || val[0] == that.value) {
                                        listHTML += '<a class="selected" val="' + val[0] + '" href="javascript:;">' + val[1] + '</a>';
                                    } else {
                                        listHTML += '<a val="' + val[0] + '" href="javascript:;">' + val[1] + '</a>';
                                    }
                                }
                            }
                        });
                    } else {
                        listHTML = this.data;
                    }
                    this.list.children().not('input').remove();
                    this.list.append(listHTML);
                    if (this.data !== 'string') {
                        //that.input.val(this.value);
                        //that.curValue.html(this.value);
                    }
                },
                    this.events = function() {
                        var that = this;
                        this.list.find('a').bind('click', function(e) {
                            e.stopPropagation();
                            that.input.val($(this).attr('val'));
                            that.curValue.html($(this).text());
                            that.list.hide();
                            that.select.removeClass('m-focus');
                            that.click && that.click.call(this, $(this).attr('val') | 0, $(this).index());
                            $(this).addClass('selected').siblings('a').removeClass('selected');
                        });
                        $(document).unbind('click', removeMenus)
                            .bind('click', removeMenus);
                        this.select.bind('click', function(e) {
                            e.stopPropagation();
                            removeMenus();
                            that.list.show();
                            that.select.addClass('m-focus');
                        });
                    }

                this.create();
                this.events();
            }
        },
        script: function(src, callback, that) {
            var script = document.getElementsByTagName('script'),
                i = 0,
                len = script.length;
            for (; i < len; i++) {
                if (/Selector.js/.test(script[i].src)) {
                    $.getScript(script[i].src.replace('Selector.js', src), function() {
                        callback.call(that, addressCode);
                    });
                    break;
                }
            }
        }
    };
    window.SelectorJS = SelectorJS;
})();



var TT = {

    /*
     * 获取光标位置
     * @Method getCursorPosition
     * @param t element
     * @return number
     */
    getCursorPosition: function (t) {
        if (document.selection) {
            t.focus();
            var ds = document.selection;
            var range = ds.createRange();
            var stored_range = range.duplicate();
            stored_range.moveToElementText(t);
            stored_range.setEndPoint("EndToEnd", range);
            t.selectionStart = stored_range.text.length - range.text.length;
            t.selectionEnd = t.selectionStart + range.text.length;
            return t.selectionStart;
        }
        else return t.selectionStart;
    },

    /*
     * 设置光标位置
     * @Method setCursorPosition
     * @param t element
     * @param p number
     * @return
     */
    setCursorPosition: function (t, p) {
        this.sel(t, p, p);
    },

    /*
     * 插入到光标后面
     * @Method add
     * @param t element
     * @param txt String
     * @return
     */
    add: function (t, txt) {

        var cusrpos = TT.getCursorPosition(t); //获取光标位置

        var val = t.value;
        if (document.selection) {
            t.focus();
            document.selection.createRange().text = txt; //.replace(/\n/g,"");
        }
        else {
            var cp = t.selectionStart;
            var ubbLength = t.value.length;
            var s = t.scrollTop;
            //    document.getElementById('aaa').innerHTML += s + '<br/>';
            t.value = t.value.slice(0, t.selectionStart) + txt + t.value.slice(t.selectionStart, ubbLength);
            //t.value=t.value.replace(/\n/g,"");
            this.setCursorPosition(t, cp + txt.length);
            //    document.getElementById('aaa').innerHTML += t.scrollTop + '<br/>';
            firefox = navigator.userAgent.toLowerCase().match(/firefox\/([\d\.]+)/) && setTimeout(function () {
                if (t.scrollTop != s) t.scrollTop = s;
            }, 0);

            TT.setCursorPosition(t, cusrpos + txt.length);

        };
    },
    /*
     * 删除光标 前面或者后面的 n 个字符
     * @Method del
     * @param t element
     * @param n number n>0 后面 n<0 前面
     * @return
     * 重新设置 value 的时候 scrollTop 的值会被清0
     */
    del: function (t, n) {
        var p = this.getCursorPosition(t);
        var s = t.scrollTop;
        var val = t.value;
        t.value = n > 0 ? val.slice(0, p - n) + val.slice(p) :
            val.slice(0, p) + val.slice(p - n);
        this.setCursorPosition(t, p - (n < 0 ? 0 : n));
        firefox = navigator.userAgent.toLowerCase().match(/firefox\/([\d\.]+)/) && setTimeout(function () {
            if (t.scrollTop != s) t.scrollTop = s;
        }, 10);
    },

    /*
     * 选中 s 到 z 位置的文字
     * @Method sel
     * @param t element
     * @param s number
     * @param z number
     * @return
     */
    sel: function (t, s, z) {
        if (document.selection) {
            var range = t.createTextRange();
            range.moveEnd('character', -t.value.length);
            range.moveEnd('character', z);
            range.moveStart('character', s);
            range.select();
        }
        else {
            t.setSelectionRange(s, z);
            t.focus();
        }
    },


    /*
     * 选中一个字符串
     * @Method sel
     * @param t element
     * @param s String
     * @return
     */
    selString: function (t, s) {
        var index = t.value.indexOf(s);
        index != -1 ? this.sel(t, index, index + s.length) : false;
    }
};


/*密码验证*/
    isPasswd: function (s) {
        /* /^(\w){6,20}$/; */
        var patrn = /^[A-Za-z0-9]{5,20}$/;
        if (!patrn.exec(s)) return false;
        return true;
    },
    isNum:function(s) {
        var patrn = /^[0-9]{1,11}$/;
        if (!patrn.exec(s)) return false;
        return true;
    },
    isEmpty:function(s) {
        if (hjregex.trim(s)!="") {
            return true;
        }
        return false;
    },
    trim:function(str) {
        return str.replace(/(^\s*)|(\s*$)/g, "");
    }



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


        //获取pass环境版本
        GetPassHostVersion: function () {
            var passname = 'pass',
                hostname = location.hostname;

            if (/local|beta|dev|qa|(\w+)2/.test(hostname)) {
                passname = 'pass2';
            } else if (/yz/.test(hostname)) {
                passname = 'yz.pass';
            }

            return passname;
        }

        //获取字符串的字节数
String.prototype.getByteCount = function () {
    return this.replace(/[^\u0000-\u00ff]/g, "12").length;
};

//截取相应字节数的字符串
String.prototype.cutString = function (count) {
    var newstr = this;
    var length = newstr.getByteCount();
    if (length <= count) {
        return newstr;
    }
    while (length > count - 3 && length > 0) {
        newstr = newstr.substring(0, newstr.length - 1);
        length = newstr.getByteCount();
    }
    return newstr + "...";
};

function supportFlash() {
        if (typeof (ActiveXObject) != "undefined") {
            var activeX;
            try { activeX = new ActiveXObject('ShockwaveFlash.ShockwaveFlash'); } catch (ex) { }
            if (activeX) return true;
        }
        if (typeof (navigator.plugins) != "undefined") {
            if (navigator.plugins["Shockwave Flash"]) return true;
        }
        return false;
    }

    function supportAudio() {
        return !!document.createElement('audio').canPlayType;
    }

    function supportVideo() {
        return !!document.createElement('video').canPlayType;
    }

    if (!supportFlash() && supportVideo()) {

        $("embed[src*='http://player.youku.com/player.php/sid/']").each(function () {

            var sid = $(this).attr("src").match(/\/sid\/(\w+)\/v.swf/)[1];

            var video = ' <video  controls="controls" style="width:' + $(this).width() + 'px;height:' + $(this).height() + 'px" src="http://v.youku.com/player/getRealM3U8/vid/' + sid + '/type//video.m3u8"></video>';
            $(this).replaceWith(video);
        });

        $("embed[src*='http://www.tudou.com/v/']").each(function () {
            var sid = $(this).attr("src").match(/www.tudou.com\/v\/(\w+)\//)[1];
            var video = '<iframe style="width:' + $(this).width() + 'px;height:' + $(this).height() + 'px"  frameborder="0" src="http://www.tudou.com/programs/view/html5embed.action?code=' + sid + '"></iframe>';
            $(this).replaceWith(video);
        });
    }

    var UA = navigator.appVersion,
            isIE7 = (UA.search(/MSIE 7/i)!==-1);

            var isIE = !!window.ActiveXObject;
        var isIE6 = isIE && !window.XMLHttpRequest;

        trim: function (str) {
                return str.replace(/(^[ \t\n\r]+)|([ \t\n\r]+$)/g, '');
            },

            //冒泡排序
        function sort(array, compareFn){
            compareFn = compareFn || function(item1, item2){ return item1.localeCompare(item2);};
            for(var i= 0,len = array.length; i<len; i++){
                for(var j = i,length = array.length; j<length; j++){
                    if(compareFn(array[i], array[j]) > 0){
                        var t = array[i];
                        array[i] = array[j];
                        array[j] = t;
                    }
                }
            }
            return array;
        }

        userAgent = navigator.userAgent,
    isOpera = win.opera,
    isIE = /msie/i.test(userAgent) && !isOpera,
    docMode8 = doc.documentMode === 8,
    isWebKit = /AppleWebKit/.test(userAgent),
    isFirefox = /Firefox/.test(userAgent),
    isTouchDevice = /(Mobile|Android|Windows Phone)/.test(userAgent),

/**
 * Based on http://www.php.net/manual/en/function.strftime.php
 * @param {String} format
 * @param {Number} timestamp
 * @param {Boolean} capitalize
 */
dateFormat = function (format, timestamp, capitalize) {
    if (!defined(timestamp) || isNaN(timestamp)) {
        return 'Invalid date';
    }
    format = pick(format, '%Y-%m-%d %H:%M:%S');

    var date = new Date(timestamp),
        key, // used in for constuct below
        // get the basic time values
        hours = date[getHours](),
        day = date[getDay](),
        dayOfMonth = date[getDate](),
        month = date[getMonth](),
        fullYear = date[getFullYear](),
        lang = defaultOptions.lang,
        langWeekdays = lang.weekdays,

        // List all format keys. Custom formats can be added from the outside. 
        replacements = extend({

            // Day
            'a': langWeekdays[day].substr(0, 3), // Short weekday, like 'Mon'
            'A': langWeekdays[day], // Long weekday, like 'Monday'
            'd': pad(dayOfMonth), // Two digit day of the month, 01 to 31
            'e': dayOfMonth, // Day of the month, 1 through 31

            // Week (none implemented)
            //'W': weekNumber(),

            // Month
            'b': lang.shortMonths[month], // Short month, like 'Jan'
            'B': lang.months[month], // Long month, like 'January'
            'm': pad(month + 1), // Two digit month number, 01 through 12

            // Year
            'y': fullYear.toString().substr(2, 2), // Two digits year, like 09 for 2009
            'Y': fullYear, // Four digits year, like 2009

            // Time
            'H': pad(hours), // Two digits hours in 24h format, 00 through 23
            'I': pad((hours % 12) || 12), // Two digits hours in 12h format, 00 through 11
            'l': (hours % 12) || 12, // Hours in 12h format, 1 through 12
            'M': pad(date[getMinutes]()), // Two digits minutes, 00 through 59
            'p': hours < 12 ? 'AM' : 'PM', // Upper case AM or PM
            'P': hours < 12 ? 'am' : 'pm', // Lower case AM or PM
            'S': pad(date.getSeconds()), // Two digits seconds, 00 through  59
            'L': pad(mathRound(timestamp % 1000), 3) // Milliseconds (naming from Ruby)
        }, Highcharts.dateFormats);


    // do the replaces
    for (key in replacements) {
        while (format.indexOf('%' + key) !== -1) { // regex would do it in one line, but this is faster
            format = format.replace('%' + key, typeof replacements[key] === 'function' ? replacements[key](timestamp) : replacements[key]);
        }
    }

    // Optionally capitalize the string and return
    return capitalize ? format.substr(0, 1).toUpperCase() + format.substr(1) : format;
};


/**
 * Pad a string to a given length by adding 0 to the beginning
 * @param {Number} number
 * @param {Number} length
 */
function pad(number, length) {
    // Create an array of the remaining length +1 and join it with 0's
    return new Array((length || 2) + 1 - String(number).length).join(0) + number;
}

//iframe自适应
function iframeAutoFit(iframeObj){ 
    setTimeout(function () {
        if (!iframeObj || iframeObj.length<=0)
            return;
        iframeObj.height = (iframeObj.Document ? iframeObj.Document.body.scrollHeight : iframeObj.contentDocument.body.offsetHeight);
    }, 200)
}

//根据用户名获得头像地址
    function retUserFace(userid) {
        while (userid.toString().length < 4) {
            userid = "0" + userid.toString();
        }
        userid = userid.toString();
        var firstLevel = userid.substr(userid.length - 4, 2);
        var secondLevel = userid.substr(userid.length - 2, 2);

        return "http://i2.hjfile.cn/f48/" + firstLevel + "/" + secondLevel + "/" + userid + ".jpg";
    }

    if (info.rightNewsTags && !/^[a-zA-Z0-9\u4e00-\u9fa5]+([,，][a-zA-Z0-9\u4e00-\u9fa5]+){0,1}$/.test(info.rightNewsTags)) {
        alert("相关标签格式有误");
        txtRightNewsTags.focus();
        return;
    }
    if (info.alias && (!/^[a-zA-Z0-9]{3,15}$/.test(info.alias) && /^[0-9]{3,15}$/.test(info.alias))) {
        alert("URL自定义格式有误");
        txtAlias.focus();
        return;
    }
    if (!/^[a-zA-Z0-9\u4e00-\u9fa5]+$/.test(info.tags)) {
        alert("标签格式有误");
        txtTags.focus();
        return;
    }
    if (!/^[\S ]{1,20}$/.test(info.SpecialSubjectName)) {
        alert("专题名称格式有误");
        txtName.focus();
        return;
    }

    getUserFace: function(uid, psize) {
            var level = uid.toString().substr(-4),
                firstLevel,
                secondLevel;

            firstLevel = level.substr(0, 2);
            secondLevel = level.substr(2);

            return "http://i2.hjfile.cn/f" + psize + "/" + firstLevel + "/" + secondLevel + "/" + uid + ".jpg";
        },

        formatTime: function(time, now) {
            var time2 = time,
                delta,
                oldTime;

            if (time2 === null || time2 === '') return "1分钟前";

            time2 = time2.replace("T", " ").replace(/\-/g, "/");

            time2.indexOf(".") > 0 && (time2 = time2.substring(0, time2.indexOf(".")));
            // nowTime = nowTime.replace("T", " ");
            oldTime = new Date(time2).getTime();

            isNaN(oldTime) && (oldTime = new Date(time).getTime());

            delta = Math.abs(now - oldTime);

            if (oldTime <= 0 || delta < 2) return "1分钟前";

            var strSeconds = parseInt(delta / 1000),
                strMinute = parseInt(delta / 1000 / 60),
                strHour = parseInt(delta / 1000 / 60 / 60),
                strDay = parseInt(delta / 1000 / 60 / 60 / 24);

            // console.log(oldTime, strSeconds, strMinute, strHour, strDay);

            if (strSeconds < 50) {
                return "1分钟前";
            } else if (strMinute < 60) {
                return (strMinute + 1) + "分钟前";
            } else if (strMinute > 60 && strHour <= 24) {
                return strHour + "小时前";
            } else if (strHour > 24 && strDay <= 10) {
                return strDay + "天前";
            } else {
                return time2.split(' ')[0];
            }
        },

        getStrLen: function(str) {
            str = str.replace(/^\s+|\s+$/g, "");
            var len = str.length;
            var width = 0;
            for (var i = 0; i < len; i++) {
                var c = str.charCodeAt(i);
                //单字节加1
                if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
                    width++;
                } else {
                    width += 2;
                }
            }
            return width;
        },

var ua = window.navigator.userAgent.toLowerCase();

isWeixin : /micromessenger/.test(ua)
isAndroid: /android/.test(ua)
isIOS:/iphone|ipad|ipod/.test(ua)
isMeizu: /m[0-9x]{1,3}/.test(ua)
isChrome: /chrome/.test(ua)
isUC : /ucbrowser/.test(ua)
isQQ : /mqqbrowser/.test(ua)
isWP : /windows phone|iemobile/.test(ua)
isBlackBerry : /blackberry/i.test(ua)


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
 * 根据cookie的键值获取cookie的值。
 * @param {string} name cookie键值
 * @return {string}
 */
function getCookie(name) {
    var start = document.cookie.indexOf(name + '=');
    var len = start + name.length + 1;
    if ((!start) && (name != document.cookie.substring(0, name.length))) {
        return undefined;
    }
    if (start == -1) return undefined;
    var end = document.cookie.indexOf(';', len);
    if (end == -1) end = document.cookie.length;
    return decodeURIComponent(document.cookie.substring(len, end));
};

/** 
 * 设置cookie的值。
 * @param {string} name cookie键值
 * @param {string} value  cookie值
 * @param {number} expires  失效时间，以天计
 * @param {string} [path]  设置cookie所在目录
 * @param {string} [domain]  设置cookie所在域
 * @param {string} [secure]  设置https only的cookie
 */
function setCookie(name, value, expires, path, domain, secure) {
    expires = expires || 24 * 60 * 60 * 1000;
    var expires_date = new Date((new Date()).getTime() + (expires));
    document.cookie = name + '=' + encodeURIComponent(value) + ((expires) ? ';expires=' + expires_date.toGMTString() : '') + /*expires.toGMTString()*/
        ((path) ? ';path=' + path : '') + ((domain) ? ';domain=' + domain : '') + ((secure) ? ';secure' : '');
};

/** 
 * 根据cookie的键值移除cookie的值。
 * @param {string} name cookie键值
 * @return {string}
 */
function removeCookie(name, path, domain) {
    if (getCookie(name)) document.cookie = name + '=' + ((path) ? ';path=' + path : '') + ((domain) ? ';domain=' + domain : '') + ';expires=Thu, 01-Jan-1970 00:00:01 GMT';
};

//Cookies.js


loadash
underscore


毫秒设置
var timeCount = function(){
            setTimeout(function(){
                // set the defination time
                var endtime = new Date("2014/6/6 11:56:00");
                var nowtime = new Date();
                //the rest time
                timeold = endtime.getTime() - nowtime.getTime();
                //leftsecond = parseInt(timeold / 1000);
                //a day's millisecond
                var day_ms = 24 * 60 * 60 * 1000;
                _d = timeold/day_ms;
                d = Math.floor(_d)
                _h = (_d - d)*24;
                h = Math.floor(_h);
                _m = (_h - h)*60;
                m = Math.floor(_m);
                _s = (_m - m)*60;
                s = Math.floor(_s);
                if(d<10){d = '0' + d}
                if(h<10){h = '0' + h}
                if(m<10){m = '0' + m}
                if(s<10){s = '0' + s}
                //chang _ms to string
                mm = _s - s
                _ms = new String(_s - s);
                ms = _ms.substr(2,2);
                //d, hour, minute, second,millisecond
                if(timeold <= 0){
                    return
                }
                console.log(timeold,d,_h,m,s,mm,ms);
                timeCount();
                //$('.timecount_d').html(d);
                //$('.timecount_h').html(h);
                //$('.timecount_m').html(m);
                //$('.timecount_s').html(s);
                //$('.timecount_ms').html(ms);
            },1)
        }