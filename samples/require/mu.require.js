/**
 * --------------------------------------------------------
 * Copyright (c) 2015 All rights reserved.
 * @version: 1.0.0
 * @author: roeis
 * @description: simple require module
 * --------------------------------------------------------
 */

(function(){
    'use strict';

    var head = document.getElementsByTagName('head');
    head = head.length ? head[0] : document.documentElement;

    // requirement states
    var REQUESTED = 1,
        LOADED    = 2,
        EXECUTED  = 3,
        COMPLETE  = 4;

    var core = {
        modules: {},
        requests: {},
        _loadLink: function(url){
            var node = document.createElement('link');

            node.type = 'text/css';
            node.rel = 'stylesheet';
            node.href = url;

            head.appendChild(node);
        },
        _loadScript: function(url, callback){
            var node = document.createElement('script');

            node.async = 'true';
            node.src = url;

            var module = url.match(/([^ \/]*)\.js/);
            var self = this;
            
            if(self.requests[url].loaded){
                console.log(self.requests[url].loaded)
                if(callback && module && module.length > 0){
                    callback.call(self, self.modules[module[1]]);
                }
            }else{
                node.onload = node.onreadystatechange = function () {
                    if (!self.requests[url].loaded && (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete')) {
                        self.requests[url].loaded = true;
                        if(callback && module && module.length > 0){
                            // console.log(module[1], 'the module name');
                            callback.call(self, self.modules[module[1]]);
                        }
                        node.onload = node.onreadystatechange = null;
                    }
                };

                // node onerror 
                node.onerror = function(){
                    console.log('failed load module', module[1]);
                    // head.removeChild(node);
                };
                
                
                head.appendChild(node);
            }
            // 加载完毕后执行
        },
        registryModule: function(url){
            if(!this.requests[url]){
                this.requests[url] = {
                    url: url,
                    status: 0,
                    loaded: false
                };
            }
        },
        require: function(url, callback){
            if(/\.css$/i.test(url)){
                this._loadLink(url);
            }
            if(/\.js$/i.test(url)){
                this.registryModule(url);
                this._loadScript(url, callback);
            }
        },
        registry: function(name, obj){
            var module = {};
            if(!this.modules[name]){
                module[name] = obj;
                mu.util.extend(this.modules, module);
            }else{
                console.log('module registry repeated');
            }
        }
    };

    // 需要处理异步脚本时
    mu.require = function(url, callback){
        core.require(url, callback);
    };
    mu.registry = function(name, obj){
        core.registry(name, obj);
    };

})();