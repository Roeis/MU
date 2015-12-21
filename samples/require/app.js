/**
 * --------------------------------------------------------
 * Copyright (c) 2015 All rights reserved.
 * @version: 1.0.0
 * @author: roeis
 * @description: 
 * --------------------------------------------------------
 */
(function(){
    'use strict';
    
    // // demonstrate an example here, commonjs
    // var slideTip = require('slideTip');

    // slideTip.doSomething({
    //     test: 'test'
    // });

    // slideTip.doSomethingB();

    // // or amd
    // require('slideTip', function(slide){

    //     slide.doSomething();

    // });
    // 
    
    function Mure(){}

    var mure = new Mure();

    mure.registry = function(name,obj){
        var module = {};
        module[name] = obj;
        mu.util.extend(this, module);
    };
    mure.require = function(url, callback){
        var node = document.createElement('script'),
            head = document.getElementsByTagName('head'),
            self = this,
            done = false;

        node.async = 'true';
        node.src = url;

        head = head.length ? head[0] : document.documentElement;

        // 加载完毕后执行
        node.onload = node.onreadystatechange = function () {
            if (!done && (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete')) {
                done = true;
                try {
                    //基本事件统计
                    // pgvMain();
                    //上报performance
                    // sendPerformance();
                    console.log('test');
                    callback.call(self, self['test']);

                } catch (err) {
                    console.log(err);
                }
                node.onload = node.onreadystatechange = null;
            }
        };

        head.appendChild(node);
    };

    window.mure = mure;

    mure.require('test.js', function(core){
        console.log(core);
    });


})();