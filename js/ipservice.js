(function() {
    'use strict';

    function IPService($http) {
        var service = {};
        service.ip = null;

        service.init = function() {
            return $http.get("/ip").success(function(response) {
                // console.log(response);
                return service.ip = response;
            });

        }; //init close

        return service;
    }

    angular.module('SmartMirror')
        .factory('IPService', IPService);

}());
