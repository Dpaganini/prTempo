angular.module('starter.select', ['ionic'])
.controller('selectCityModalCtrl',
    function($rootScope, $ionicModal, $scope,  $http) {

      // POPOVER SEARCH MENU
      $scope.items = {};

      $http.get('js/cidades.json').
      success(function(data, status, headers, config) {
        $scope.items = data.data;
         $scope.automatico = {
            cidadeId: 'auto',
            text: 'Localização Automática'
        }
        $scope.items.unshift($scope.automatico);
      }).
      error(function(data, status, headers, config) {
      // log error
    });

      $rootScope.openSelectModal = function() {

                 // MODAL UI PARAMETROS

                 $ionicModal.fromTemplateUrl('templates/selectCityModal.html', {
                     id: 'modal-select-search',
                     scope: $scope,
                     backdropClickToClose: false,
                     animation: 'slide-in-up',
                 }).then(function(modal) {
                     $scope.selectModal = modal;
                     $scope.selectModal.show();
                 });

             };

             // FUNCOES UI MODAL

             $scope.closeModal = function() {
                 $scope.selectModal.hide();
             };

      // FUNCOES MANIPULAÇÃO DE DADOS

      $scope.clickItem = function(item) {
        console.log(item);
        $rootScope.trocaCidade(item.cidadeId, item.text);
        $scope.closeModal();
      };

    }
    );