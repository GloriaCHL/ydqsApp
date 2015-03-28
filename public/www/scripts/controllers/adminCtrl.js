define(['app'],function(app){
    return app.controller("adminCtrl",["$scope","$http",function($scope,$http){
        $scope.admin = {};
        $scope.admin.permission = 3;

        $scope.addAdmin = function(){
            $http.post('/admin/addAdmin',$scope.admin).success(function(data){
                if(data.error){
                    alert(data.error)
                }
                if(data.success){
                    alert("添加成功");
                    $scope.admin = {};
                    $scope.getAdmins();
                }
            })
        };

        $scope.getAdmins = function(){
            $http.get("/admin/getAdmins").success(function(data){
                $scope.admins = data;
            })
        };
        $scope.getAdmins();

        $scope.delAdmin = function(admin){
            $http.post('/admin/delAdmin',admin).success(function(data){
                if(data.error){
                    alert(data.error);
                }
                if(data.success){
                    //alert("删除成功");
                    $scope.getAdmins();
                }
            })
        }
    }])
});
