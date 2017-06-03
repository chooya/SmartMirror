var messageCommand = messageCommands;

var functionServices = {
    defaultHome: function($scope) {
        textToSpeech(messageCommand.defaultSpeech);
        $scope.focus = "default";
        $scope.defaulttitle = messageCommand.title;
        $scope.developer = messageCommand.developer;
    },
    wakeup: function($scope) {
        textToSpeech(messageCommand.defaultSpeech);
        $scope.focus = "default";
        $scope.defaulttitle = messageCommand.title;
        $scope.developer = messageCommand.developer;
    },
    goSleep: function($scope) {
        textToSpeech(messageCommand.goSleepSpeech);
        $scope.focus = "sleep";
    },
    whoIsMirror: function($scope) {
        textToSpeech(messageCommand.whois);
        $scope.focus = "whoissmartmirror";
        $scope.titlewhois = messageCommand.title;
        $scope.whoareyou = messageCommand.whois;
    },
    menuShow: function($scope) {
        textToSpeech(messageCommand.menuSpeech);
        $scope.focus = "menu";

    },
    busView: function($scope) {
        textToSpeech(messageCommand.busViewSpeech); //
        $scope.focus = "bus";
    },
    _init: function($scope) {
        $scope.playWeatherUrl = "";
        $scope.musicurl = "";
    }

};

var functionService = functionServices;
var commands = {
    '*term 누구니': function() {
        functionService._init($scope);
        functionService.whoIsMirror($scope);
    },
    '잘자': function() {
        functionService._init($scope);
        functionService.goSleep($scope);
    },
    '자비스': function() {
        functionService._init($scope);
        functionService.wakeup($scope);
    },
    '홈으로 (이동)': function() {
        functionService._init($scope);
        functionService.defaultHome($scope);
    },
    '명령어 (보여 줘)': function() {
        functionService._init($scope);
        functionService.menuShow($scope);
    },
    '버스 (정보)(정류장)': function() {
        functionService._init($scope);
        busEvents();
    },
    '(오늘) 날씨 (어때)(보여 줘)': function() {
        functionService._init($scope);
        playYoutubeWeather();
    },
    '음악 (틀어 줘)(플레이)(플래이)': function() {
        functionService._init($scope);
        playMusic();
    },
    '아이피 (주소)(보여 줘)': function() {
        functionService._init($scope);
        IPService.init().then(function() {
            $scope.ipaddress = IPService.ip;
            $scope.focus = "ip";
        });

    },
    '*term 동영상 (재생)(켜 줘)(플레이)(틀어 줘)(보여 줘)': function(term) {
        functionService._init($scope);
        YoutubeService.getYoutube(term, 'video').then(function() {
            if (term) {
                var videoId = YoutubeService.getVideoId();
                $scope.focus = "youtube_show";
                $scope.youtubeurl = "http://www.youtube.com/embed/" + videoId + "?autoplay=1&enablejsapi=1&version=3&playerapiid=ytplayer"
                $scope.currentYoutubeUrl = $sce.trustAsResourceUrl($scope.youtubeurl);
            }
        })
    }
};


function textToSpeech(text) {
    // console.log('textToSpeech', arguments);
    // annyang.abort();
    // responsiveVoice.speak(text, "Korean Female",{
    //     onend: function () {
    //        annyang.start();
    //     }
    // });

    annyang.abort();
    var speech = new SpeechSynthesisUtterance(text);
    speech.lang = 'ko_KR';
    speechSynthesis.speak(speech);
    // speechSynthesis.speak(new SpeechSynthesisUtterance(text));
     annyang.start();
};
