'use strict';
define(['app'],function(app){
    return app.filter('cateFilter',function(){
        return function(input,level,parent){
            var newInp = [];
            angular.forEach(input,function(val,key){
                if(val.level==level && (!!parent?parent==val.parent:true)){
                    newInp.push(val);
                }
            });
            return newInp;
        }
    })
});