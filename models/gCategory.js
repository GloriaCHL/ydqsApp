var gcModel = require('./dbModels').GC;

function gCategory(gc){
    this.name = gc.name;
    this.level = gc.level;
    this.parent = gc.parent;
}

module.exports = gCategory;

gCategory.prototype.save = function(callback){
    var newGC = new gcModel({
        name : this.name,
        level : this.level,
        parent : this.parent
    });
    newGC.save(function(err){
        if(err){
            return callback(err)
        }
        callback(null)
    })
};

gCategory.remove = function(id,callback){
    gcModel.findById(id,function(err,gc){
        if(err){
            return callback(err)
        }
        gcModel.remove({'parent':gc.name},function(err){
            if(err){
                return callback(err)
            }
        });
        gcModel.remove({'_id':id},function(err){
            if(err){
                return callback(err)
            }
            callback(null)
        })
    });
};

gCategory.update = function(id,param,callback){
    gcModel.update({'_id':id},{
        $set : {
            name:param.name,
            level:param.level,
            parent:param.parent
        }
    },function(err){
        if(err){
            return callback(err)
        }
        callback(null)
    })
};

gCategory.getOne = function(id,callback){
    gcModel.findById(id,function(err,gc){
        if(err){
            return callback(err)
        }
        callback(null,gc)
    })
};

gCategory.getAll = function(param,callback){
    var sql = {};
    if(typeof param == 'string'){
        sql.parent = param;
    }
    if(typeof param == 'number'){
        sql.level = param
    }
    gcModel.find(sql,function(err,gcs){
        if(err){
            return callback(err)
        }
        callback(null,gcs)
    })
};