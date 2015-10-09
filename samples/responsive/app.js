/**
 * --------------------------------------------------------
 * Copyright (c) 2015 All rights reserved.
 * @version: 1.0.0
 * @author: roeis
 * @description: 
 * --------------------------------------------------------
 */
(function() {
    'use strict';

    console.log('app start');

    
    var standardRatio = 1.5;

    var core = {
        init: function() {
            this.setSize();
            this.bind();
        },

        setSize: function() {
            var size = this.getSize();

            $('.m_cont').css({
                width: size.width,
                height: size.height,
                left: size.left,
                top: size.top,
                position: 'absolute'
            });
        },

        getSize: function() {
            var winHeight = document.documentElement.clientHeight || window.innerHeight,
                winWidth = document.documentElement.clientWidth || window.innerWidth,
                ratio = winHeight / winWidth,
                width, height, left, top;

            if (ratio > standardRatio) {
                width = winWidth;
                height = width * standardRatio;
                top = (winHeight - height) / 2;
                left = 0;
            } else {
                height = winHeight;
                width = height / standardRatio;
                left = (winWidth - width) / 2;
                top = 0;
            }

            return {
                width: width,
                height: height,
                top: top,
                left: left
            };
        },

        bind: function() {
            var self = this;
            $(window).on('resize', function() {
                self.setSize();
            });
        }
    };

    core.init();

    $(function() {
        var slider = new MuSlider('.wrapper', {
            // isVer// isLoop: true,
            // autoSlide: true,
            isVert: true,
            // isLoop: true,
            // timing: 'cubic-bezier(.61,.07,.05,.87)',
            beforeSlide: function($nextPage, $prevPage) {},
            afterSlide: function($nextPage, $prevPage, index) {}
        });
    });
})();