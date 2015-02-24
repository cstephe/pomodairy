'use strict';

angular.module('pomodairyApp', [
  'ngAnimate',
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngStorage',
  'ngDraggable',
  'ngMaterial',
  'ngMessages',
  'ui.router',
  'nvd3ChartDirectives',
  'core.entities',
  'core.controllers',
  'pomodary.entities',
  'taskListModule',
  'settingsModule',
  'timerModule'
])
  .config(['$stateProvider', '$urlRouterProvider', '$mdThemingProvider', function ($stateProvider, $urlRouterProvider, $mdThemingProvider) {
    $urlRouterProvider.otherwise('/today');
    $stateProvider
      .state('app', {
        templateUrl:'views/app.html',
        controller:'navController',
        onEnter: ['timerService', function(timerService) {
          timerService.checkSettingForUpdate();
        }]
      })
      .state('app.tasks', {
        url: '/tasks'
      })
      .state('app.today', {
        url: '/today'
      })
      .state('app.settings', {
        url: '/settings',
        onExit: ['timerService',function(timerService) {
          timerService.checkSettingForUpdate();
        }]
      });
    $mdThemingProvider.theme('default')
      .primaryPalette('blue', {
        'default': '700',
        'hue-1': '900',
        'hue-2': '600',
        'hue-3': 'A100'
      })
      .accentPalette('blue-grey', {
        'default': '800',
        'hue-1': '200',
        'hue-2': '500',
        'hue-3': 'A200'
      });
  }])
  .constant('moment', moment)
  .constant('Howl', Howl)
  .constant('_', _);
