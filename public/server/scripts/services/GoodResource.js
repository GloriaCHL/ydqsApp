'use strict';
define(['app'],function(app){
    return app.factory('GOOD',['$resource',function($resource){
        return $resource('/admin/good/:id',{'id':'@_id'},{
            update:{method:'PUT'}
        })
    }]);
});