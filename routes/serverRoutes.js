var express = require('express');
var router = express.Router();
var async = require('async');
var crypto = require('crypto'),
    Admin = require('../models/admin.js'),
    Essay = require('../models/essay.js'),
    GModel = require('../models/gModel.js'),
    GCategory = require('../models/gCategory'),
    Good = require('../models/good'),
    Scp = require('../models/scpModel');
var gm = require('gm'),
    fs = require('fs');

/**
 * adminCtrl
 */
router.get('/getAdmins', function(req, res) {
  Admin.getAll(null,function(err,admins){
    if(err){
      return res.json({error:err})
    }
    res.json(admins);
  })
});

router.post("/addAdmin",function(req,res){
  var u_name = req.body.name,
      password = req.body.password;
    if(req.body.permission<req.session.admin.permission){
        return res.json({'error':'不能越权设置'})
    }
  Admin.getOne(u_name,function(err,admin){
    if(err){
      return res.json({error:err});
    }
    if(admin){
      return res.json({error:'管理员已存在'})
    }
    var md5 = crypto.createHash('md5'),
        pw = md5.update(password).digest("hex");
    var newAdmin = new Admin({
      name : u_name,
      password : pw,
      permission : req.body.permission
    });
    newAdmin.save(function(err,admin){
      if(err){
        return res.json({error:err});
      }
      res.json({success:true});
    })
  })
});

router.post("/delAdmin",function(req,res){
    if(req.body.name === 'admin' || req.body.name===req.session.admin.name){
        return res.json({'error':'无删除权限'});
    }
    if(req.body.permission<req.session.admin.permission){
        return res.json({'error':'无删除权限'});
    }
    Admin.remove(req.body.name,function(err){
        if(err){
            return res.json({error:'删除出错'})
        }
        res.json({success:'删除成功'})
    });
});

router.post('/editAdmin',function(req,res){
    Admin.getOne(req.body.name,function(err,admin){
        if(err){
            return res.json({'error':err});
        }
        if(req.session.admin.permission > admin.permission){
            return res.json({'error':"无修改权限"})
        }
        res.json({'admin':admin});
    })
});

router.post('/updateAdmin',function(req,res){
    var md5 = crypto.createHash('md5'),
        pw = md5.update(req.body.password).digest('hex');
    Admin.update({name:req.body.name,password:pw,permission:req.body.permission},function(err){
        if(err){
            return res.json({'error':err})
        }
        res.json({'success':'更新成功'});
    });
});

/**
 * loginCtrl
 */
router.post("/adminLogin",function(req,res){
    if(req.body.name == 'admin' && req.body.password == 'admin'){
        return res.json({'success':'登录成功','admin':{'name':'admin','password':'admin','permission':1}})
    }
  Admin.getOne(req.body.name,function(err,admin){
    if(err){
      return res.json({'symError':err});
    }
    if(!admin){
      return res.json({'admError':'管理账号不存在'})
    }
    var md5 = crypto.createHash('md5'),
        pw = md5.update(req.body.password).digest('hex');
    if(pw != admin.password){
      return res.json({'pwError':'密码不正确'});
    }
    req.session.admin = admin;
    res.json({'success':'登录成功','admin':admin});
  })
});

router.get('/loginCheck',function(req,res){
    if(!req.session.admin){
        return res.json({'error':'未登录'})
    }else{
        return res.json({'success':'已登录','admin':req.session.admin})
    }
});

router.get('/logout',function(req,res){
    req.session.admin = null;
    res.json({'success':'退出成功'})
});

/**
 * essayCtrl
 */
router.post('/essays',function(req,res){
    var essay = req.body;
    essay.author = req.session.admin.name;
    var newEssay = new Essay(essay);
    newEssay.save(function(err){
        if(err){
            return res.json({'error':'保存出错'})
        }
        res.json({'success':'保存成功'})
    })
});

/*router.post('/essays/:id',function(req,res){
    var essay = req.body;
    essay.author = req.session.admin.name;
    Essay.update(req.params.id,essay,function(err){
        if(err){
            return res.json({'error':err})
        }
        res.json({'success':'更新成功'})
    });
});*/

router.put('/essays',function(req,res){
    var essay = req.body.data;
    essay.author = req.session.admin.name;
    Essay.update(essay._id,essay,function(err){
        if(err){
            return res.json({'error':err})
        }
        res.json({'success':'更新成功'})
    });
});

