'use strict';

angular.module('pomodairyApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngTouch',
    'ngStorage',
    'ui.router',
    'nvd3ChartDirectives',
    'core.entities',
    'taskListModule',
    'timerModule'
])
.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/tasks');
    $stateProvider
        .state('tasks', {
            url: '/tasks',
            templateUrl: '../views/tasks.html',
            controller: 'MainCtrl'
        })
        .state('timer', {
            url: '/timer',
            templateUrl: '../views/timer.html',
            controller: 'TimerCtrl'
        })
        .state('settings', {
            url: '/settings',
            templateUrl: '../views/settings.html',
            controller: 'SettingsCtrl'
        });
})
.constant('moment', moment)
.constant('_', _);
