'use strict';
(function (window, angular) {
angular.module('timerModule', [])
    .controller('TimerCtrl', ['$scope', '$stateParams', 'timerService', 'modelService', 'applicationState',
        function ($scope, $stateParams, timerService, modelService, applicationState) {
        $scope.workListItems = modelService.getWorkListItems();
        $scope.activeWorkItem = modelService.getTaskItemById(applicationState.activeItemId);

        $scope.startWorkOnItem = function(item){
            $scope.activeWorkItem = item;
            applicationState.activeItemId = item.id;
        };
        $scope.backLogTask = function(item){
            modelService.removeFromWorkList(item.id);
            $scope.workListItems = modelService.getWorkListItems();
        };
        timerService.onPomoCompleted = function(){
            $scope.showComplete = true;
        };
        $scope.model = timerService.model;
        var colorArray = ['#ffb600', '#000', '#428bca', '#000'];
        $scope.colorFunction = function () {
            return function (d, i) {
                return colorArray[i];
            };
        }
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
        $scope.abandonTimer =  function(){
            $scope.showComplete = false;
            timerService.abandon();
        };
        $scope.completePomo = function(){
            timerService.model.completed++;
            timerService.abandon();
            $scope.showComplete = false;
            $scope.activeWorkItem.completed = $scope.activeWorkItem.completed || 0;
            $scope.activeWorkItem.completed ++;
        };
    }]);
})(window, window.angular);