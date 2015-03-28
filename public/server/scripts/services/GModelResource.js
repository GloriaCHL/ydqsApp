'use strict';
define(['app'],function(app){
    return app.factory('GMResource',['$resource',function($resource){
        return $resource('/admin/gmodel/:id',{'id':'@_id'},{
            update : {method:'PUT'}
        })
    }])
});