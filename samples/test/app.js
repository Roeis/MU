/**
 * Copyright (C) 2016 Roei - All rights reserved.
 * if has any issue, contact <roeichow@gmail.com>
 */

'use strict';

function fetchLink(
    link, callback) {
    if (!/^http(s?):\//.test(link)) {
        return;
    }
    var xhr = new XMLHttpRequest();
    xhr.open('HEAD', link, true);
    xhr.onreadystatechange = function() {
        // if (xhr.readyState === 4) {
        //
        // }
        // xhr.processed = true;
        // xhr.abort();
        callback(xhr);
    }
    try {
      xhr.send(null);
    } catch (e) {
      console.error('XHR failed for ' + link + ', ' + e);
    }
    // xhr.send(null);
}

var link = 'http://www.baidu.com/';
fetchLink(link, function(response){
    console.log(response);
});

// function urlExists(url, callback) {
//   var xhr = new XMLHttpRequest();
//   xhr.onreadystatechange = function() {
//     if (xhr.readyState === 4) {
//       callback(xhr.status < 400);
//     }
//   };
//   xhr.open('HEAD', url);
//   xhr.send();
// }
//
// urlExists(link, function(exists) {
//     console.log('"%s" exists?', link, exists);
// });

// $.ajax({
//     type: 'GET',
//     cache: false,
//     url: link,
//     contentType: "application/json; charset=utf-8",
//     success: function() {
//         console.log('success');
//     },
//     error: function() {
//         console.log('error');
//     }
// });
