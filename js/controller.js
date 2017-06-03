(function() {

    function focusCtrl(
        busService,
        YoutubeService,
        GeolocationService,
        CalendarService,
        WeatherService,
        YoutubeWeatherService,
        PlayService,
        // IPService,
        $scope, $interval, $sce) {


        var functionService = functionServices;
        var _init = this;

        functionService.defaultHome($scope);

        function getTime() {
            $scope.time = moment().format('h:mm a');
            $scope.date = moment().format('YYYY-MM-DD  /  dddd');
            $interval(getTime, 1000);
        }
        getTime();

        function getCurrentWeather() {
            WeatherService.init().then(function() {
                $scope.currentForecast = WeatherService.currentForecast();
            });
            WeatherService.weekforcast_init().then(function() {
                $scope.weeklyForecast = WeatherService.weeklyForecast();
            })
            $interval(getCurrentWeather, 300000);
        }
        getCurrentWeather();

        function getCalendar() {
            CalendarService.getCalendarEvents().then(function(response) {
                $scope.calendar = CalendarService.getFutureEvents();
            }, function(error) {
                console.log(error);
            });
            $interval(getCalendar, 300000);
        }
        getCalendar();

        function busEvents() {
            busService.init().then(function() {
                $scope.buslist = busService.getBusList();
                $scope.stNm = busService.stationName();
                $scope.arrivelist = busService.arriveBuslist();
            })
            functionService.busView($scope);
        };

        var playYoutubeWeather = function() {
            var videoId = "";
            YoutubeWeatherService.getYoutubeUploadID().then(function() {
                YoutubeWeatherService.init().then(function() {
                    videoId = YoutubeWeatherService.getVideoId();
                    $scope.focus = "youtubeweaher_show";
                    // $scope.youtubeweaterurl = "http://www.youtube.com/embed/" + videoId + "?autoplay=1&enablejsapi=1&version=3&playerapiid=ytplayer"
                    var tempurl = "http://www.youtube.com/embed/" + videoId + "?autoplay=1"
                    // console.log(tempurl);
                    $scope.playWeatherUrl = $sce.trustAsResourceUrl(tempurl);
                })
            })
        };
        var playMusic = function() {
            PlayService.init().then(function() {
                var r = Math.floor((Math.random() * PlayService.play.songs.length));
                //console.log(r);
                $scope.musictitle = PlayService.play.songs[r].title;
                $scope.musicurl = $sce.trustAsResourceUrl(PlayService.play.songs[r].url);
                // console.log($scope.musicurl);
                $scope.focus = "music_show";
            })

            // $scope.music.play();
        }


        //음성인식 annyang 실행
        annyang.addCommands(commands);
        //  한글언어 셋팅
        annyang.setLanguage("ko");
        annyang.debug();
        // Start listening.
        // annyang.start();
         annyang.start({
             autoRestart: true,
             continuous: false
         });
        //   }

        /* debug 체크를 위한  button으로 service가 제대로 작동되는지 체크 */

        $scope.whoIsMirror = function() {
            functionService._init($scope);
            functionService.whoIsMirror($scope);
        }
        $scope.goSleep = function() {
            functionService._init($scope);
            functionService.goSleep($scope);
        }
        $scope.wakeup = function() {
            functionService._init($scope);
            functionService.wakeup($scope);
        }
        $scope.defaultHome = function() {
            functionService._init($scope);
            functionService.defaultHome($scope);
        }
        $scope.menuShow = function() {
            functionService._init($scope);
            functionService.menuShow($scope);
        }
        $scope.busInfo = function() {
            functionService._init($scope);
            busEvents();
        }
        $scope.weatherInfo = function() {
            functionService._init($scope);
            playYoutubeWeather();
        }
        $scope.playInfo = function() {
            functionService._init($scope);
            playMusic();
        }
        $scope.ipInfo = function() {
            functionService._init($scope);
            $scope.ipaddress = IPService.init();
            $scope.focus = "ip";
        }
        $scope.SayTime = function() {
          var dateTime = new Date();
          textToSpeech('현재시간은' + dateTime.getHours() +'시' + dateTime.getMinutes()+'분 입니다.');
        }

    }
    angular.module('SmartMirror')
        .controller('focusCtrl', focusCtrl);
}());