router.get('/essays',function(req,res){
    var exp = req.query.string || null,
        page = req.query.page || 1,
        limit = req.query.limit || -1;
    Essay.getMany(exp,page,limit,function(err,essays,total){
        if(err){
            res.json({'error':err})
        }
        res.json(essays);
    })
});

router.get('/essays/:action/:id',function(req,res){
    Essay.getOne(req.params.id,req.params.action,function(err,essay){
        if(err){
            return res.json({'error':err});
        }
        res.json(essay);
    })
});

router.delete('/essays/:id',function(req,res){
    Essay.remove(req.params.id,function(err){
        if(err){
            return res.json({'error':err})
        }
        res.json({'success':'删除成功'})
    })
});

/**
 * goodCtrl
 */
router.post('/gmodel',function(req,res){
    var newGM = new GModel({
        name:req.body.name,
        spec : req.body.spec,
        description: req.body.description || ''
    });
    newGM.save(function(err){
        if(err){
            return res.json({'error':'模板保存出错'})
        }
        res.json({'success':'模板保存成功'})
    })
});

router.get('/gmodel',function(req,res){
    GModel.getAll(function(err,models){
        if(err){
            return res.json({'error':err})
        }
        res.json(models)
    })
});

router.delete('/gmodel/:id',function(req,res){
    GModel.remove(req.params.id,function(err){
        if(err){
            return res.json({'error':err})
        }
        res.json({'success':'success'})
    })
});

router.post('/gcategory',function(req,res){
    var new_cate = new GCategory({
        name:req.body.name,
        level:req.body.level,
        parent:req.body.cParent || ''
    });
    new_cate.save(function(err){
        if(err){
            res.json({'error':err})
        }
        res.json({'success':'创建分类成功'})
    });
});

router.get('/gcategory',function(req,res){
    if(req.query.level){
        GCategory.getAll(Number(req.query.level),function(err,cates){
            if(err){
                return res.json({'error':err})
            }
            res.json({'success':'success','data':cates}); // 返回的数据在 angular 的 $resource 中，只有 query 方法能接受数组，其他只能接收对象，所以这里需要对 cates 进行对象封装
        })
    }else{
        GCategory.getAll(null,function(err,cates){
            if(err){
                return res.json({'error':err})
            }
            res.json(cates)
        })
    }
});

router.delete('/gcategory/:id',function(req,res){
    GCategory.remove(req.params.id,function(err){
        if(err){
            return res.json({'error':err})
        }
        res.json({'success':'删除成功'})
    })
});

router.delete('/gcategory',function(req,res){
    var ids = req.query.ids;
    if(typeof ids == 'string'){
        GCategory.remove(ids,function(err){
            if(err){
                return res.json({'error':err})
            }
            res.json({'success':'删除成功'})
        })
    }else{
        req.query.ids.forEach(function(id){
            GCategory.remove(id,function(err){
                if(err){
                    return res.json({'error':err})
                }
                res.json({'success':'删除成功'})
            })
        })
    }
 });

router.get('/getAllCates',function(req,res){
    GCategory.getAll(null,function(err,cates){
        if(err){
            return res.json({'error':err})
        }
        res.json(cates)
    });
});

router.post('/good',function(req,res){
    Good.getMany(req.body.name,function(err,doc){
        if(err){
            return res.json({'error':err})
        }
        if(doc.length>0){
            return res.json({'error':'该名称商品已存在'})
        }
        var new_good = new Good({
            'name':req.body.name,
            'spec':req.body.spec,
            'price':req.body.price,
            'category':req.body.category,
            'description':req.body.description || '',
            'ad':req.body.ad || ''
        });
        new_good.save(function(err,good){
            if(err){
                return res.json({'error':err})
            }
            res.json({'good':good})
        })
    });
});

