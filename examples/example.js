'use strict';
var fs = require('fs');

var  easyav = require('../lib/');
var stream = fs.createReadStream('./files/test-file.txt');
easyav.scan(stream, function(err, isValid, message){
  if(err){
    return console.log(err);
  }

  console.log('Done ', isValid, message);
});
