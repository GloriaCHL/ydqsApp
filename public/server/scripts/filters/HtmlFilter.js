'use strict';
define(['app'],function(app){
    return app.filter('HtmlFilter',['$sce',function($sce){
        return function(txt){
            return $sce.trustAsHtml(txt);
        }
    }])
});