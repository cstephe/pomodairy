'use strict';
(function (window, angular) {
    angular.module('taskListModule', [])
        .controller('navController', ['$scope', '$state', 'modelService',
            function ($scope, $state, modelService) {
                $scope.state = $state;
                $scope.model = modelService;
            }
        ])
        .controller('SettingsCtrl', [function(){

        }])
        .controller('MainCtrl', function ($scope, _, modelService, uuid) {
            $scope.model = {
                taskList: modelService.taskList
            };
            $scope.newTask = {};
            var clear = function () {
                $scope.newTask = {};
                $scope.editBox = null;
            };
            var inWorkList = function (task) {
                return modelService.workList.indexOf(task.id) != -1;
            };
            $scope.addTask = function () {
                var index = $scope.model.taskList.indexOf($scope.newTask);
                if (index === -1) {
                    $scope.newTask.id = uuid.newuuid();
                    $scope.model.taskList.push($scope.newTask);
                }
                clear();
            };
            $scope.inWorkList = inWorkList;
            $scope.workTask = function (task) {
                if (!inWorkList(task)) {
                    modelService.workList.push(task.id);
                }
            };

            $scope.removeTask = function (task) {
                var index = modelService.taskList.indexOf(task);
                modelService.taskList.splice(index, 1);

                var workIndex = modelService.workList.indexOf(task.id);
                modelService.workList.splice(workIndex, 1);

                clear();
            };
            $scope.editTask = function (task) {
                $scope.editBox = {title: "Edit Task", button: "Done"};
                $scope.newTask = task;
            };
        });
})(window, window.angular);
