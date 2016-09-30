// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'ngCordova', 'ionic.cloud'])

.run(function ($rootScope, $ionicPlatform, $ionicHistory, $ionicPopup, $ionicDeploy, $interval, $timeout, $cordovaToast) {
  $ionicPlatform.ready(function () {


    // alert("1");
    // $ionicDeploy.channel = 'production';
    // alert($ionicDeploy.getSnapshots()).promisse;
    // console.log($ionicDeploy.getSnapshots());
  
  
    // $ionicDeploy.check().then(function (snapshotAvailable) {
    //   alert("check");
    //   if (snapshotAvailable) {


    //     // When snapshotAvailable is true, you can apply the snapshot
    //     $ionicDeploy.download().then(function () {
    //       alert("down");
    //       $ionicDeploy.extract().then(function () {
    //         alert("extract");
    //         $ionicPopup.show({
    //           title: 'Update available',
    //           subTitle: 'An update was just downloaded. Would you like to restart your app to use the latest features?',
    //           buttons: [
    //             {
    //               text: 'Not now'
    //           },
    //             {
    //               text: 'Restart',
    //               onTap: function (e) {
    //                 alert("load");
    //                 $ionicDeploy.load();
    //               }
    //           }]
    //         });
    //       })

    //     });
    //   }
    // });



      //polling for an update every 30 second
      var snapshotInterval = $interval(function () {
        $ionicDeploy.check().then(function (snapshotAvailable) {
            // alert("check");
          console.log('checking for update ', snapshotAvailable);
          if (snapshotAvailable) {
            $interval.cancel(snapshotInterval);
            // console.log('downloading update');
            $ionicDeploy.download().then(function () {
              // console.log('extracting udate');
              $ionicDeploy.extract().then(function () {
                // console.log('loading update');
                // $ionicDeploy.load();

                $ionicPopup.show({
                  title: 'Atualização Disponível',
                  subTitle: 'Uma nova atualização está disponível, deseja atualizar para a última versão?',
                  buttons: [
                    {text: 'Agora não'},
                    {
                      text: 'Reiniciar',
                      onTap: function (e) {
                        $ionicDeploy.load();
                      }
                    }
                  ]
                });

              });
            });
          }
        });
      }, 30000);




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
  // });

  // $ionicPlatform.registerBackButtonAction(function (e) {
  //   if ($rootScope.backButtonPressedOnceToExit) {
  //     ionic.Platform.exitApp();
  //   }
  //   // else if ($ionicHistory.backView) {
  //   //   $ionicHistory.goBack();
  //   // }
  //   else {
  //     $rootScope.backButtonPressedOnceToExit = true;
  //     window.plugins.toast.showShortCenter(
  //       "Pressione voltar novamente para sair",
  //       function (a) {},
  //       function (b) {}
  //     );
  //     setTimeout(function () {
  //       $rootScope.backButtonPressedOnceToExit = false;
  //     }, 2000);
  //   }
  //   e.preventDefault();
  //   return false;
  // }, 101);


   $ionicPlatform.registerBackButtonAction(function(e) {
     if ($rootScope.backButtonPressedOnceToExit) {
        navigator.app.exitApp(); // or // ionic.Platform.exitApp(); both work
    // } else if ($ionicHistory.backView()) {
    //     $ionicHistory.goBack();
     } else {
        $rootScope.backButtonPressedOnceToExit = true;
          $cordovaToast.show('Pressione novamente para sair.', 'long', 'bottom');                
        $timeout(function() {
            $rootScope.backButtonPressedOnceToExit = false;
        }, 2000); // reset if user doesn't press back within 2 seconds, to fire exit
    }
    e.preventDefault();
    return false;
  }, 101);


 });

  // alert("run");
  // var deploy = new Ionic.Deploy();
  // deploy.watch().then(function () {}, function () {}, function (updateAvailable) {
  //         alert("watch");
  //   if (updateAvailable) {
  //     alert("updateAvailable");
  //     deploy.download().then(function () {
  //             alert("download");

  //       deploy.extract().then(function () {
  //               alert("extract");

  //         deploy.unwatch();
  //         $ionicPopup.show({
  //           title: 'Update available',
  //           subTitle: 'An update was just downloaded. Would you like to restart your app to use the latest features?',
  //           buttons: [
  //             {
  //               text: 'Not now'
  //             },
  //             {
  //               text: 'Restart',
  //               onTap: function (e) {
  //                 deploy.load();
  //               }
  //             }]
  //         });
  //       });
  //     });
  //   }
  // });



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

.config(function ($stateProvider, $urlRouterProvider, $ionicCloudProvider) {

  $ionicCloudProvider.init({
    "core": {
      "app_id": "8f959310"
    }
  });


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