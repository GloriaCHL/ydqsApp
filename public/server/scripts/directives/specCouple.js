'use strict';
define(['app'],function(app){
    return app.directive('specCouples',['$http','$q',function($http,$q){
        return {
            restrict:'EA',
            replace:true,
            scope:{
                cpList:'=',
                targetId:'='
            },
            transclude:true,
            template:'<div>' +
                '<h4>添加库存：</h4>' +
                '<div class="table-responsive">' +
                '<table class="table table-bordered">' +
                '<thead>' +
                '<tr>' +
                '<th width="80%">属性组合</th>' +
                '<th>库存数量</th>' +
                '</tr>' +
                '</thead>' +
                '<tbody>' +
                '<tr ng-class="{\'has-error\':$index==errIndex}" ng-repeat="cp in cpList">' +
                '<td>{{cp.couple}}</td>' +
                '<td><input type="text" ng-focus="clearErr()" class="form-control" ng-model="cp.count"/>' +
            '<div ng-show="$index==errIndex" class="help-block">输入数据错误</div>' +
            '</td>' +
                '</tr>' +
                '</tbody>' +
                '</table>' +
                '</div>' +
                '<button type="button" class="btn btn-success" ng-click="saveCP()">提交</button>' +
                '</div>',
            // template 必须是个闭合的元素整体，所以这里特意用一个 div　来把 按钮跟表格div包裹成一个整体
            link:function(scope,attrs,element){

                scope.clearErr = function(){
                    scope.errIndex=null
                };

                function checkErr(){
                    var hasErr = false,
                        errIndex = [];

                    var deferred = $q.defer();

                    deferred.notify(hasErr);

                    angular.forEach(scope.cpList,function(val,key){
                        if(isNaN(val.count)){
                            errIndex.push(key);
                            hasErr = true;
                        }
                    });
                    if(hasErr){
                        deferred.reject(errIndex);
                    }else{
                        deferred.resolve();
                    }
                    return deferred.promise;
                }

                scope.saveCP = function(){
                    var promise = checkErr();
                    promise.then(function(){
                        $http.post('/admin/saveSpecCouples',{'target':scope.targetId,'specCP':scope.cpList}).success(function(data){
                            if(data.success){
                                alert(data.success);
                                scope.$parent.isChange = false;
                                if(!scope.$parent.updateMode){
                                    scope.$parent.createStep=3;
                                    scope.cpList = null;
                                }
                            }
                        })
                    },function(data){
                        scope.errIndex = data[0]
                    });

                };
            }
        }
    }])
});