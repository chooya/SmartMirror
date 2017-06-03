(function() {
    'use strict';
    /*
    {"_id":1835848,"name":"Seoul","country":"KR","coord":{"lon":126.977829,"lat":37.56826}}
     */
    function WeatherService($http) {
        var service = {};
        service.forcast = null;
        service.weekforcast = null;
        var geoloc = null;

        var codes = weatherCodes;
        var icons = iconTable;

        service.init = function() {
          var params = "?";
          var url = config.weather.url;
            params += "lat=" + "37.56826" + "&lon=" + "126.977829";
            params += "&units=" + config.weather.units;
            params += "&lang=" + config.weather.lang;
            params += "&APPID=" + config.weather.key;
            url = url + config.weather.currentType + params
            // console.log(url);

            return $http.jsonp(url, { params : {
                callback: 'JSON_CALLBACK'
              }}).success(function(response) {
                    // console.log(response);
                    return service.forcast = response;
                });

        }; //init close

        service.weekforcast_init = function() {
          var params = "?";
          var url = config.weather.url;
            params += "lat=" + "37.56826" + "&lon=" + "126.977829";
            params += "&units=" + config.weather.units;
            params += "&lang=" + config.weather.lang;
            params += "&APPID=" + config.weather.key;
            url = url + config.weather.forcastType + params
            // console.log(url);

            return $http.jsonp(url, { params : {
                callback: 'JSON_CALLBACK'
              }}).success(function(weekresponse) {
                    // console.log(weekresponse);
                    return service.weekforcast = weekresponse;
                });

        }; //init close

        service.currentForecast = function() {
           service.forcast.main.temp = parseFloat(service.forcast.main.temp).toFixed(1);
           service.forcast.weather["0"].icon = "icon dimmed " + icons[service.forcast.weather["0"].icon];
           service.forcast.weather["0"].id = codes[service.forcast.weather["0"].id];
           service.forcast.sys.message = service.forcast.weather["0"].icon ;

           return service.forcast;
        };

        service.weeklyForecast = function() {
           for (var i = 0; i< service.weekforcast.cnt; i++) {
             var day = moment.unix(service.weekforcast.list[i].dt).format('dddd');
             service.weekforcast.list[i].temp.max = parseFloat(service.weekforcast.list[i].temp.max).toFixed(1);
             service.weekforcast.list[i].temp.min = parseFloat(service.weekforcast.list[i].temp.min).toFixed(1);
             service.weekforcast.list[i].temp.day = day;
             service.weekforcast.list[i].weather[0].description = codes[service.weekforcast.list[i].weather[0].id];
             service.weekforcast.list[i].weather[0].icon = icons[service.weekforcast.list[i].weather[0].icon];
           };
           return service.weekforcast;
        };


        return service;
    }
    angular.module('SmartMirror')
        .factory('WeatherService', WeatherService);

}());
