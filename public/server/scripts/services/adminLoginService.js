'use strict';
define(['app'],function(app){
    return app.service('LoginService',['$http','$q',function($http,$q){
        var LoginServer = {
            isLogin : false,
            checkLogin:function(){
                var deferred = $q.defer();
                $http.get('/admin/loginCheck').success(function(data){
                    deferred.resolve(data);
                }).error(function(){
                    deferred.reject('error');
                });
                return deferred.promise;
            }
        };
        return LoginServer;
    }])
});
