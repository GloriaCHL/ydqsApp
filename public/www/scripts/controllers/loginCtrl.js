define(['app'],function(app){
    return app.controller('loginCtrl',['$scope','$http','$location','$rootScope',function($scope,$http,$location,$rootScope){
        $scope.admin = {};
        angular.element('input').focus(function(){
            angular.element('.has-error').removeClass("has-error");
            $scope.$apply(function(){
                $scope.symError = $scope.admError = $scope.pwError = null;
            });
        });
        $scope.login = function(){
            $http.post("/admin/adminLogin",$scope.admin).success(function(data){
                if(data.symError){
                    $scope.symError = data.symError;
                }
                if(data.admError){
                    $scope.admError = data.admError;
                }
                if(data.pwError){
                    $scope.pwError = data.pwError;
                }
                if(data.success){
                    $rootScope.admin = data.admin;
                    $location.path('/admin');
                }
            });
        }
    }]);
});