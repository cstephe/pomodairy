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
        'ngRoute',
        'ngSanitize',
        'ngTouch',
        'ngStorage',
        'ui.router'
    ])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/main.html',
                controller: 'MainCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });
    });
