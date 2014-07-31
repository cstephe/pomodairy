'use strict';
(function (window, angular) {
    angular.module('core.entities', [])
        .factory("uuid", [function () {
        return {
            newuuid: function () {
                // http://www.ietf.org/rfc/rfc4122.txt
                var s = [];
                var hexDigits = "0123456789abcdef";
                for (var i = 0; i < 36; i++) {
                    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
                }
                s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
                s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
                s[8] = s[13] = s[18] = s[23] = "-";
                return s.join("");
            }
        }
    }])
        .service('modelService', ['$localStorage', function ($localStorage) {
            $localStorage.taskList = $localStorage.taskList || [];
            $localStorage.workList = $localStorage.workList || [];
            var modelService = {
                taskList: $localStorage.taskList,
                workList: $localStorage.workList,
                getWorkListItems: function () {
                    var toReturn = [];
                    angular.forEach(modelService.workList, function (item) {
                        toReturn.push(_.findWhere(modelService.taskList, {id: item}))
                    });
                    return toReturn;
                },
                getTaskItemById: function (id) {
                    return _.findWhere(modelService.taskList, {id: id});
                },
                removeFromWorkList : function(id){
                    var workIndex = modelService.workList.indexOf(id);
                    modelService.workList.splice(workIndex, 1);
                }
            };
            return modelService;
        }])
        .service('timerService', ['moment', '$interval', function (moment, $interval) {
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
                            if (toReturn.model.break.asMilliseconds() === moment.duration(breakTime, 'm').asMilliseconds()) {
                                var snd = new Howl({
                                    urls: ["/sounds/bell1.mp3"]
                                }).play();
                            }
                            toReturn.model.break.subtract(1, 's');
                            toReturn.model.timerDisplay = getTimerDisplayData();
                        } else {
                            toReturn.model.timerState = null;
                            if (toReturn.onPomoCompleted) {
                                toReturn.onPomoCompleted();
                            }
                        }
                    }, 1000);
                } else {
                    toReturn.model.timerState = "PAUSED";
                    $interval.cancel(timer);
                    timer = null;
                }
            };
            var abandonTimer = function () {
                toReturn.model.timerState = "PAUSED";
                $interval.cancel(timer);
                timer = null;
                toReturn.model.current = moment.duration(taskTime, 'm');
                toReturn.model.break = moment.duration(breakTime, 'm');
                toReturn.model.timerDisplay = getTimerDisplayData();
            };
            var toReturn = {
                model: {
                    timerState: null,
                    current: moment.duration(taskTime, 'm'),
                    break: moment.duration(breakTime, 'm'),
                    task: [],
                    completed: 0,
                    timerDisplay: {}
                },
                activeItemId: null,
                toggle: toggle,
                abandon: abandonTimer
            };
            toReturn.model.timerDisplay = getTimerDisplayData();
            return toReturn;
        }])
        .service('applicationState', [function () {
            var appState = {
                activeItem: null
            };
            return appState;
        }]);
})(window, window.angular);