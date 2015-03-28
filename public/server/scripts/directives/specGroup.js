'use strict';
define(['app'],function(app){
    return app.directive('specGroup',function(){
        return {
            restrict:'EA',
            replace:true,
            scope:{
                spec : '=',
                index : '='
            },
            transclude:true,
            template:'<div class="form-group" ng-class="{\'has-error\':err}">'+
                     '<label class="col-md-1 control-label" ng-click="saySpec()"><em class="red">*</em> {{spec.name}}：</label>'+
                     '<div class="col-md-5">'+
                     '<div class="input-group">'+
                     '<input ng-model="spec_item" type="text" ng-focus="clearErr()" class="form-control" name="gmSpec"/>'+
                     '<span class="input-group-btn">'+
                     '<button type="button" ng-click="addSpec(spec_item)" class="btn btn-default"><span class="glyphicon glyphicon-plus"></span> 添加属性</button>'+
                     '</span>'+
                     '</div>'+
                     '<ul ng-show="hasSpec" class="list-unstyled gmodel-spec-list">'+
                     '<li ng-repeat="sp in spec.params"><a href class="pull-right" ng-click="removeSpec($index)"><span class="glyphicon glyphicon-remove"></span></a>{{sp}}</li>'+
                     '</ul>'+
                     '<div class="help-block" ng-show="err">{{err}}</div>'+
                     '</div>'+
                     '</div>',
            controller:['$scope',function($scope){
            }],
            link:function(scope,elements,attrs){
                scope.err = '';
                scope.spec.params.length>0?scope.hasSpec = true:scope.hasSpec = false;
                scope.addSpec = function(newSpec){
                    if(newSpec!=null && newSpec != '' && !scope.spec.params.toString().match(newSpec)){
                        scope.spec.params.push(newSpec);
                        scope.hasSpec = true;
                        scope.spec_item = '';
                    }
                };
                scope.removeSpec = function(index){
                    scope.spec.params.splice(index,1);
                    if(scope.spec.params.length<=0){
                        scope.hasSpec = false;
                    }
                };
                scope.clearErr = function(){
                    scope.err = '';
                };
                scope.$on('checkSpec',function(e,index){
                    if(scope.index==index){
                        scope.err=scope.spec.name+ '属性值不能为空'
                    }
                });
                scope.$on('resetSpec',function(e,data){
                    scope.spec.params = [];
                    scope.hasSpec = false;
                });
            }
        }
    })
});