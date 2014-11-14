'use strict';

describe('Controller: MainCtrl', function () {

  // load the controller's module
  beforeEach(module('pomodairyApp'));

  var MainCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MainCtrl = $controller('MainCtrl', {
      $scope: scope,
      modelService : {taskList:[{},{},{}]}
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.model.taskList.length).toBe(3);
  });
});