router.post('/good/:id',function(req,res){
    var isChange = false;
    Good.getMany(req.body.name,function(err,docs){
        if(err){
            return res.json({'error':err})
        }
        if(docs.length>1){
            return res.json({'error':'该商品名称已存在','target':'name'})
        }
        var req_spec_arr = [],doc_spec_arr = [];
        req.body.spec.forEach(function(val,key){
            req_spec_arr = req_spec_arr.concat(val.params);
        });
        docs[0].spec.forEach(function(val,key){
            doc_spec_arr = doc_spec_arr.concat(val.params);
        });console.log(req_spec_arr);console.log(doc_spec_arr);
        if(req_spec_arr.length != doc_spec_arr.length){
            isChange = true;
        }else{
            for(var i in req_spec_arr){
                if(req_spec_arr[i]!=doc_spec_arr[i]){
                    isChange = true;
                }
            }
        }
        if(isChange){
            Scp.remove(req.params.id,function(err){
                if(err){
                    console.log(err)
                }
            })
        }
        Good.update(req.params.id,{
            name:req.body.name,
            price:req.body.price,
            description:req.body.description,
            spec:req.body.spec,
            category:req.body.category,
            ad:req.body.ad
        },function(err,doc1){
            if(err){
                return res.json({'error':err})
            }
            res.json({'success':'保存成功','doc':doc1,'isChange':isChange})
        })
    })
});

router.get('/good',function(req,res){
    Good.getMany(function(err,goods){
        if(err){
            return res.json({'error':err})
        }
        res.json(goods);
    });
});
router.get('/good/:id',function(req,res){
    Good.getOne(req.params.id,function(err,good){
        if(err){
            return res.json({'error':err})
        }
        res.json(good);
    });
});
router.put('/good',function(req,res){
    var param = req.body.data.param;
    var params = {};
    params[param] = req.body.data.data;
    switch (param){
        case 'images':
            if(req.body.data.cache){
                req.body.data.cache.forEach(function(val,key){
                    fs.unlink('./public/'+val,function(err){
                        if(err){
                            console.log(err)
                        }
                    })
                })
            }
            Good.update(req.body.data.target,params,function(err,doc){
                if(err){
                    return res.json({'error':err})
                }
                res.json({'success':"success",'doc':doc})
            });
            break;
        case 'detail':
            Good.update(req.body.data.target,params,function(err,doc){
                if(err){
                    return res.json({'error':err})
                }
                res.json({'success':'success','doc':doc})
            })
    }
});

router.delete('/good/:id',function(req,res){
    Good.getOne(req.params.id,function(err,doc){
        if(err){
            return res.json({'error':err});
        }
        var imgs = doc.images;
        imgs.forEach(function(val,index){
            fs.unlink('./public/'+val,function(err){
                if(err){
                    console.log(err)
                }
            })
        });
        Good.remove(req.params.id,function(err){
            if(err){
                return res.json({'error':err})
            }
            Scp.remove(req.params.id,function(err2){
                if(err2){
                    return res.json({'error':err2});
                }
                res.json({'success':'success'})
            });
        })
    });
});

router.post('/uploadgoodImages',function(req,res){
    var file = req.files.uploadFile,
        path = file.path,
        new_path = './public/server/images/goods/'+file.name;
    fs.rename(path,new_path,function(err){
        if(err){
            return res.json({'error':err})
        }
        // 不用再调用 fs.rmdir 对 临时存储目录的文件进行移除，fs.rename 已经把移除工作做了。
        res.json({'success':true,'src':'server/images/goods/'+file.name});
    });
});

router.post('/removecacheImage',function(req,res){
    var _src = req.body.src;
    if(typeof _src == 'string'){
        fs.unlink('./public/'+_src,function(err){
             if(err){
                return console.log(err)
             }
         })
    }else if(typeof _src == 'object'){
        _src.forEach(function(val,key){
            fs.unlink('./public/'+val,function(err){})
        });
        res.json({'success':'success'})
    }
});

router.post('/saveSpecCouples',function(req,res){
    Scp.getOne(req.body.target,function(err,doc){
        if(err){
            return res.json({'error':err})
        }
        if(doc){
            Scp.update(req.body.target,req.body.specCP,function(err){
                if(err){
                    return res.json({'error':err})
                }
                res.json({'success':'成功更新商品库存'})
            })
        }else{
            var newSCP = new Scp(req.body);
            newSCP.save(function(err,doc){
                if(err){
                    return res.json({'error':err})
                }
                res.json({'success':'成功更新商品库存','doc':doc})
            })
        }
    });
});

router.post('/getSpecCP',function(req,res){
    Scp.getOne(req.body.target,function(err,doc){
        if(err){
            return res.json({'error':err})
        }
        res.json({'data':doc})
    })
});


module.exports = router;

function checkLogin(req,res,next){
  if(!req.session.user){
    return res.json({'error':'未登录'})
  }
  next();
}
function checkNotLogin(req,res,next){
  if(req.session.user){
    return res.json({'error':'已登录'})
  }
  next();
}