'use strict';
(function (window, angular) {
  angular.module('core.controllers', [])
    .controller('navController', ['$scope', '$state', '$stateParams', 'modelService', 'osShell',
      function ($scope, $state, $stateParams, modelService, osShell) {
        switch ($state.current.name) {
          case 'app.today':
            $scope.selectedItemIndex = 0;
            break;
          case 'app.tasks':
            $scope.selectedItemIndex = 1;
            break;
          case 'app.settings':
            $scope.selectedItemIndex = 2;
            break;
        }
        $scope.next = function () {
          $scope.selectedIndex = Math.min($scope.data.selectedIndex + 1, 2);
        };
        $scope.previous = function () {
          $scope.selectedIndex = Math.max($scope.data.selectedIndex - 1, 0);
        };
        $scope.settings = modelService.settings;
        $scope.state = $state;
        $scope.model = modelService;
      }
    ])
})(window, window.angular);
