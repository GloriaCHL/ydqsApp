var GM = require('./dbModels').GM;

function GModel(gm){
    this.name = gm.name;
    this.spec = gm.spec;
    this.description = gm.description;
}

module.exports = GModel;

GModel.prototype.save = function(callback){
    var gModel = {
        name : this.name,
        spec : this.spec,
        description:this.description
    };
    var newGModel = new GM(gModel);
    newGModel.save(function(err){
        if(err){
            return callback(err)
        }
        callback(null)
    })
};

GModel.remove = function(id,callback){
    GM.remove({"_id":id},function(err){
        if(err){
            return callback(err)
        }
        callback(null)
    })
};

GModel.update = function(id,gmodel,callback){
    GM.update({'_id':id},{
        $set:{
            name:gmodel.name,
            spec:gmodel.spec
        }
    },function(err){
        if(err){
            return callback(err)
        }
        callback(null)
    })
};

GModel.getOne = function(id,callback){
    GM.findById(id,function(err,gmodel){
        if(err){
            return callback(err)
        }
        callback(null,gmodel)
    })
};

GModel.getAll = function(callback){
    GM.find({},function(err,gmodels){
        if(err){
            return callback(err)
        }
        callback(null,gmodels)
    })
};
