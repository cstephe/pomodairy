'use strict';

/**
 * @ngdoc function
 * @name pomodairyApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the pomodairyApp
 */
angular.module('pomodairyApp')
    .service('timerService', function () {

    })
    .controller('TimerCtrl', function ($scope, $interval, $stateParams, moment, timerService) {
        var timer;
        var breakTime = 0.5;
        var taskTime = 1;
        console.log($stateParams)
        $scope.model = {
            current: moment.duration(taskTime, 'm'),
            break: moment.duration(breakTime, 'm'),
            task: [],
            completed: 0
        };

        var getTimerDisplayData = function () {
            return [
                {
                    key: "Break",
                    y: $scope.model.break.asMilliseconds() || 0
                },
                {
                    key: "BreakPassed",
                    y: moment.duration(breakTime, 'm').subtract($scope.model.break).asMilliseconds() || 0
                },
                {
                    key: "Remaining",
                    y: $scope.model.current.asMilliseconds() || 0
                },
                {
                    key: "Passed",
                    y: moment.duration(taskTime, 'm').subtract($scope.model.current).asMilliseconds() || 0
                }
            ]
        };

        var colorArray = ['#ffb600', '#000', '#428bca', '#000'];
        $scope.colorFunction = function () {
            return function (d, i) {
                return colorArray[i];
            };
        }
        $scope.timerDisplay = getTimerDisplayData();

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
        $scope.toggleTimer = function () {
            if (!timer) {
                $scope.timerState = "STARTED"
                timer = $interval(function () {
                    if ($scope.model.current != 0) {
                        $scope.model.current.subtract(1, 's');
                        $scope.timerDisplay = getTimerDisplayData();
                    } else if ($scope.model.break != 0) {
                        $scope.model.break.subtract(1, 's');
                        $scope.timerDisplay = getTimerDisplayData();
                    } else {
                        alert('done mother fucker');
                        $scope.timerState = null;
                        $scope.abandonTimer();
                        $scope.model.completed = $scope.model.completed + 1;
                    }
                }, 1000);
            } else {
                $scope.timerState = "PAUSED";
                $interval.cancel(timer);
                timer = null;
            }
        };
        $scope.abandonTimer = function () {
            $interval.cancel(timer);
            timer = null;
            $scope.model.current = moment.duration(taskTime, 'm');
            $scope.model.break = moment.duration(breakTime, 'm');
            $scope.timerDisplay = getTimerDisplayData();
        };
        $scope.$on('$destroy', function () {
            $interval.cancel(timer);
            timer = null;
        });
    });
