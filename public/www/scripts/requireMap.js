require.config({
    paths : {
        angular: '../bower_components/angular/angular.min',
        angularRoute : '../bower_components/angular-route/angular-route.min',
        jquery : '../bower_components/jquery/dist/jquery.min',
        bootstrap: '../bower_components/bootstrap/dist/js/bootstrap.min'
    },
    shim: {
        'angular':{'exports':'angular'},
        'angularRoute':{'deps':['angular']},
        'bootstrap':{'deps':['jquery']}
    },
    priority: [
        "angular"
    ]
});

require([
    'angular',
    'angularRoute',
    'app',
    'routes',
    'controllers/adminCtrl',
    'controllers/goodCtrl',
    "jquery",
    'bootstrap',
    'controllers/loginCtrl',
    'controllers/mainCtrl',
    'services/adminLoginService',
    'directives/headerTplDirective'
],function(angular){
    angular.bootstrap(document,['ydqsApp']);
});