(function() {
    'use strict';

    function PlayService($http) {
        var service = {};
        service.play = null;

        service.init = function() {
          var url = config.playsong.url;
            return $http.get(url).success(function(response) {
                    //console.log(response);
                    return service.play = response;
                });

        }; //init close

        return service;
    }
    angular.module('SmartMirror')
        .factory('PlayService', PlayService);

}());
