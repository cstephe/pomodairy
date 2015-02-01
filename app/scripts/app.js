'use strict';

angular.module('pomodairyApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngTouch',
    'ngStorage',
    'ngMaterial',
    'ui.router',
    'nvd3ChartDirectives',
    'core.entities',
    'pomodary.entities',
    'taskListModule',
    'timerModule'
])
.config(['$stateProvider', '$urlRouterProvider', '$mdThemingProvider', function ($stateProvider, $urlRouterProvider, $mdThemingProvider) {
    $urlRouterProvider.otherwise('/today');
    $stateProvider
        .state('tasks', {
            url: '/tasks',
            templateUrl: 'views/tasks.html',
            controller: 'MainCtrl'
        })
        .state('today', {
            url: '/today',
            templateUrl: 'views/todayPage.html',
            controller: 'TimerCtrl'
        })
        .state('settings', {
            url: '/settings',
            templateUrl: 'views/settings.html',
            controller: 'SettingsCtrl'
        });
    $mdThemingProvider.theme('default')
      .primaryPalette('light-blue')
      .accentPalette('blue');
}])
.constant('moment', moment)
.constant('_', _);
/*
 red
 pink
 purple
 deep-purple
 indigo
 blue
 light-blue
 cyan
 teal
 green
 light-green
 lime
 yellow
 amber
 orange
 deep-orange
 brown
 grey
 blue-grey
 */
