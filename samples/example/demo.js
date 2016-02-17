/**
 * Copyright (c) 2015 All rights reserved
 * author: roeis
 * description: 
 */
// (function(){
    'use strict';
    
    $(document).on('click','a', function(event){
        event.preventDefault();
        console.log(this);
        
        location.href = this.href;
    });

// })();