'use strict';
(function (window, angular) {
  /**
   * @ngdoc overview
   * @name pomodary.entities
   */
  angular.module('pomodary.entities', [])
  /**
   * @ngdoc service
   * @name pomodary.entities.modelService
   * @requires $localStorage
   * @description Provides access to application level pomodary model objects
   */
    .service('modelService', ['$localStorage', function ($localStorage) {
      var load = function () {
        $localStorage.taskList = $localStorage.taskList || [];
        $localStorage.settings = $localStorage.settings || {
          strict: true,
          pomoLength: 25,
          breakLength: 5,
          longBreakLength: 15,
          cloudEnabled: true,
          showTag : ""
        };
      };
      load();
      var modelService = {
        /**
         * @ngdoc method
         * @name reload
         * @methodOf pomodary.entities.modelService
         */
        reload: load,
        /**
         * @ngdoc property
         * @name taskList
         * @propertyOf pomodary.entities.modelService
         */
        taskList: $localStorage.taskList,
        /**
         * @ngdoc property
         * @name settings
         * @propertyOf pomodary.entities.modelService
         */
        settings: $localStorage.settings,
        /**
         * @ngdoc method
         * @name getWorkListItems
         * @methodOf pomodary.entities.modelService
         * @returns {Array} list of items currently slated to be worked
         */
        getTags:function(){
          var rawTags = modelService.taskList
            .map(function(item){
              return item.tags ?
                item.tags.split(",") : [];
            });
          return _.unique(_.flatten(rawTags)
            .map(function(item){
              return item && item.trim()
            }));
        },
        clearTasks : function(){
          $localStorage.taskList = [];
        },
        /**
         * @ngdoc method
         * @name getTaskItemById
         * @params id Id of the task to get
         * @methodOf pomodary.entities.modelService
         * @returns {task} retrieves a task by task id
         */
        getTaskItemById: function (id) {
          return _.findWhere(modelService.taskList, {id: id});
        }
      };
      return modelService;
    }])
  /**
   * @ngdoc service
   * @name pomodary.entities.timerService
   * @requires moment
   * @requires $interval
   * @requires modelService
   * @description The timer service provides a global timer object and model
   */
    .factory('taskUtils', ['_', 'modelService', function(_, modelService) {
      return{
        timeLeft : function (tasks) {
          var pomos = _.reduce(tasks, function (memo, item) {
            return memo + ((+item.pomos || 0) - ((item.completed && item.completed.length) || 0));
          }, 0);
          var worktime = pomos * modelService.settings.pomoLength;
          var breaktime = (pomos / 4) * 30;
          return moment.duration(worktime + breaktime, 'm').humanize();
        }
      }
    }])
    .filter('workItems', [function(){
      return function(list) {
        var toReturn = _.filter(list, function(item){
          return item.inWorkList
        });
        return toReturn;
      };
    }])
    .filter('openItems', [function(){
      return function(list, ignore){
        if(ignore){
          return list;
        }
        return _.filter(list, function(item){
          return !item.completedAt;
        });
      };
    }])
    .filter('taggedItems', ['modelService', function(modelService){
      return function(list){
        var value = modelService.settings.showTag;
        if(!value){
          return list;
        }
        return _.filter(list, function(item){
          if(item.tags){
            return _.contains(item.tags.split(',')
              .map(function(item){
                return item && item.trim();
              }), value);
          }
          return false;
        });
      };
    }])
    .service('timerService', ['moment', '$interval', 'modelService', 'osShell', function (moment, $interval, modelService, osShell) {
      var timer;
      var breakTime = modelService.settings.breakLength || 5;
      var taskTime = 25;
      var getTimerDisplayData = function () {
        var toSet = [];
        if (toReturn.model) {
          toSet = [
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
        }
        return toSet;
      };
      var toggle = function () {
        if (!timer) {
          startTimer();
        } else {
          abandonTimer();
        }
      };
      var startTimer = function () {
        var sessionEnded = false;
        toReturn.model.timerState = "STARTED";
        toReturn.model.timeStart = moment();
        //set this in case in changed
        taskTime = modelService.settings.pomoLength;
        timer = $interval(function () {
          var toSubtract = moment() - toReturn.model.timeStart;
          if (toReturn.model.current > 0) {
            toReturn.model.current = moment.duration(taskTime, 'm')
              .subtract(toSubtract, 'ms');
            toReturn.model.timerDisplay = getTimerDisplayData();
          } else if (toReturn.model.break > 0) {
            toReturn.model.break = moment.duration(breakTime + taskTime, 'm')
              .subtract(toSubtract, 'ms');
            toReturn.model.timerDisplay = getTimerDisplayData();
            if (!sessionEnded) {
              osShell.playSound("sounds/bell1.mp3");
              navigator.vibrate && navigator.vibrate([500, 500, 1000]);
              osShell.notifyIfInactive({title: 'Work time over', message: "Go do something else"});
              sessionEnded = true;
            }
          } else {
            $interval.cancel(timer);
            if (toReturn.onPomoCompleted) {
              toReturn.onPomoCompleted();
            }
            toReturn.model.timerState = null;
            navigator.vibrate && navigator.vibrate([500, 500, 1000]);
            osShell.notifyIfInactive({title: 'Break over', message: "Get back to work"});
          }
        }, 500);
      };
      var abandonTimer = function () {
        toReturn.model.timerState = "PAUSED";
        $interval.cancel(timer);
        timer = null;
        //set this in case in changed
        taskTime = modelService.settings.pomoLength;
        toReturn.model.current = moment.duration(taskTime, 'm');
        toReturn.model.break = moment.duration(breakTime, 'm');
        toReturn.model.timerDisplay = getTimerDisplayData();
      };
      var setupModel = function () {
        toReturn.model = {
          timerState: null,
          current: moment.duration(taskTime, 'm'),
          break: moment.duration(breakTime, 'm'),
          task: [],
          totalCompleted: modelService.totalCompleted
        };
        toReturn.model.timerDisplay = getTimerDisplayData();
      };
      var toReturn = {
        checkSettingForUpdate: function () {
          if (taskTime !== modelService.settings.pomoLength || breakTime !== modelService.settings.breakLength) {
            taskTime = modelService.settings.pomoLength;
            breakTime = modelService.settings.breakLength;
            setupModel();
            abandonTimer();
            return true;
          }
          return false;
        },
        model: null,
        activeItemId: null,
        toggle: toggle,
        abandon: abandonTimer
      };
      setupModel();
      return toReturn;
    }])
})(window, window.angular);
