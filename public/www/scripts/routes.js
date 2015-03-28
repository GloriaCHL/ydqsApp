define(['app'],function(app){
    var _dir = "views/server/template/";
    return app.config(['$routeProvider','$locationProvider',function($routeProvider,$locationProvider){
        $routeProvider.
            when("/admin",{
                templateUrl:_dir+'index.html'
            }).
            when("/admin/login",{
                templateUrl:_dir+'adminLogin.html',
                controller:'goodCtrl'
            }).
            otherwise({
                redirect:"/admin"
            });
        $locationProvider.html5Mode(true);
    }])
});