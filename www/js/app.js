// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'ionic.service.core', 'starter.controllers', 'ngCordova'])

.run(function ($ionicPlatform) {
      $ionicPlatform.ready(function () {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
          cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
          cordova.plugins.Keyboard.disableScroll(true);

        }
        if (window.StatusBar) {
          // org.apache.cordova.statusbar required
          StatusBar.styleLightContent();
        }
      });

 $ionicPlatform.onHardwareBackButton(function(){
             
                 //Exit app
                 ionic.Platform.exitApp();
             });
//iniciu

      // var posOptions = {
      //   timeout: 10000,
      //   enableHighAccuracy: false
      // };
      
      // $cordovaGeolocation
      //   .getCurrentPosition(posOptions)
      //   .then(function (position) {
      //     var lat = position.coords.latitude
      //     var long = position.coords.longitude


      //   }, function (err) {
      //     // error
      //   });

      // var buscaCidadeJson = function () {
      //   $http.get("http://nominatim.openstreetmap.org/reverse?lat=" + lat + "&lon=" + long + "&format=json&json_callback=my_callback").success(function (data) {
      //     console.log(data)
      //   })};

//fimn

      })

    .config(function ($stateProvider, $urlRouterProvider) {

      // Ionic uses AngularUI Router which uses the concept of states
      // Learn more here: https://github.com/angular-ui/ui-router
      // Set up the various states which the app can be in.
      // Each state's controller can be found in controllers.js
      $stateProvider

      // setup an abstract state for the tabs directive
        .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'templates/tabs.html'
      })

      // Each tab has its own nav history stack:

      .state('tab.previsao', {
        url: '/previsao',
        views: {
          'tab-previsao': {
            templateUrl: 'templates/tab-previsao.html',
            controller: 'PrevisaoCtrl'
          }
        }
      })

      .state('tab.agora', {
        url: '/agora',
        views: {
          'tab-agora': {
            templateUrl: 'templates/tab-agora.html',
            controller: 'AgoraCtrl'
          }
        }
      })

      .state('tab.radar', {
        url: '/radar',
        views: {
          'tab-radar': {
            templateUrl: 'templates/tab-radar.html',
            controller: 'RadarCtrl'
          }
        }
      })


      .state('tab.satelite', {
        url: '/satelite',
        views: {
          'tab-satelite': {
            templateUrl: 'templates/tab-satelite.html',
            controller: 'SateliteCtrl'
          }
        }
      });

      // if none of the above states are matched, use this as the fallback
      $urlRouterProvider.otherwise('/tab/previsao');

    });