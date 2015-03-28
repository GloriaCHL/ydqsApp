var express = require('express');
var router = express.Router();
var crypto = require('crypto'),
    Admin = require('../models/admin.js');

var server_url = "public/views/server/index.html",
    www_url = "public/views/www/index.html";

/* GET home page. */
/*router.get('/', function(req, res) {
  res.sendfile(server_url);
});*/

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
  Admin.remove(req.body.name,function(err){
    if(err){
      return res.json({error:'删除出错'})
    }
    res.json({success:'删除成功'})
  });
});

router.post("/adminLogin",function(req,res){
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
    //res.sendfile('public/views/server/index.html');
    //res.json(admin);
    res.redirect("/")
  })
});

/*
function LogicRoutes(app){
  app.post("/admin/addAdmin",function(req,res){
    var u_name = req.body.username,
        password = req.body.password;
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
        res.json({success:'add success'});
      })
    })
  });
}
*/

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