'use strict';

/**
 * @ngdoc overview
 * @name pomodairyApp
 * @description
 * # pomodairyApp
 *
 * Main module of the application.
 */
angular
    .module('pomodairyApp', [
        'ngAnimate',
        'ngCookies',
        'ngResource',
        'ngSanitize',
        'ngTouch',
        'ngStorage',
        'ui.router',
        'nvd3ChartDirectives'
    ])
    .config(function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/tasks');
        $stateProvider
            .state('tasks', {
                url:'/tasks',
                templateUrl: '../views/tasks.html',
                controller: 'MainCtrl'
            })
            .state('timer', {
                url:'/timer',
                templateUrl: '../views/timer.html',
                controller: 'TimerCtrl'
            });

    })
    .constant('moment', moment);
