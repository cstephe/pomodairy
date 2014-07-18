'use strict';

/**
 * @ngdoc function
 * @name pomodairyApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the pomodairyApp
 */
angular.module('pomodairyApp')
  .controller('MainCtrl', function ($scope, taskService) {
    $scope.model = {
        taskList : taskService.taskList
    };
        var clear = function(){
            $scope.newTask = {};
            $scope.editBox = null;
        }

    $scope.addTask = function(){
        var index = $scope.model.taskList.indexOf($scope.newTask);
        console.log(index);
        if(index === -1){
            $scope.model.taskList.push($scope.newTask);
        }
        clear();
    };
    $scope.removeTask = function(task){
        var index = $scope.model.taskList.indexOf(task);
        $scope.model.taskList.splice(index,1);
        clear();
    };
    $scope.editTask = function(task){
        $scope.editBox = {title:"Edit Task", button:"Done"};
        $scope.newTask = task;

    };
  })
    .controller('navController', function($scope, $state){
        $scope.state = $state;
        console.log($scope.currentState);
    })
    .service('taskService', ['$localStorage', function($localStorage){
        $localStorage.taskList = $localStorage.taskList || [];
        return {
            taskList:$localStorage.taskList
        };
  }]);
