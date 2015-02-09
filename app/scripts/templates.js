angular.module('pomodairyApp').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('views/app.html',
    "<div class=\"nav-container\">\n" +
    "  <md-tabs class=\"md-hue-1\"  md-selected=\"selectedItemIndex\">\n" +
    "    <md-tab  label=\"Today\" ui-sref=\"app.today\">\n" +
    "      <md-tab-label type=\"button\" layout-sm=\"column\" layout-gt-sm=\"row\" layout-align=\"center center\">\n" +
    "        <div class=\"tab-icon\">\n" +
    "          <i class=\"fa fa-home\"></i> <span class=\"badge\">{{((model.taskList | taggedItems) | workItems).length}}</span>\n" +
    "        </div>\n" +
    "        <div class=\"md-grid-text\"> Today </div>\n" +
    "      </md-tab-label>\n" +
    "      <ng-include src=\"'scripts/modules/today/todayPage.html'\"\n" +
    "                  ng-controller=\"TimerCtrl\"></ng-include>\n" +
    "    </md-tab>\n" +
    "    <md-tab label=\"Inventory\" ui-sref=\"app.tasks\">\n" +
    "      <md-tab-label type=\"button\" layout-sm=\"column\" layout-gt-sm=\"row\" layout-align=\"center center\">\n" +
    "        <div class=\"tab-icon\"><i class=\"fa fa-list\"></i><span class=\"badge\">{{((model.taskList |  taggedItems) | openItems).length}}</span></div>\n" +
    "        <div class=\"md-grid-text\"> Inventory </div>\n" +
    "      </md-tab-label>\n" +
    "      <ng-include src=\"'scripts/modules/inventory/tasks.html'\"\n" +
    "                  ng-controller=\"InventoryCtrl\"></ng-include>\n" +
    "    </md-tab>\n" +
    "    <md-tab label=\"Settings\" ui-sref=\"app.settings\">\n" +
    "      <md-tab-label type=\"button\" layout-sm=\"column\" layout-gt-sm=\"row\" layout-align=\"center center\">\n" +
    "        <div class=\"tab-icon\"><i class=\"fa fa-gear\"></i></div>\n" +
    "        <div class=\"md-grid-text\"> Settings </div>\n" +
    "      </md-tab-label>\n" +
    "      <ng-include src=\"'scripts/modules/settings/settings.html'\"\n" +
    "                  ng-controller=\"SettingsCtrl\"></ng-include>\n" +
    "    </md-tab>\n" +
    "  </md-tabs>\n" +
    "</div>\n"
  );


  $templateCache.put('scripts/modules/inventory/inventory.html',
    "<div ui-view></div>\n"
  );


  $templateCache.put('scripts/modules/inventory/inventoryItem.html',
    "<div layout=\"row\" flex class=\"md-tile-content task-container\">\n" +
    "  <div flex class=\"task-details\" ng-click=\"editTask($event, task)\" on-long-press=\"longpress()\">\n" +
    "    <div>\n" +
    "      <span class=\"badge\">{{task.pomos}}</span>\n" +
    "      <span>{{task.name}}</span>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div class=\"task-actions md-tile-right\" layout=\"row\">\n" +
    "    <md-button flex\n" +
    "               class=\"md-warn\"\n" +
    "               type=\"button\"\n" +
    "               ng-click=\"removeTask($event, task)\"><i class=\"fa fa-trash\"></i>\n" +
    "    </md-button>\n" +
    "    <md-checkbox flex\n" +
    "                 class=\"md-primary\"\n" +
    "                 name=\"inWorkList\"\n" +
    "                 ng-model=\"task.inWorkList\"\n" +
    "                 ng-change=\"workTask(task)\"\n" +
    "                 aria-label=\"Add to work list\">Work\n" +
    "    </md-checkbox>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('scripts/modules/inventory/newTask.html',
    "<div layout=\"column\" ng-controller=\"taskDataController\">\n" +
    "  <md-toolbar>\n" +
    "    <div class=\"md-toolbar-tools\">\n" +
    "      <div>{{editBox.title || \"New Task\"}}</div>\n" +
    "    </div>\n" +
    "  </md-toolbar>\n" +
    "  <div flex layout-margin>\n" +
    "    <form ng-submit=\"addTask()\" name=\"newTaskForm\" role=\"form\">\n" +
    "      <md-input-container>\n" +
    "        <label>Name</label>\n" +
    "        <input name=\"taskName\" required type=\"text\" ng-model=\"newTask.name\"\n" +
    "               md-maxlength=\"60\">\n" +
    "        <div ng-messages=\"newTaskForm.taskName.$error\" ng-show=\"newTaskForm.taskName.$dirty\">\n" +
    "          <div ng-message=\"required\">This is required.</div>\n" +
    "          <div ng-message=\"md-maxlength\">The name has to be less than 60 characters long.</div>\n" +
    "        </div>\n" +
    "      </md-input-container>\n" +
    "      <md-input-container>\n" +
    "        <label>Pomodairies</label>\n" +
    "        <input name=\"pomoCount\" required type=\"number\" ng-model=\"newTask.pomos\" min=\"0\" max=\"99\" step=\"1\">\n" +
    "        <div ng-messages=\"newTaskForm.pomoCount.$error\" ng-show=\"newTaskForm.pomoCount.$dirty\">\n" +
    "          <div ng-message=\"required\">This is required.</div>\n" +
    "          <div ng-message=\"min\">Must be a positive value</div>\n" +
    "          <div ng-message=\"max\">Must be less than 100</div>\n" +
    "          <div ng-message=\"number\">Must be a number</div>\n" +
    "          <div ng-message=\"integer\">Must be a whole number</div>\n" +
    "        </div>\n" +
    "      </md-input-container>\n" +
    "      <md-input-container>\n" +
    "        <label>Tags</label>\n" +
    "        <input name=\"tags\" ng-model=\"newTask.tags\" md-maxlength=\"60\">\n" +
    "        <div ng-messages=\"newTaskForm.tags.$error\" ng-show=\"newTaskForm.tags.$dirty\">\n" +
    "          <div ng-message=\"md-maxlength\">Tags must be less than 60 characters long.</div>\n" +
    "        </div>\n" +
    "      </md-input-container>\n" +
    "      <md-input-container>\n" +
    "        <label>Description</label>\n" +
    "        <textarea name=\"description\" ng-model=\"newTask.description\" rows=\"2\" md-maxlength=\"150\"></textarea>\n" +
    "        <div ng-messages=\"newTaskForm.pomoCount.$error\" ng-show=\"newTaskForm.pomoCount.$dirty\">\n" +
    "          <div ng-message=\"md-maxlength\">The name has to be less than 150 characters long.</div>\n" +
    "        </div>\n" +
    "      </md-input-container>\n" +
    "      <div layout=\"row\">\n" +
    "        <md-button type=\"button\" class=\"md-default\" ng-click=\"closeDialog()\">Close</md-button>\n" +
    "        <div flex></div>\n" +
    "        <md-button type=\"submit\" class=\"md-raised md-primary\">{{isEdit?'Update':'Add'}}</md-button>\n" +
    "      </div>\n" +
    "    </form>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('scripts/modules/inventory/tasks.html',
    "<md-content>\n" +
    "  <div class=\"new-task-area\" ng-class=\"{'is-open':model.openNewTask}\">\n" +
    "    <div ng-include=\"'scripts/modules/inventory/newTask.html'\"></div>\n" +
    "  </div>\n" +
    "  <md-content class=\"md-raised\">\n" +
    "    <md-toolbar layout=\"row\">\n" +
    "      <div class=\"md-toolbar-tools\">\n" +
    "        <div>\n" +
    "          Inventory\n" +
    "        </div>\n" +
    "      </div>\n" +
    "      <md-button class=\"md-fab md-fab-top-right md-accent new-task-fab\" aria-label=\"New Task\"\n" +
    "                 ng-click=\"showTaskEdit($event)\">\n" +
    "        <i class=\"fa fa-plus\" style=\"font-size:24px\"></i>\n" +
    "      </md-button>\n" +
    "    </md-toolbar>\n" +
    "    <md-content flex class=\"md-raised\">\n" +
    "      <section>\n" +
    "        <md-subheader>\n" +
    "          <div layout=\"row\">\n" +
    "            <div>\n" +
    "              <md-switch ng-model=\"showCompleted\">\n" +
    "                {{showCompleted?\"All Tasks\":\"Open Tasks\"}}\n" +
    "              </md-switch>\n" +
    "            </div>\n" +
    "            <div flex class=\"align-right\">Done in about {{timeLeft()}}</div>\n" +
    "          </div>\n" +
    "        </md-subheader>\n" +
    "        <md-list layout=\"column\">\n" +
    "          <md-item flex\n" +
    "                   ng-repeat=\"task in inventoryItems = (model.taskList | taggedItems | openItems:showCompleted) | orderBy:taskOrder\">\n" +
    "            <md-item-content layout=\"row\" flex ng-include=\"'scripts/modules/inventory/inventoryItem.html'\"></md-item-content>\n" +
    "            <md-divider ng-if=\"!$last\"></md-divider>\n" +
    "          </md-item>\n" +
    "          <md-item ng-show=\"inventoryItems.length < 1\">\n" +
    "            <md-item-content layout=\"row\" layout-margin flex>\n" +
    "              <p>No Items In Your Inventory</p>\n" +
    "            </md-item-content>\n" +
    "          </md-item>\n" +
    "        </md-list>\n" +
    "      </section>\n" +
    "    </md-content>\n" +
    "  </md-content>\n" +
    "</md-content>\n"
  );


  $templateCache.put('scripts/modules/settings/settings.html',
    "<md-content class=\"md-padding\">\n" +
    "<form>\n" +
    "  <div>\n" +
    "    <select ng-model=\"model.showTag\" ng-disabled=\"!allTags.length\" ng-options=\"tag for tag in allTags\">\n" +
    "      <option value=\"\">All Tasks</option>\n" +
    "    </select>\n" +
    "    Tag Filter\n" +
    "  </div>\n" +
    "  <md-checkbox ng-model=\"model.strict\" aria-label=\"Finished?\">\n" +
    "    Strict Mode\n" +
    "  </md-checkbox>\n" +
    "  <md-input-container>\n" +
    "    <label> Pomo Length</label>\n" +
    "    <input type=\"number\" ng-model=\"model.pomoLength\" required ng-disabled=\"model.strict\">\n" +
    "  </md-input-container>\n" +
    "  <md-input-container>\n" +
    "    <label> Short Break Length</label>\n" +
    "    <input type=\"number\" ng-model=\"model.breakLength\" required ng-disabled=\"model.strict\">\n" +
    "  </md-input-container>\n" +
    "  <md-input-container>\n" +
    "    <label> Long Break Length</label>\n" +
    "    <input type=\"number\" ng-model=\"model.longBreakLength\" required ng-disabled=\"model.strict\">\n" +
    "  </md-input-container>\n" +
    "  <md-checkbox ng-model=\"model.cloudEnabled\" aria-label=\"Finished?\">\n" +
    "    Sync Tasks\n" +
    "  </md-checkbox>\n" +
    "</form>\n" +
    "</form>\n" +
    "</md-content>\n"
  );


  $templateCache.put('scripts/modules/today/timer.html',
    "<div class=\"timer-section\" ng-class=\"{'no-active-task':!activeWorkItem}\">\n" +
    "  <md-toolbar>\n" +
    "    <div class=\"md-toolbar-tools\">\n" +
    "      <div>\n" +
    "        {{timer.model.current.asMilliseconds()>0 ? (activeWorkItem.name || \"No Assigned Task\") : \"Break Time\"}}\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </md-toolbar>\n" +
    "  <div id=\"timerContainer\" layout=\"column\">\n" +
    "    <div class=\"time-digits\">\n" +
    "      <md-button class=\"md-fab md-accent timer-button\"\n" +
    "                 aria-label=\"Start Task\"\n" +
    "                 ng-hide=\"showComplete\"\n" +
    "                 ng-disabled=\"!activeWorkItem\"\n" +
    "                 ng-click=\"toggleTimer()\">\n" +
    "          <div ng-show=\"timer.model.current.asMilliseconds() > 0\">\n" +
    "            {{timer.model.current.minutes()}}.{{timer.model.current.seconds()}}\n" +
    "          </div>\n" +
    "          <div ng-hide=\"timer.model.current.asMilliseconds() > 0\">\n" +
    "            {{timer.model.break.minutes()}}.{{timer.model.break.seconds()}}\n" +
    "          </div>\n" +
    "          <div\n" +
    "            class=\"{{(timer.model.timerState==='PAUSED' || !timer.model.timerState) ? 'fa fa-play' : 'fa fa-times'}}\"></div>\n" +
    "      </md-button>\n" +
    "      <md-button class=\"md-fab md-accent timer-button\" aria-label=\"Pomo Complete choose action\"  ng-show=\"showComplete\">\n" +
    "        <div layout=\"row\" ng-show=\"showComplete\" layout-align=\"center center\">\n" +
    "          <md-button aria-label=\"Complete Pomo\"  flex>\n" +
    "            <i class=\"fa fa-check\" ng-click=\"completePomo()\"></i>\n" +
    "          </md-button>\n" +
    "          <md-button aria-label=\"Abandon Pomo\" flex>\n" +
    "            <i flex class=\"fa fa-times\" ng-click=\"cancelPomo()\"></i>\n" +
    "          </md-button>\n" +
    "        </div>\n" +
    "      </md-button>\n" +
    "    </div>\n" +
    "    <div>\n" +
    "      <nvd3-pie-chart\n" +
    "        id=\"timer\"\n" +
    "        data=\"timer.model.timerDisplay\"\n" +
    "        ng-model=\"timer.model.timerDisplay\"\n" +
    "        x=\"xFunction()\"\n" +
    "        y=\"yFunction()\"\n" +
    "        donut=\"true\"\n" +
    "        margin=\"{left:0,top:0,bottom:0,right:0}\"\n" +
    "        height=\"280\"\n" +
    "        width=\"280\"\n" +
    "        color=\"colorFunction()\">\n" +
    "        <svg></svg>\n" +
    "      </nvd3-pie-chart>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('scripts/modules/today/todayPage.html',
    "<div layout-gt-sm=\"row\" layout-sm=\"column\">\n" +
    "    <div flex>\n" +
    "        <ng-include src=\"'scripts/modules/today/timer.html'\"></ng-include>\n" +
    "    </div>\n" +
    "    <div flex>\n" +
    "      <md-toolbar>\n" +
    "        <div class=\"md-toolbar-tools\">\n" +
    "          <div>Today's Tasks</div>\n" +
    "        </div>\n" +
    "      </md-toolbar>\n" +
    "      <md-subheader>\n" +
    "        <div layout=\"row\">\n" +
    "          <div flex>Done in about {{timeLeft()}}</div>\n" +
    "          <div flex class=\"align-right\">Completed Today: {{completedToday()}}</div>\n" +
    "        </div>\n" +
    "      </md-subheader>\n" +
    "      <md-content>\n" +
    "        <md-list layout=\"column\">\n" +
    "          <md-item flex ng-repeat=\"workItem in (taskList | workItems | taggedItems) | orderBy:worklistOrder\">\n" +
    "            <md-item-content layout=\"row\" flex ng-include=\"'scripts/modules/today/workItem.html'\"></md-item-content>\n" +
    "            <md-divider ng-if=\"!$last\" class=\"ng-scope md-default-theme\"></md-divider>\n" +
    "          </md-item>\n" +
    "        </md-list>\n" +
    "        <md-content layout-margin ng-show=\"workListItems.length < 1\">\n" +
    "          <p>No items in your todo list, select or create ones in your <a ui-sref=\"tasks\">inventory</a>.</p>\n" +
    "        </md-content>\n" +
    "      </md-content>\n" +
    "    </div>\n" +
    "</div>\n"
  );


  $templateCache.put('scripts/modules/today/workItem.html',
    "<div layout=\"row\" flex class=\"md-tile-content\" ng-class=\"{'active-task':workItem.active}\">\n" +
    "  <div flex class=\"task-details\">\n" +
    "    <span class=\"badge\">{{workItem.completed.length || 0}}/{{workItem.pomos || 0}}</span>\n" +
    "    <span>{{workItem.name}}</span>\n" +
    "  </div>\n" +
    "  <div class=\"task-actions md-tile-right\">\n" +
    "    <div class=\"btn-group\">\n" +
    "      <md-button type=\"button\" class=\"md-raised md-primary\"\n" +
    "                 ng-click=\"startWorkOnItem($event, workItem)\">\n" +
    "        {{(activeWorkItem && workItem.id === activeWorkItem.id) ? 'Complete' : 'Work'}}\n" +
    "      </md-button>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n"
  );

}]);
