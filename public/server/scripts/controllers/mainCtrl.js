'use strict';
define(['app'],function(app){
    return app.controller('mainCtrl',['$scope','$rootScope','$location','LoginService','$http',function($scope,$rootScope,$location,LoginService,$http){
        $rootScope.appName = '非正常人类研究中心';
        $rootScope.navList = [
            {'text':'商品管理','templateUrl':'server/views/template/goods_tpl.html'},
            {'text':'文章管理','templateUrl':'server/views/template/essays_tpl.html'},
            {'text':'用户管理','templateUrl':'server/views/template/users_tpl.html'},
            {'text':'管理员管理','templateUrl':'server/views/template/admins_tpl.html'},
            {'text':'修改密码','templateUrl':'server/views/template/editPW_tpl.html'}
        ];
        $rootScope.tempUrl = 'server/views/template/goods_tpl.html';
        $rootScope.nav_index = 0;

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