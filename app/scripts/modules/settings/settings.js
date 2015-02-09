'use strict';
(function (window, angular) {
  angular.module('settingsModule', [])
    .controller('SettingsCtrl', ['$rootScope', '$scope', 'osShell', 'modelService', '_', function ($rootScope, $scope, osShell, modelService, _) {
      $scope.model = modelService.settings;
      $scope.$watch('model.strict', function (newVal, oldVal) {
        if (newVal !== oldVal) {
          _.extend(modelService.settings, {breakLength: 5, pomoLength: 25, longBreakLength: 15});
          modelService.reload();
        }
      });
      $scope.allTags = modelService.getTags();
    }]);
})(window, window.angular);
