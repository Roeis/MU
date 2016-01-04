/**
 * Copyright (c) 2015 All rights reserved
 * author: roeis
 */
(function(global){
    'use strict';
    var core = {
        test : function(){
            console.log('ad');
        },
        test2: function(){
            console.log('test2');
        }
    };

    function Demo(){
        this.msg = 'sd';
    }


    if(global.mu){
        global.mu.registry('test', core);
    }

})(this);