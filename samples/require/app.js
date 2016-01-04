/**
 * Copyright (c) 2015 All rights reserved
 * author: roeis
 * description: 
 */
(function(){
    'use strict';

    mu.require('https://assets-cdn.github.com/assets/github2-692b0b1ba861c5b4055d33b157feb7f5b35ce646135cd0db80ce5d0b2293500d.css');

    mu.require('http://m.hujiang.com/js/vendor/js.cookie.js', function(core){
        mu.require('test.js', function(core){
            // var test = new core();
            console.log(core, this);

            mu.require('test.js', function(core){
                console.log(core);
            })
        });
    });

    mu.require(['test.js', ''], function(a, b){
        
    })
    
})();