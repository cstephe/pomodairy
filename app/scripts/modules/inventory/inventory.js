'use strict';
(function (window, angular) {
  angular.module('taskListModule', [])
    .controller('taskDataController', ['$scope', 'uuid',
      function ($scope, uuid) {
        $scope.$watch('model.newTask', function (newVal, oldVal) {
          if(newVal !== oldVal){
            $scope.isEdit = $scope.model.newTask;
            $scope.newTask = angular.copy(newVal) || {
              name: "",
              description: "",
              pomos: 1
            };
            $scope.newTaskForm.$setPristine();
          }
        });
        $scope.closeDialog = function () {
          $scope.model.openNewTask = false;
        };
        $scope.addTask = function () {
          if ($scope.newTask.id) {
            var orgTask = _.findWhere($scope.model.taskList, {id: $scope.newTask.id});
            angular.copy($scope.newTask, orgTask);
          } else {
            $scope.newTask.id = uuid.newuuid();
            $scope.model.taskList.push($scope.newTask);
          }
          $scope.model.openNewTask = false;
        };
      }
    ])
    .controller('InventoryCtrl', ['$scope', '_', 'modelService', 'taskUtils', 'osShell', '$filter',
      function ($scope, _, modelService, taskUtils, osShell, $filter) {
        $scope.model = {
          taskList: modelService.taskList,
          openNewTask: false,
          newTask: {}
        };
        $scope.timeLeft = function () {
          //var workItems = $filter('workItems')($scope.model.taskList);
          //return taskUtils.timeLeft(workItems);
        };
        $scope.openNewTask = false;
        $scope.showTaskEdit = function (ev, task) {
          $scope.model.openNewTask = true;
          $scope.model.newTask = task || {pomos:1};
          $scope.editBox = {title: "Edit Task", button: "Done"};
        };
        $scope.taskOrder = function (item) {
          if (item.inWorkList) {
            return item.name;
          } else {
            return item.name;
          }
        };
        $scope.workTask = function (task, toSet) {
          if (toSet) {
            task.workAddedDate = new moment();
          } else {
            task.workAddedDate = null;
          }
        };
        $scope.removeTask = function (event, task) {
          osShell.confirm(event, "Confirm Delete",
            task.completed && "This task has recorded progress are you sure you want to delete it?")
            .then(function () {
              var index = modelService.taskList.indexOf(task);
              modelService.taskList.splice(index, 1);
            });
        };
        $scope.editTask = function (event, task) {
          $scope.showTaskEdit(event, task);
        };
      }]);
})(window, window.angular);
