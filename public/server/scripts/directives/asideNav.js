'use strict';
define(['app'],function(app){
    return app.directive('asideNav',function(){
            return {
                restrict:'EA',
                replace:true,
                transclude:true,
                scope:{
                    data : '=navData'
                },
                template:'<ul class="nav nav-sidebar">' +
                            '<li ng-class="{active:$index==cur_index}" ng-click="changeAct($index,item.templateUrl)" ng-repeat="item in data"><a href="">{{item.text}}</a></li>' +
                         '</ul>',
                controller:['$scope','$rootScope',function($scope,$rootScope){
                    $scope.cur_index = $rootScope.nav_index || 0;
                    $scope.changeAct = function(index,tempUrl){
                        $scope.cur_index = index;
                        $rootScope.tempUrl = tempUrl;
                        $rootScope.nav_index = index;
                    }
                }],
                link:function(scope,element,attr){
                }
            }
        })
});