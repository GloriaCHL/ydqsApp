define(['app'],function(app){
    return app.controller('mainCtrl',['$scope','$rootScope','$location','LoginService','$http',function($scope,$rootScope,$location,LoginService,$http){
        $rootScope.appName = '非正常人类研究中心';

        $rootScope.$on('$routeChangeStart',function(){
            LoginService.checkLogin().then(function(data){
                if(data.error){
                    $location.path('/admin/login');
                }
            });
        });

        $scope.logout = function(){
            $http.get('/admin/logout').success(function(data){
                if(data.success){
                    $rootScope.admin = null;
                    $location.path('/admin/login');
                }
            })
        };
    }])
});