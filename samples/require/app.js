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
    

    var core = {
        loadCSS: function(){

        },
        loadJS: function(){

        },

    }



    function Mure(){}

    var mure = new Mure();

    var requests = {};

    // requirement states
    var REQUESTED = 1,
        LOADED    = 2,
        EXECUTED  = 3,
        COMPLETE  = 4;

    function setRequire(url){
        return requests[url] = {
            url: url,
            status: 0
        }
    }

    //isCSS = /\.css$/i,
    //isJS = /\.js$/i

    // registry module to mu.require

    var head = document.getElementsByTagName('head');

    head = head.length ? head[0] : document.documentElement;

    mure.registry = function(name, obj){
        var module = {};
        module[name] = obj;
        mu.util.extend(this, module);
    };


    // save status, status show

    // require module's url, 
    // callback this.module's export 
    // 

    mure.require = function(url, callback){
        var node = document.createElement('script'),
            self = this,
            done = false;

        node.async = 'true';
        node.src = url;

        var module = url.match(/([^ \/]*)\.js/);

        // 加载完毕后执行
        node.onload = node.onreadystatechange = function () {

            if (!done && (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete')) {
                done = true;
                if(callback && module && module.length > 0){
                    console.log(module[1], 'the module name');
                    callback.call(self, self[module[1]]);
                }
                node.onload = node.onreadystatechange = null;
            }
        };

        // node onerror 
        node.onerror = function(){
            console.log('failed load module', module[1]);
            // head.removeChild(node);
        }

        head.appendChild(node);
    };

    window.mure = mure;

    function loadCSS(url){
        var node = document.createElement('link');

        node.type = 'text/css';
        node.rel = 'stylesheet';
        node.href = url;

        head.appendChild(node);
    }
    
    // mu.require('.js, .css'), 异步加载
    //
    //
    //

    mure.require('http://m.hujiang.com/js/vendor/js.cookie.js', function(core){
        mure.require('test.js', function(core){
            // var test = new core();
            console.log(core);
        });
        console.log(core, 'the module required');
    });


})();