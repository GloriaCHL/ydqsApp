var scpModel = require('./dbModels').SCP;

function Scp(scp){
    this.target = scp.target;
    this.specCP = scp.specCP;
}

module.exports = Scp;

Scp.prototype.save = function(callback){
    var scp = {
        target:this.target,
        specCP:this.specCP
    };
    var newScp = new scpModel(scp);
    newScp.save(function(err,doc){
        if(err){
            return callback(err)
        }
        callback(null,doc)
    })
};

Scp.getAll = function(callback){
    scpModel.find(function(err,docs){
        if(err){
            return callback(err)
        }
        callback(null,docs)
    })
};

Scp.getOne = function(target,callback){
    scpModel.findOne({'target':target},function(err,doc){
        if(err){
            return callback(err)
        }
        callback(null,doc)
    })
};

Scp.remove = function(target,callback){
    scpModel.remove({'target':target},function(err){
        if(err){
            return callback(err)
        }
        callback(null);
    })
};

Scp.update = function(target,param,callback){
    scpModel.update({target:target},{
        $set:{
            specCP:param
        }
    },function(err){
        if(err){
            return callback(err)
        }
        callback(null)
    })
};