var express = require('express');
var path = require('path');
var os = require('os');
var app = express();
//var cors = require('cors');
var moment = require('moment');
var http = require('https');
var url = require('url');
var fs = require('fs');
var config = require('./config/exportconfig.js');
//static폴더 : static폴더로 지정되면 허가 없이도 접근
// 지정하지 않으면 /js/xxxx.js  등이  src 디렉토리를 인식이 안됨.\
app.use(express.static(path.join(__dirname, '/')));

app.get('/', function (req, res, next) {
  res.sendFile(path.join(__dirname+'/index.html'));
});

app.get('/ip', function (req, res) {
  var interfaces = os.networkInterfaces();
  var addresses = [];
  for (var k in interfaces) {
      for (var k2 in interfaces[k]) {
          var address = interfaces[k][k2];
          if (address.family === 'IPv4' && !address.internal) {
              addresses.push(address.address);
          }
      }
  }
  res.json(addresses);
});

// 버스정보 가져오기
app.get('/getplaylist', function(req, res) {
  // URL 생성 : 공공데이타 5.4. 버스도착정보조회 서비스 호출
  var _param = '?' + encodeURIComponent('ServiceKey') + '=' + config.bus.key; /* Service Key*/
      _param += '&' + encodeURIComponent('arsId') + '=' + encodeURIComponent(config.stid); /* */
  var url = config.bus.url + _param;
  //url생성 버스위치정보조회 서비스
  if (url) {
    http.get(url, function(web) {
      web.on('data', function(buffer) {
        res.write(buffer);
      });
      web.on('end', function() {
        res.end();
      });
    });
  } else {
    res.send('url error');
  };

});
// 일정가져오기
app.get('/getcalendar', function(req, res) {
  var url = config.calendar.icals;

  if (url) {
    http.get(url, function(web) {
      web.on('data', function(buffer) {
        res.write(buffer);
      });
      web.on('end', function() {
        res.end();
      });
    });
  } else {
    res.send('url error');
  };

});


app.listen(3000, function () {
  console.log('Server Start...Port 3000');
});
