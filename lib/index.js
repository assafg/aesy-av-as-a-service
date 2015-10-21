'use strict';
var clamav = require('clamav.js');
var path = require('path');
var express = require('express');

module.exports = (function EasyAV() {
  var app = express();

  app.use(express.static(path.join( __dirname,'..', 'public')));

  var server = app.listen(3000, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
  });
  var io = require('socket.io')(server);
  var ss = require('socket.io-stream');


  io.of('/scan').on('connection', function(socket) {
    ss(socket).on('file-to-scan', function(stream, data) {
      var filename = path.basename(data.name);
      scan(stream, function(err, isValid, message){
        if(err){
          return console.log(err);
        }
        console.log(filename);
        console.log(isValid, message || '');
        socket.emit('result', {isValid: isValid, message: message});
      });
    });
  });

  io.on('connection', function(socket) {
    console.log('socket connected: ', socket.id);

  });

  clamav.ping(3310, 'clamserver', 1000, function(err) {
    if (err) {
      console.log('AV service is not available[' + err + ']');
    } else {
      console.log('AV service is alive ');
    }
  });

  function scan(stream, callback) {
    clamav.createScanner(3310, 'clamserver')
      .scan(stream, function(err, object, malicious) {
        if (err) {
          console.error(object.path + ': ' + err);
          return callback(err);
        } else if (malicious) {
          console.log(object.path + ': ' + malicious + ' FOUND');
          return callback(null, false, object.path + ': ' + malicious + ' FOUND');
        } else {
          console.log(object.path + ': OK');
          return callback(null, true);
        }
      });
  }

  return {
    scan: scan,
    server: server
  };
})();
