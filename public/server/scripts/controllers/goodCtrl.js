'use strict';
define(['app'],function(app){
    return app.controller('goodCtrl',["$scope",'GMResource','GCResource','$http','GOOD','$q',function($scope,GMResource,GCResource,$http,GOOD,$q){
        $scope.initGood = function(){
            $scope.good = {};
            $scope.good.category = [];
            $scope.good.spec = [];
            $scope.gcate0 = $scope.gcate1 = $scope.gcate2 = null;
        };
        $scope.initTabs = function(){
            $scope.tabsList = [
                {'text':'商品列表','original':true,'target':0},
                {'text':'创建商品模板','original':true,'target':1},
                {'text':'设置分类','original':true,'target':2},
                {'text':'创建商品','original':true,'target':3}
            ];
        };
        $scope.initFilter = function(){
            $scope.filter = {};
        };
        $scope.initgModel = function(){
            $scope.gModel = {};
        };
        $scope.initgCate = function(){
            $scope.gCate = {
                level : 0
            }
        };

        $scope.validError = {};
        $scope.selected = [];
        $scope.selectAll = false;

        $scope.tab_index = 0;
        $scope.tab_target = 0;

        $scope.initTabs();
        $scope.initGood();
        $scope.initFilter();
        $scope.initgModel();
        $scope.initgCate();

        /**
         * 添加 商品模板 模块
         * @type {Array}
         */
        $scope.cacheSpec = [];
        $scope.hasSpec = false;
        $scope.addSpec = function(newSpec){
            if(newSpec!=null && newSpec != '' && !$scope.cacheSpec.toString().match(newSpec)){
                $scope.cacheSpec.push(newSpec);
                $scope.hasSpec = true;
                $scope.spec_item = '';
            }
        };
        $scope.removeSpec = function(index){
            $scope.cacheSpec.splice(index,1);
            if($scope.cacheSpec.length<=0){
                $scope.hasSpec = false;
            }
        };
        $scope.saveGModel = function(){
            if($scope.gModel.name == null || $scope.gModel.name == ''){
                $scope.validError.name = '模板名称不能为空';
                return;
            }
            $scope.gModel.spec = $scope.cacheSpec;
            GMResource.save($scope.gModel,function(data){
                if(data.success){
                    alert(data.success);
                    $scope.initgModel();
                    $scope.cacheSpec = [];
                }
            });
        };
        $scope.removeModel = function(id){
            GMResource.remove({'id':id},function(data){
                if(data.success){
                    $scope.getAllModels();
                }
            })
        };

        /**
         * 添加 商品类别 模块
         */
        $scope.orderStr = '';
        $scope.orderRev = false;
        $scope.getAllCates = function(){
            if(arguments.length == 0){
                $http.get('/admin/getAllCates').success(function(data){
                    angular.forEach(data,function(val,key){
                        val.checked = false;
                    });
                    $scope.allCates = data;
                });
            }
        };
        $scope.getAllCates();
        $scope.saveGCate = function(){
            if($scope.gCate.name == '' || $scope.gCate.name == null ){
                $scope.validError.name = '分类名称不能为空';
                return;
            }
            if($scope.gCate.level != 0 && !$scope.gCate.cParent){
                $scope.validError.cParent = '父类不能为空';
                return;
            }
            GCResource.save($scope.gCate,function(data){
                if(data.success){
                    alert(data.success);
                    $scope.initgCate();
                    $scope.getAllCates();
                }
            });
        };
        $scope.getSubCate = function(){
            var lev = $scope.gCate.level-1;
            GCResource.get({level:lev},function(data){
                $scope.cateTemplate = data.data;
                $scope.cParent = data.data[0];
                $scope.gCate.cParent = $scope.cParent.name;
            })
        };
        $scope.getParent = function(){
            $scope.gCate.cParent = $scope.cParent.name;
        };
        $scope.delCate = function(){
            if(arguments.length==0){
                var delStr = [];
                angular.forEach($scope.allCates,function(val,key){
                    if(val.checked){
                        delStr.push(val._id)
                    }
                });
                GCResource.delete({'ids':delStr},function(data){})
            }else{
                GCResource.delete({'id':arguments[0]},function(data){
                    if(data.success){
                        alert(data.success);
                        $scope.getAllCates();
                    }
                })
            }
        };
        $scope.selectedAll = function(){
            angular.forEach($scope.allCates,function(val){
                val.checked = $scope.selectAll;
            })
        };
        $scope.checkSelected = function(item){
            if(item.checked){
                $scope.selectAll = true;
                angular.forEach($scope.allCates,function(val){
                    if(!val.checked){
                        $scope.selectAll = false;
                    }
                });
            }else{
                $scope.selectAll = false;
            }
        };

        /**
         * 添加 商品 模块
         */
        function checkSpec(){
            var deferred = $q.defer(),
                hasNull = false,
                errIndex = [];
            deferred.notify(hasNull);
            angular.forEach($scope.good.spec,function(val,key){
                if(val.params.length==0){
                    errIndex.push(key);
                    hasNull = true;
                }
            });
            if(hasNull){
                deferred.reject(errIndex[0])
            }else{
                deferred.resolve()
            }
            return deferred.promise;
        }

        $scope.goods = GOOD.query();
        $scope.createTemp = 0;
        $scope.createStep = 0;
        $scope.createTabs = ['基本信息','商品图片','商品库存','商品详细'];
        $scope.changeSteps = function(index){
            if($scope.createStep==index){return}
            $scope.createStep = index;
        };
        $scope.useModel = function(specs){
            angular.forEach(specs,function(val,key){
                $scope.good.spec.push({'name':val,'params':[]})
            });
            $scope.createTemp = 1;
        };
        $scope.selectModel = function(){
            $scope.good.spec = [];
            $scope.createTemp = 0;
        };
        $scope.getAllModels = function(){
            $scope.allModels = GMResource.query();
        };
        $scope.getAllModels();
        $scope.saveBase = function(){
            if($scope.good.name == null || $scope.good.name == ''){
                return $scope.validError.goodName = '商品名称不能为空';
            }
            if($scope.gcate0 == null || $scope.gcate0 == ''){
                return $scope.validError.goodCate = '请选择商品类别'
            }
            if(isNaN($scope.good.price) || $scope.good.price == null || $scope.good.price==''){
                return $scope.validError.goodPrice = '请输入正确的商品价格'
            }
            $scope.gcate0 && $scope.good.category.push($scope.gcate0);
            $scope.gcate1 && $scope.good.category.push($scope.gcate1);
            $scope.gcate2 && $scope.good.category.push($scope.gcate2);

            var check_spec = checkSpec();
            check_spec.then(function(){
                GOOD.save($scope.good,function(data){
                    if(data.error){
                        alert(data.error);
                        $scope.initGood();
                        $scope.$broadcast('resetSpec');
                    }else{
                        $scope.good = data.good;
                        $scope.specCouple = [];
                        $scope.createStep=1;
                    }
                });
            },function(index){
                $scope.$broadcast('checkSpec',index);
            });
        };
        $scope.saveImage = function(){
            var imgArr = [], liArr = angular.element('#goodPreview li img');
            if(liArr.length<=0){
                return $scope.validError.ImgErr = '上传图片数量为0，不能提交'
            }
            angular.forEach(angular.element('#goodPreview li img'),function(val,key){
                var name = val.src.substring(val.src.lastIndexOf('/')+1);
                imgArr.push('server/images/goods/'+name)
            });
            var updateGood = new GOOD();
            updateGood.data = {'param':'images','data':imgArr,'target':$scope.good._id};
            updateGood.$update(function(data){
                if(data.success){
                    $scope.initImagesList();
                    $scope.buildSpecForm($scope.good.spec);
                    $scope.createStep=2;
                }
            })
        };
        $scope.initImagesList = function(){
            angular.element('#goodPreview ul').html('');
            angular.element('input[type="file"]').val('');
            angular.element('#updatePreview ul').html('');
        };
        function clearServerImg(dom){
            var img_list = [];
            angular.forEach(dom,function(val,key){
                img_list.push(angular.element(val).attr('src'))
            });
            $http({
                method:'POST',
                data:{'src':img_list},
                url:'admin/removecacheImage'
            })
        }
        $scope.passImages = function(){
            $scope.createStep=2;
            $scope.buildSpecForm($scope.good.spec);
            clearServerImg(angular.element('#goodPreview img'));
            $scope.initImagesList();
        };
        $scope.buildSpecForm = function(arr){
            var couples = [];
            var k= 0,p_len=arr.length;
            function getCouple(){
                var cacheArr = couples;
                couples=[];
                if(arr[k]){
                    if(cacheArr.length==0){
                        couples=arr[k].params;
                    }else{
                        for(var i=0;i<=cacheArr.length-1;i++){
                            for(var j=0;j<=arr[k].params.length-1;j++){
                                couples.push(cacheArr[i]+'+'+arr[k].params[j])
                            }
                        }
                    }
                    k++;
                    if(k>=p_len){
                        angular.forEach(couples,function(val,key){
                            $scope.specCouple[key]={couple:val}
                        });
                    }else{
                        getCouple();
                    }
                }
            }
            getCouple();
        };
        $scope.saveDetail = function(){
            if($scope.good.detail==null || $scope.good.detail == ''){
                return $scope.validError.detailErr = '内容不能为空'
            }
            var updateGood = new GOOD();
            updateGood.data = ({'target':$scope.good._id,'data':$scope.good.detail,'param':'detail'});
            updateGood.$update(function(data){
                if(data.success){
                    alert(data.success);
                    if(!$scope.updateMode){
                        $scope.createTemp = 0;
                        $scope.createStep = 0;
                        $scope.goods = GOOD.query();
                        $scope.tabChange(0,0);
                    }
                }
            })
        };
        $scope.finishGood = function(){
            $scope.initGood();
            $scope.createTemp = 0;
            $scope.createStep = 0;
            $scope.goods = GOOD.query();
            $scope.specCouple = [];
            angular.element('#goodPreview ul').html('');
            angular.element('input[type="file"]').val("");
            $scope.tabChange(0,0);
        };
        $scope.removeGood = function(id){
            GOOD.remove({'id':id},function(data){
                if(data.success){
                    $scope.goods = GOOD.query();
                }
            });
        };

        /**
         * 修改 good 模块
         */
        $scope.updateMode = false;
        $scope.updateGood = function(id){
            $scope.tabsList.push({'text':'修改商品数据','original':false,'target':4});
            $scope.createStep = 0;
            $scope.tabChange(4,4);
            GOOD.get({'id':id},function(data){
                $scope.updateMode = true;
                $scope.good = data;
                $scope.getSpecCP();
                $scope.cacheRemoveImg = [];
                angular.forEach($scope.good.category,function(val,key){
                    $scope['gcate'+key] = val;
                });
            })
        };
        $scope.updateBase = function(){
            if($scope.good.name == null || $scope.good.name == ''){
                return $scope.validError.goodName = '商品名称不能为空';
            }
            if($scope.gcate0 == null || $scope.gcate0 == ''){
                return $scope.validError.goodCate = '请选择商品类别'
            }
            if(isNaN($scope.good.price) || $scope.good.price == null || $scope.good.price==''){
                return $scope.validError.goodPrice = '请输入正确的商品价格'
            }
            $scope.good.category = [];
            $scope.gcate0 && $scope.good.category.push($scope.gcate0);
            $scope.gcate1 && $scope.good.category.push($scope.gcate1);
            $scope.gcate2 && $scope.good.category.push($scope.gcate2);

            var check_spec = checkSpec();
            check_spec.then(function(){
                GOOD.save($scope.good,function(data){
                    if(data.error){
                        alert(data.error);
                    }else{
                        alert(data.success);
                        $scope.good = data.doc;
                        if(data.isChange){
                            $scope.buildSpecForm($scope.good.spec);
                            $scope.createStep = 2;
                            $scope.isChange = true;
                        }
                    }
                });
            },function(index){
                $scope.$broadcast('checkSpec',index);
            });
        };
        $scope.getSpecCP = function(){
            $http.post('/admin/getSpecCP',{'target':$scope.good._id}).success(function(data){
                if(data.error){
                    return alert(data.error)
                }
                if(data.data){
                    $scope.specCouple = data.data.specCP
                }
            });
        };
        $scope.removeServerImg = function(index,src){
            $scope.good.images.splice(index,1);
            $scope.cacheRemoveImg.push(src);
        };
        $scope.updateImage = function(){
            var liArr = angular.element('#updatePreview li img');
            if(liArr.length>0){
                angular.forEach(angular.element('#updatePreview li img'),function(val,key){
                    var name = val.src.substring(val.src.lastIndexOf('/')+1);
                    name && $scope.good.images.push('server/images/goods/'+name)
                });
            }

            var updateGood = new GOOD();
            updateGood.data = {'param':'images','data':$scope.good.images,'target':$scope.good._id,'cache':$scope.cacheRemoveImg};
            updateGood.$update(function(data){
                if(data.success){
                    alert(data.success);
                    $scope.good = data.doc;
                    $scope.initImagesList();
                }
            })
        };


        $scope.tabChange = function(index,target){
            if(index != $scope.tab_index){
                $scope.tab_index = index;
                $scope.tab_target = target;
                $scope.initGood();
                $scope.initgModel();
                $scope.selectModel();
                $scope.initImagesList();
                $scope.validError = {};
                $scope.cacheSpec = [];
                if(index == 3){
                    $scope.getAllModels();
                    $scope.createTemp = 0;
                    $scope.createStep = 0;
                }
                if($scope.tabsList[index].original){
                    $scope.initTabs();
                    $scope.updateMode = false;
                }
            }
        };

        $scope.clearErr = function(){
            $scope.validError = {};
        };

        $scope.turnto = function(index){
            if(!$scope.updateMode)return;
            $scope.createStep=index;
        }
    }])
});