'use strict';
(function (window, angular) {
  angular.module('core.entities', [])
    .directive('onLongPress', function ($timeout) {
      return {
        restrict: 'A',
        link: function ($scope, $elm, $attrs) {
          $elm.bind('touchstart', function (evt) {
            // Locally scoped variable that will keep track of the long press
            $scope.longPress = true;

            // We'll set a timeout for 600 ms for a long press
            $timeout(function () {
              if ($scope.longPress) {
                // If the touchend event hasn't fired,
                // apply the function given in on the element's on-long-press attribute
                $scope.$apply(function () {
                  $scope.$eval($attrs.onLongPress)
                });
              }
            }, 600);
          });

          $elm.bind('touchend', function (evt) {
            // Prevent the onLongPress event from firing
            $scope.longPress = false;
            // If there is an on-touch-end function attached to this element, apply it
            if ($attrs.onTouchEnd) {
              $scope.$apply(function () {
                $scope.$eval($attrs.onTouchEnd)
              });
            }
          });
        }
      };
    })
    .factory("uuid", [function () {
      return {
        newuuid: function () {
          // http://www.ietf.org/rfc/rfc4122.txt
          var s = [];
          var hexDigits = "0123456789abcdef";
          for (var i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
          }
          s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
          s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
          s[8] = s[13] = s[18] = s[23] = "-";
          return s.join("");
        }
      }
    }])
    .service('applicationState', ['modelService', function (modelService) {
      var appState = {
        activeItem: null,
        pomoLength: modelService.settings.pomoLength,
        breakLength: 5,
        showTag:""
      };
      return appState;
    }])
    .factory('deviceReady', function () {
      return function (done) {
        if (typeof window.cordova === 'object') {
          document.addEventListener('deviceready', function () {
            done();
          }, false);
        } else {
          done();
        }
      };
    })
    .service('osShell', ['$window', 'Howl', '$mdDialog', function ($window, Howl, $mdDialog) {
      window.thing = this;
      var that = this;
      that.appInForeground = true;
      var onDeviceReady = function () {
        that.notify = function (options) {
          try {
            $window.plugin.notification.local.add(options);
          } catch (e) {
            console.error(e);
          }
        };
        that.playSound = function (path) {
          return new Media("/android_asset/www/" + path).play();
        };
        that.notifyIfInactive = function (options) {
          try {
            if (!that.appInForeground) {
              $window.plugin.notification.local.add(options);
              $window.navigator.notification.beep()
            }
          } catch (e) {
            console.error(e);
          }
        };
      };
      var handleAppActive = function (event) {
        switch (event.type) {
          case "pause":
            that.appInForeground = false;
            break;
          case "resume":
            that.appInForeground = true;
            break;
        }
      };
      if (window.cordova) {
        document.addEventListener("deviceready", onDeviceReady, false);
        document.addEventListener("pause", handleAppActive, false);
        document.addEventListener("resume", handleAppActive, false);
      } else {
        that.appInForeground = true;
        that.notifyIfInactive = angular.noop;
        that.notify = angular.noop;
        that.playSound = function (path) {
          return new Howl({
            urls: [path]
          }).play();
        };
      }
      that.confirm = function (event, title, body, okButton, cancelButton) {
        if (typeof title === 'object') {
          body = title.body;
          okButton = title.okButton;
          cancelButton = title.cancelButton;
          title = title.title;
        }
        okButton = okButton || "OK";
        cancelButton = cancelButton || "NOPE";
        var confirm = $mdDialog.confirm()
          .title(title)
          .content(body)
          .ok(okButton)
          .cancel(cancelButton)
          .targetEvent(event);
        return $mdDialog.show(confirm);
      };
    }])
    .directive('integer', function () {
      var INTEGER_REGEXP = /^\-?\d+$/;
      return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {
          ctrl.$validators.integer = function (modelValue, viewValue) {
            if (ctrl.$isEmpty(modelValue)) {
              // consider empty models to be valid
              return true;
            }

            if (INTEGER_REGEXP.test(viewValue)) {
              // it is valid
              return true;
            }

            // it is invalid
            return false;
          };
        }
      };
    });
})(window, window.angular);
