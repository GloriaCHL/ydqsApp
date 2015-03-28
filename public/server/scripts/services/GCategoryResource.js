'use strict';
define(['app'],function(app){
    return app.factory('GCResource',['$resource',function($resource){
        return $resource('/admin/gcategory/:id',{'id':'@_id'},{
            update:{method:'PUT'}
        })
    }])
});