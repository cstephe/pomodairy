'use strict';
(function (window, angular) {
  angular.module('timerModule', [])
    .controller('TimerCtrl', ['$scope', '$stateParams', 'osShell', '$filter', 'timerService', 'taskUtils', 'modelService', 'applicationState', 'moment', '_',
      function ($scope, $stateParams, osShell, $filter, timerService, taskUtils, modelService, applicationState, moment, _) {
        $scope.taskList = modelService.taskList;
        $scope.activeWorkItem = modelService.getTaskItemById(applicationState.activeItemId);
        $scope.timer = timerService;
        $scope.timeLeft = function(){
          var workItems = $filter('workItems')($scope.taskList);
          return taskUtils.timeLeft(workItems);
        };
        $scope.completedToday = function () {
          var toReturn = 0;
          var today = moment().startOf('day');
          var times = _.flatten(_.pluck($scope.taskList, 'completed'));
          times.forEach(function(time){
            if (time && moment(time).isAfter(today)) {
              toReturn++;
            }
          });
          return toReturn;
        };
        $scope.worklistOrder = function (object) {
          if ($scope.activeWorkItem && object.id == $scope.activeWorkItem.id) {
            return -1;
          } else {
            return object.name;
          }
        }
        $scope.startWorkOnItem = function (event, item) {
          console.log(event);
          if($scope.activeWorkItem && item.id == $scope.activeWorkItem.id){
            osShell.confirm(event, "Confirm Complete",
              "Finished with the task?")
              .then(function () {
                $scope.activeWorkItem = applicationState.activeItemId = null;
                item.inWorkList = false;
                item.completedAt = (new Date()).valueOf();
              });
          }else{
            $scope.activeWorkItem = item;
            applicationState.activeItemId = item.id;
          }
        };
        $scope.showComplete = false;
        timerService.onPomoCompleted = function () {
          $scope.showComplete = true;
        };
        var colorArray = ['#ffb600', '#000', '#428bca', '#000'];
        $scope.colorFunction = function () {
          return function (d, i) {
            return colorArray[i];
          };
        };
        $scope.xFunction = function () {
          return function (d) {
            return d.key;
          };
        };
        $scope.yFunction = function () {
          return function (d) {
            return d.y;
          };
        };
        $scope.toggleTimer = timerService.toggle;
        $scope.abandonTimer = function () {
          $scope.showComplete = false;
          timerService.abandon();
        };
        $scope.completePomo = function () {
          $scope.showComplete = false;
          $scope.activeWorkItem.completed = $scope.activeWorkItem.completed || [];
          $scope.activeWorkItem.completed.push((new Date).valueOf());
        };
      }])
    .controller('workItemActionsController', ['$scope', 'workItem', 'modelService', '$mdBottomSheet',
      function ($scope, workItem, modelService, $mdBottomSheet) {
        $scope.workItem = workItem;
        $scope.backLogTask = function (item) {
          modelService.removeFromWorkList(item.id);
          $mdBottomSheet.hide({action: "backlog", item: item});
        }
      }
    ]);
})(window, window.angular);
