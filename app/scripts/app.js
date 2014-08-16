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
    $urlRouterProvider.otherwise('/today');
    $stateProvider
        .state('tasks', {
            url: '/tasks',
            templateUrl: '../views/tasks.html',
            controller: 'MainCtrl'
        })
        .state('today', {
            url: '/today',
            templateUrl: '../views/todayPage.html',
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
