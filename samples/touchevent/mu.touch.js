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

    var $log = $('#log');

    function log(string) {
        $log.prepend('<p>log: ' + string + '</p>');
    }

    function cancelLongTap() {
        if (longTapTimeout) clearTimeout(longTapTimeout);
        longTapTimeout = null;
    }

    var events = {
        start: function(event) {

            var touches = event.originalEvent || event,
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
                log('global:longTap');
            }, 700);
        },

        move: function(event) {
            var touches = event.originalEvent || event,
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
            
            console.log('#time : ', duration);
            console.log('#delta : ', delta);
            cancelLongTap();


            if (!isScrolling && isHorizontal) {
                $elem.trigger(isSwipeLeft ? 'swipeLeft' : 'swipeRight');
                log(isSwipeLeft ? 'global:swipeLeft' : 'global:swipeRight');
            }else if(isScrolling && isVertical){
                $elem.trigger(isSwipeUp ? 'swipeUp' : 'swipeDown');
                log(isSwipeUp ? 'global:swipeUp' : 'global:swipeDown');
            }

            var tapFlag = Math.abs(delta.x) < 5 && Math.abs(delta.y) < 5 && duration < 300;
            tapTimeout = setTimeout(function(){
                tapTimeout = null;
                if(tapFlag) {
                    var evt = $.Event('tap');

                    // evt.cancelTouch = function(){
                    //     if (tapTimeout) clearTimeout(tapTimeout);
                    //     if (longTapTimeout) clearTimeout(longTapTimeout);
                    // };
                    
                    $elem.trigger(evt);
                    
                    log('global:tap');
                }
            }, 0);
            // event.cancelBubble=true;
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