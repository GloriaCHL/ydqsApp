'use strict';
require.config({
    paths : {
        angular: '../../bower_components/angular/angular.min',
        ngRoute : '../../bower_components/angular-route/angular-route.min',
        jquery : '../../bower_components/jquery/dist/jquery.min',
        bootstrap: '../../bower_components/bootstrap/dist/js/bootstrap.min',
        'textAngularRangy':'../../bower_components/textAngular/dist/textAngular-rangy.min',
        'textAngularSanitize':'../../bower_components/textAngular/dist/textAngular-sanitize.min',
        'textAngular':'../../bower_components/textAngular/dist/textAngular.min',
        'rangy-core':'../../bower_components/rangy/rangy-core.min.js',
        'rangy-selectionsaverestore':'../../bower_components/rangy/rangy-selectionsaverestore.min',
        'ngResource':'../../bower_components/angular-resource/angular-resource.min',
        'ngSanitize':'../../bower_components/angular-sanitize/angular-sanitize.min',
        'ngAnimate':'../../bower_components/angular-animate/angular-animate.min'
    },
    shim: {
        'angular':{'exports':'angular'},
        'ngRoute':{'deps':['angular'],'export':'ngRoute'},
        'bootstrap':{'deps':['jquery']},
        'ngResource':{'deps':['angular'],'export':'ngResource'},
        'ngAnimate':{'deps':['angular'],'export':'ngAnimate'},
        'ngSanitize':{'deps':['angular'],'export':'ngSanitize'}
    },
    /*deps:['Boot'],*/
    urlArgs: "bust=" + (new Date()).getTime()  //防止读取缓存，调试用
});

require([
    'angular',
    'ngRoute',
    'ngResource',
    'ngSanitize',
    'ngAnimate',
    'app',
    'routes',
    'controllers/adminCtrl',
    'controllers/goodCtrl',
    "jquery",
    'bootstrap',
    'controllers/loginCtrl',
    'controllers/mainCtrl',
    'services/adminLoginService',
    'directives/headerTplDirective',
    'directives/asideNav',
    'controllers/essayCtrl',
    'directives/contTabs',
    'directives/specGroup',
    'directives/specCouple',
    'services/EssayResource',
    'services/GModelResource',
    'services/GCategoryResource',
    'services/GoodResource',
    'filters/HtmlFilter',
    'filters/cateLevelFilter'
],function(angular){
    angular.bootstrap(document,['ydqsApp']);
});
