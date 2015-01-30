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
        $localStorage.workList = $localStorage.workList || [];
        $localStorage.totalCompleted = $localStorage.totalCompleted || [];
        $localStorage.settings = $localStorage.settings || {
          strict: true,
          pomoLength: 25,
          breakLength: 5,
          cloudEnabled: true
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
         * @name workList
         * @propertyOf pomodary.entities.modelService
         */
        workList: $localStorage.workList,
        /**
         * @ngdoc property
         * @name settings
         * @propertyOf pomodary.entities.modelService
         */
        settings: $localStorage.settings,
        /**
         * @ngdoc property
         * @name totalCompleted
         * @propertyOf pomodary.entities.modelService
         */
        totalCompleted: $localStorage.totalCompleted,
        /**
         * @ngdoc method
         * @name getWorkListItems
         * @methodOf pomodary.entities.modelService
         * @returns {Array} list of items currently slated to be worked
         */
        getWorkListItems: function () {
          var toReturn = [];
          angular.forEach(modelService.workList, function (item) {
            toReturn.push(_.findWhere(modelService.taskList, {id: item}))
          });
          return toReturn;
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
        },
        /**
         * @ngdoc method
         * @name removeFromWorkList
         * @params id Id of the task to remove from the worklist
         * @methodOf pomodary.entities.modelService
         * @returns {task} removes task from worklist and returns it
         */
        removeFromWorkList: function (id) {
          var workIndex = modelService.workList.indexOf(id);
          return modelService.workList.splice(workIndex, 1)[0];
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
    .service('timerService', ['moment', '$interval', 'modelService',
      function (moment, $interval, modelService) {
        var timer;
        var breakTime = modelService.settings.breakLength;
        var taskTime = 25;
        var getTimerDisplayData = function () {
          var toSet = [];
          if(toReturn.model){
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
            toReturn.model.timerState = "STARTED";
            timer = $interval(function () {
              if (toReturn.model.current > 0) {
                toReturn.model.current.subtract(1, 's');
                toReturn.model.timerDisplay = getTimerDisplayData();
              } else if (toReturn.model.break > 0) {
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
        var setupModel = function () {
          toReturn.model = {
            timerState: null,
            current: moment.duration(taskTime, 'm'),
            break: moment.duration(breakTime, 'm'),
            task: [],
            timerDisplay : getTimerDisplayData(),
            totalCompleted: modelService.totalCompleted
          };
        };
        var toReturn = {
          setPomoLength: function (pomoLength) {
            if(taskTime !== pomoLength){
              taskTime = pomoLength;
              setupModel();
            }
          },
          model : null,
          activeItemId: null,
          toggle: toggle,
          abandon: abandonTimer
        };
        setupModel();
        return toReturn;
      }])
})(window, window.angular);
