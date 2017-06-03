(function(angular) {
    'use strict';

    angular.module('SmartMirror', ['ngAnimate']).config(['$httpProvider', function ($httpProvider) {
      delete $httpProvider.defaults.headers.common['X-Requested-With'];;
      $httpProvider.defaults.useXDomain = true;
    }]);

    //   }
}(window.angular));
