var express = require('express');
var app = express();
var fs = require('fs');
var mm = require('musicmetadata');

app.listen(7777, function() {
  console.log("[NodeJS] Application Listening on Port 7777");
});

app.get('/play/:key', function(req, res) {
  var key = req.params.key;

  var music = 'music/' + key + '.mp3';

  var stat = fs.statSync(music);
  range = req.headers.range;
  //console.log(range);

  var readStream;

  if (range !== undefined) {
    var parts = range.replace(/bytes=/, "").split("-");

    var partial_start = parts[0];
    var partial_end = parts[1];

    if ((isNaN(partial_start) && partial_start.length > 1) || (isNaN(partial_end) && partial_end.length > 1)) {
      return res.sendStatus(500); //ERR_INCOMPLETE_CHUNKED_ENCODING
    }

    var start = parseInt(partial_start, 10);
    var end = partial_end ? parseInt(partial_end, 10) : stat.size - 1;
    var content_length = (end - start) + 1;

    res.status(206).header({
      'Content-Type': 'audio/mpeg',
      'Content-Length': content_length,
      'Content-Range': "bytes " + start + "-" + end + "/" + stat.size
    });

    readStream = fs.createReadStream(music, {
      start: start,
      end: end
    });
  } else {
    res.header({
      'Content-Type': 'audio/mpeg',
      'Content-Length': stat.size
    });
    readStream = fs.createReadStream(music);
  }
  readStream.pipe(res);
});

/*  playlists.json 생성
      // mp3 파일 태그중 제목을 읽기위해서는 한글 깨짐 해결 ( console에서 진행 )
      // 패키지 설치 : sudo apt-get install python-mutagen
      // mp3을 모두 cp949로 변경 : find . -iname "*.mp3" -execdir mid3iconv -e cp949 {} \;
      // 그럼 소스에서 musicmetadata 로 create a new parser from a node ReadStream
	  //
*/
var path = './music/';
var fileNames = [];
var musicUrl = 'http://chooya01.iptime.org:7777/play/';
var musicTitile;
var JsonPlayLitFile = 'playlist.json';

var playlist = {
  songs: []
};

fs.readdir(path, function(err, files) {
  if (err) throw err;

  files.forEach(function(file) {

    // create a new parser from a node ReadStream
    // 한글 깨짐 해결
    // 패키지 설치 : sudo apt-get install python-mutagen
    // mp3을 모두 cp949로 변경 : find . -iname "*.mp3" -execdir mid3iconv -e cp949 {} \;

    var parser = mm(fs.createReadStream(path + file), function(err, metadata) {
      if (err) throw err;
      // playlist json 형태 제작
      file = file.substring(0, file.indexOf('.'));
      playlist.songs.push({
        'title': metadata.artist + " - " + metadata.title,
        'url': musicUrl + file
      });
      fs.writeFile(JsonPlayLitFile, JSON.stringify(playlist), 'utf8', function(err) {
        if (err) throw err;
      });
      console.log(metadata);
    });
  });
});
