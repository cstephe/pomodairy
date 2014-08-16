'use strict';
(function (window, angular) {
    angular.module('timerModule', [])
        .controller('TimerCtrl', ['$scope', '$stateParams', 'timerService', 'modelService', 'applicationState', 'moment', '_',
            function ($scope, $stateParams, timerService, modelService, applicationState, moment, _) {
                $scope.workListItems = modelService.getWorkListItems();
                $scope.activeWorkItem = modelService.getTaskItemById(applicationState.activeItemId);
                $scope.model = timerService.model;
                $scope.timeLeft = function(){
                    var pomos = _.reduce($scope.workListItems, function(memo, item){
                        return memo + ((+item.pomos || 0) - (+item.completed || 0));
                    }, 0);
                    var worktime = pomos * 25;
                    var breaktime = (pomos/4) * 30;
                    return moment.duration(worktime + breaktime, 'm').humanize();
                };
                $scope.completedToday = function () {
                    var toReturn = 0;
                    var today = moment().startOf('day');
                    var times = _.pluck($scope.model.totalCompleted, 'completedAt');
                    for (var x = times.length - 1; x >= 0; x--) {
                        if (moment(times[x]).isAfter(today)) {
                            toReturn++;
                        } else {
                            x = 0;
                            console.log("stopping");
                        }
                    }
                    return toReturn;
                };
                $scope.worklistOrder = function(object){
                    if($scope.activeWorkItem && object.id==$scope.activeWorkItem.id){
                        object.active=true;
                        return -1;
                    }else{
                        object.active=false;
                        return object.name;
                    }
                }
                $scope.startWorkOnItem = function (item) {
                    $scope.activeWorkItem = item;
                    applicationState.activeItemId = item.id;
                };
                $scope.backLogTask = function (item) {
                    modelService.removeFromWorkList(item.id);
                    $scope.workListItems = modelService.getWorkListItems();
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
                $scope.abandonTimer = function () {
                    $scope.showComplete = false;
                    timerService.abandon();
                };
                $scope.completePomo = function () {
                    var completedPomo = {
                        taskId: $scope.activeWorkItem && $scope.activeWorkItem.id,
                        completedAt: new Date()
                    };
                    timerService.model.totalCompleted.push(completedPomo);
                    timerService.abandon();
                    $scope.showComplete = false;
                    if($scope.activeWorkItem){
                        $scope.activeWorkItem.completed = $scope.activeWorkItem.completed || 0;
                        $scope.activeWorkItem.completed++;
                    }
                };
            }]);
})(window, window.angular);