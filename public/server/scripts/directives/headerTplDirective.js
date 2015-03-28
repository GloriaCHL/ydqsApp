'use strict';
define(['app'],function(app){
    return app.directive('appHeadNav',function(){
        return {
            restrict:'EA',
            replace:true,
            transclude:true,
            templateUrl:'server/views/template/headerNav.html',
            controller:['$rootScope','LoginService',function($rootScope,LoginService){
                LoginService.checkLogin().then(function(data){
                    var admin = data.admin;
                    if(!!admin){
                        angular.element('.navbar-nav .active').removeClass('hide').html('<a href>欢迎您， '+ admin.name +'</a>');
                    }
                });
            }]
        }
    });
});