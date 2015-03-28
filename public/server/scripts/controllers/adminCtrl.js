'use strict';
define(['app'],function(app){
    return app.controller("adminCtrl",["$scope","$http",function($scope,$http){
        $scope.initAdmin = function(){
            $scope.admin = {};
        };
        $scope.initTabs = function(){
            $scope.tabsList = [
                {'text':'账号列表','original':true,'target':0},
                {'text':'添加管理员','original':true,'target':1}
            ];
        };

        $scope.validError = {};
        $scope.adminSelected = [];
        $scope.selectAll = false;

        $scope.tab_index = 0;

        $scope.initTabs();
        $scope.initAdmin();

        $scope.addAdmin = function(){
            if($scope.admin.name == '' || $scope.admin.name == null){
                $scope.validError.nameErr = '用户名不能为空';
                return;
            }
            if($scope.admin.password == '' || $scope.admin.password == null){
                $scope.validError.pwErr = '密码不能为空';
                return;
            }
            if($scope.admin.permission == '' || $scope.admin.permission == null){
                $scope.validError.permissionErr = '请设置账户权限';
                return;
            }
            $http.post('/admin/addAdmin',$scope.admin).success(function(data){
                if(data.error){
                    $scope.validError.permissionErr = data.error;
                }
                if(data.success){
                    alert("添加成功");
                    $scope.initAdmin();
                    $scope.getAdmins();
                }
            })
        };

        $scope.getAdmins = function(){
            $http.get("/admin/getAdmins").success(function(data){
                angular.forEach(data,function(val,key){
                    val.checked = false;
                });
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
        };

        $scope.ediAdmin = function(admin){
            $http.post('/admin/editAdmin',admin).success(function(data){
                if(data.error){
                    alert(data.error);
                    return;
                }
                $scope.admin.name = data.admin.name;
                $scope.admin.permission = data.admin.permission;
                $scope.tabsList.push({'text':'编辑管理账号','original':false,'target':2});
                $scope.tab_index = $scope.tabsList.length-1;
                $scope.tab_target = 2;
            })
        };

        $scope.updateAdmin = function(){
            if($scope.admin.password == '' || $scope.admin.password == null){
                $scope.validError.pwErr = '密码不能为空';
                return;
            }
            $http.post('/admin/updateAdmin',$scope.admin).success(function(data){
                alert(data.success || data.error);
                if(data.success){
                    $scope.admin = {};
                    $scope.getAdmins();
                    $scope.initAdmin();
                    $scope.tabChange(0,0);
                }
            });
        };

        $scope.cancelUpdate = function(){
            $scope.initAdmin();
            $scope.tabChange(0,0);
        };

        $scope.tabChange = function(index,target){
            if(index != $scope.tab_index){
                $scope.tab_index = index;
                $scope.tab_target = target;
                $scope.initAdmin();
                $scope.initTabs();
                $scope.validError = {};
            }
        };

        $scope.selectedAll = function(){
            angular.forEach($scope.admins,function(val){
                val.checked = $scope.selectAll;
            })
        };

        $scope.checkSelected = function(admin){
            if(admin.checked){
                $scope.selectAll = true;
                angular.forEach($scope.admins,function(val){
                    if(!val.checked){
                        $scope.selectAll = false;
                    }
                });
            }else{
                $scope.selectAll = false;
            }
        };

        $scope.clearErr = function(){
            $scope.validError = {};
        };
    }])
});
