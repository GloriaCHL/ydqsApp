'use strict';
define(['app'],function(app){
    return app.controller('essayCtrl',['$scope','Essay',function($scope,Essay){
        $scope.initEssay = function(){
            $scope.essay = {};
            $scope.essay.category = $scope.categorys[0];
        };
        $scope.initTabs = function(){
            $scope.tabsList = [
                {'text':'文章列表','original':true,'target':0},
                {'text':'发表文章','original':true,'target':1}
            ];
        };

        $scope.categorys = ['angularjs','jquery','html5+css3','nodejs','javascript'];
        $scope.submitErr = {};

        $scope.initEssay();
        $scope.initTabs();

        $scope.tab_index = 0;
        $scope.tab_target = 0;

        $scope.getEssays = function(){
            $scope.essays = Essay.query();
        };
        $scope.getEssays();

        $scope.subEssay = function(){
            if($scope.essay.title == '' || $scope.essay.title == null){
                $scope.submitErr.titleErr = '标题不能为空';
                return;
            }
            if($scope.essay.content == '' || $scope.essay.content == null){
                $scope.submitErr.contErr = '内容不能为空';
                return;
            }
            Essay.save($scope.essay,function(data){
                if(data.success){
                    alert(data.success);
                    $scope.initEssay();
                    $scope.getEssays();
                }
            })
        };

        $scope.clearErr = function(){
            $scope.submitErr = {};
        };

        $scope.editEssay = function(id){
            Essay.get({'action':'edit','id':id},function(data){
                $scope.essay = data;
                $scope.initTabs();
                $scope.tabsList.push({'text':'修改文章','original':false,'target':2});
                $scope.tab_index = $scope.tabsList.length-1;
                $scope.tab_target = 2;
            });
        };

        $scope.updateEssay = function(){
            if($scope.essay.title == '' || $scope.essay.title == null){
                $scope.submitErr.titleErr = '标题不能为空';
                return;
            }
            if($scope.essay.content == '' || $scope.essay.content == null){
                $scope.submitErr.contErr = '内容不能为空';
                return;
            }
            /*Essay.save($scope.essay,function(data){
                if(data.success){
                    alert(data.success);
                    $scope.essay = {};
                    $scope.getEssays();
                }
            });*/
            $scope.newEssay = new Essay();   // new 一个 Essay 以获取 $update 方法进行 put 上传数据
            $scope.newEssay.data = $scope.essay; // 数据结构：{'data':{$scope.essay}}
            $scope.newEssay.$update(function(data){
                if(data.success){
                    alert(data.success);
                    $scope.initEssay();
                    $scope.getEssays();
                    $scope.tabChange(0,0);
                }
            })
        };

        $scope.detailEssay = function(item){
            $scope.essay = item;
            $scope.initTabs();
            $scope.tabsList.push({'text':'文章预览','original':false,'target':3});
            $scope.tab_index = $scope.tabsList.length-1;
            $scope.tab_target = 3;
        };

        $scope.delEssay = function(id){
            Essay.remove({'id':id},function(data){
                if(data.success){
                    alert(data.success);
                    $scope.initEssay();
                    $scope.getEssays();
                    $scope.tabChange(0,0);
                }
            })
        };

        $scope.tabChange = function(index,target){
            if(index != $scope.tab_index){
                $scope.tab_index = index;
                $scope.tab_target = target;
                $scope.initEssay();
                $scope.initTabs();
                $scope.clearErr();
                $scope.submitErr = {};
            }
        };
    }])
});