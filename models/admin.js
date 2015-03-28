var adminModel = require('./dbModels').Admin;

function Admin(admin){
    this.name = admin.name;
    this.password = admin.password;
    this.permission = admin.permission;
}

module.exports = Admin;

Admin.prototype.save = function(callback){
    var admin = {
        name : this.name,
        password : this.password,
        permission : this.permission
    };
    var newAdmin = new adminModel(admin);

    newAdmin.save(function(err,admin){
        if(err){
            return callback(err);
        }
        callback(null,admin);
    })
};

Admin.getOne = function(name,callback){
    adminModel.findOne({'name':name},function(err,admin){
        if(err){
            return callback(err)
        }
        callback(null,admin);
    })
};

Admin.getAll = function(name,callback){
    var sql = {};
    if(name){
        sql.name = name
    }
    adminModel.find(sql,{
        'name':1,
        'permission':1
    },function(err,admins){
        if(err){
            return callback(err);
        }
        callback(null,admins)
    });
};

Admin.remove = function(name,callback){
    adminModel.remove({'name':name},function(err){
        if(err){
            return callback(err);
        }
        callback(null)
    })
};

Admin.update = function(doc,callback){
    adminModel.update({name:doc.name},{
        $set : {password:doc.password,permission:doc.permission}
    },function(err){
        if(err){
            return callback(err);
        }
        callback(null);
    })
};