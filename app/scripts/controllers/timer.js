'use strict';

/**
 * @ngdoc function
 * @name pomodairyApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the pomodairyApp
 */
angular.module('pomodairyApp')
    .service('timerService', function (moment, $interval) {
        var timer;
        var breakTime = .1;
        var taskTime = .3;
        var getTimerDisplayData = function () {
            return [
                {
                    key: "Break",
                    y: toReturn.model.break.asMilliseconds() || 0
                },
                {
                    key: "BreakPassed",
                    y: moment.duration(breakTime, 'm').subtract(toReturn.model.break).asMilliseconds() || 0
                },
                {
                    key: "Remaining",
                    y: toReturn.model.current.asMilliseconds() || 0
                },
                {
                    key: "Passed",
                    y: moment.duration(taskTime, 'm').subtract(toReturn.model.current).asMilliseconds() || 0
                }
            ]
        };
        var toggle = function () {
            if (!timer) {
                toReturn.model.timerState = "STARTED"
                timer = $interval(function () {
                    if (toReturn.model.current != 0) {
                        toReturn.model.current.subtract(1, 's');
                        toReturn.model.timerDisplay = getTimerDisplayData();
                    } else if (toReturn.model.break != 0) {
                        if(toReturn.model.break.asMilliseconds() === moment.duration(breakTime, 'm').asMilliseconds()){
                            var snd = new Audio("/sounds/bell1.mp3"); // buffers automatically when created
                            snd.play();
                        }
                        toReturn.model.break.subtract(1, 's');
                        toReturn.model.timerDisplay = getTimerDisplayData();
                    } else {
                        toReturn.model.timerState = null;
                        abandonTimer();
                        toReturn.model.completed = toReturn.model.completed + 1;
                    }
                }, 1000);
            } else {
                toReturn.model.timerState = "PAUSED";
                $interval.cancel(timer);
                timer = null;
            }
        };
        var abandonTimer = function () {
            $interval.cancel(timer);
            timer = null;
            toReturn.model.current = moment.duration(taskTime, 'm');
            toReturn.model.break = moment.duration(breakTime, 'm');
            toReturn.model.timerDisplay = getTimerDisplayData();
        };
        var toReturn = {
            model: {
                timerState : null,
                current: moment.duration(taskTime, 'm'),
                break: moment.duration(breakTime, 'm'),
                task: [],
                completed: 0,
                timerDisplay : {}
            },
            toggle : toggle,
            abandon : abandonTimer
        };
        toReturn.model.timerDisplay = getTimerDisplayData();
        return toReturn;
    })
    .controller('TimerCtrl', function ($scope, $stateParams, timerService) {
        console.log($stateParams)
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
        $scope.abandonTimer =  timerService.abandon;
    });
