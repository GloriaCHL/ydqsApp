'use strict';
define(['app'],function(app){
    return app.factory('Essay',['$resource',function($resource){
        return $resource('/admin/essays/:action/:id',{id:'@_id'},{
            update:{method:'PUT'}
        },{
            stripTrailingSlashes:false
        });
    }])
});