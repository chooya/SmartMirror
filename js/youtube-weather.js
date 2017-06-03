(function() {
    'use strict';

    function YoutubeWeatherService($http) {
        var service = {};
        service.youtube = null;
        var relatedPlayuploads ="";
            var videoId="";

        var getuploadurl = config.youtube.url + config.youtube.channeltype;
        var playlisturl = config.youtube.url + config.youtube.playlisttype;

        var param = config.youtube.channel_id + "&key=" + config.youtube.key;
        getuploadurl = getuploadurl + param;
        // console.log(getuploadurl);
        //https://www.youtube.com/user/weatheron1 기상청 유투부 내철
        //https://developers.google.com/youtube/v3/docs/channels/list?hl=ko
        //part에 contentDetails ,forUsername 에 채널ID를 작성하여 보면 rquest url이 나옴.

        service.getYoutubeUploadID = function() {
          return $http.jsonp(getuploadurl, { params : {
              callback: 'JSON_CALLBACK'
            }}).then(function(response) {
                relatedPlayuploads = response.data.items["0"].contentDetails.relatedPlaylists.uploads;
               // console.log(relatedPlayuploads);
                return relatedPlayuploads;
            });
        }
        //loads 키를 받아  playlist 구하는 url에 포함. "UUCW7N13hV53wZ3ufTFtkmhA"
        service.init = function() {
            playlisturl = playlisturl + relatedPlayuploads  + "&key=" + config.youtube.key;

            return $http.jsonp(playlisturl, { params : {
                callback: 'JSON_CALLBACK'
              }}).then(function(response) {
               // console.log(playlisturl);
                return service.youtube = response.data;
            });
        };

        service.getVideoId = function() {
            if (service.youtube === null) {
                return null;
            }
            if (service.youtube.items.length > 0) {
                videoId = service.youtube.items["0"].snippet.resourceId.videoId;
                //console.log(videoId);
                return videoId;
            }
        };

        return service;
    }

    angular.module('SmartMirror')
        .factory('YoutubeWeatherService', YoutubeWeatherService);

}());
