'use strict';
define(['app'],function(app){
    return app.directive('contTabs',function(){
        return {
            restrict:'EA',
            replace:true,
            scope:{
                tabsList : '=',
                tabIndex : '='
            },
            template:'<ul class="nav nav-tabs adminTabs">'
                        +'<li ng-class="{active:$index==tabIndex}" ng-repeat="tab in tabsList"><a href="javascript:;" ng-click="changeToParent(tab.target)">{{tab.text}}</a></li>'
                        +'</ul>',
            controller:['$scope',function($scope){
                $scope.changeToParent = function(target){
                    $scope.$parent.tabChange(target);
                }
            }]
        }
    });
});