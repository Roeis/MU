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
        opacity: 0.8,                           // 背景透明度
        hard: false,                            // 生硬动画
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
    var count = 0;
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

            this.$wrapper = $('<div id="muDialog-'+count+'"></div>');

            count ++;
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

            this.$wrapper.append(this.$bg).append(this.$dialog);
            $body.append(this.$wrapper);

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
            
            //solve orientchange issue, it recalculate its size when screen changes
            //solve orientchange in chrome between others browsers
            //change orientchange event to resize
            $(window).on('resize', function(){
                self._adjust();
            });
        },

        _bindBG: function(){
            var self = this;
            if (self.options.isBgCloseable) {
                self.$bg.on('tap.bg', function(event) {
                    self.close();
                    event.stopPropagation();
                });
            }
        },

        _unbindBG: function(){
            var self = this;
            if (self.options.isBgCloseable) {
                self.$bg.off('tap.bg');
            }
        },

        html: function(html){
            this.$dialog.html(html);
            this._adjust();
        },

        open: function() {
            if (this.isOpen) return;
            this.isOpen = true;
            this.options.beforeOpen.call(this);

            this._show(this.$dialog, this.options.showClass, $.proxy(function() {
                this.options.afterOpen.call(this);
                this._bindBG();
                window.mu.util.preventScroll();
            }, this));
            this._show(this.$bg, 'mu-fadeIn');
        },

        close: function() {
            if (!this.isOpen) return;

            this.options.beforeClose.call(this);

            this._hide(this.$dialog, this.options.hideClass, $.proxy(function() {
                this.options.afterClose.call(this);
                this._unbindBG();
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

            if(needAdaptDevices || this.options.hard){
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
            if(needAdaptDevices || this.options.hard){
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

    var dialog = new window.MuDialog('<div class="mu-pop"></div>', {
        zIndex: 9999,
        isBgCloseable: false,
        opacity: 0.6,
        preset: 'fadeInDown'
    });
    /**
     * tip
     * @param  {[type]} string  
     * @param  {[type]} timeout 
     * @return {[type]}         
     */
    mu.util.tip = function(string, timeout){
        var html = '<div class="mu-pop-title">提示</div><div class="mu-pop-content">' + string + '</div>';
        
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
        
        dialog.html(html);
        dialog.open();
        $(document).on('tap', '.mu-btn-ok', function(){
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
        
        dialog.html(html);
        dialog.open();
        $('.mu-btn').on('tap', function(){
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