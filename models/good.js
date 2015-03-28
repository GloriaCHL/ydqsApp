var goodModel = require('./dbModels').Good;

function Good(good){
    this.name = good.name;
    this.spec = good.spec;
    this.price = good.price;
    this.category = good.category;
    this.description = good.description;
    this.ad = good.ad;
}

module.exports = Good;

Good.prototype.save = function(callback){
    var item = {
        name : this.name,
        ad : this.ad,
        spec : this.spec,
        images : [],
        price : this.price,
        category:this.category,
        event:[],
        description:this.description,
        detail:''
    };
    var new_good = new goodModel(item);
    new_good.save(function(err,good){
        if(err){
            return callback(err);
        }
        callback(null,good)
    })
};

Good.getOne = function(id,callback){
    goodModel.findById(id,function(err,good){
        if(err){
            return callback(err);
        }
        callback(null,good);
    })
};

Good.getMany = function(){ // str,page,limit,callback || page is front of limit
    var sql = {},
        opts = {},
        _page = 0,
        callback = null;
    if(typeof arguments[0] == 'function'){
        callback = arguments[0];
        doSql();
    }else if(typeof arguments[0] == 'string' && typeof arguments[1] == 'function'){
        sql.name =arguments[0];
        callback = arguments[1];
        doSql();
    }else if(arguments.length==3){
        if(typeof arguments[0] == 'string'){
            sql.name = arguments[0];
            opts.limit = arguments[1];
            callback = arguments[2];
            doSql();
        }else if(typeof arguments[0] == 'number'){
            opts.limit = arguments[1];
            _page = arguments[0];
            callback = arguments[2];
            doSql();
        }
    }else if(arguments.length==4){
        sql.name = arguments[0];
        _page = arguments[1];
        opts.limit = arguments[2];
        callback = arguments[3];
        doSql();
    }
    function doSql(){
        goodModel.find(sql,null,opts,function(err,goods){
            if(err){
                return callback(err);
            }
            callback(null,goods);
        })
    }
};

Good.remove = function(id,callback){
    if(typeof id == 'string'){
        goodModel.remove({_id:id},function(err){
            if(err){
                return callback(err)
            }
            callback(null);
        })
    }else if(typeof id == 'array'){
        id.forEach(function(key,val){
            goodModel.remove({_id:val},function(err){
                if(err){
                    return callback(err)
                }
                callback(null);
            })
        })
    }
};

Good.update = function(id,params,callback){
    goodModel.update({'_id':id},{
        $set:params
    },function(err){
        if(err){
            return callback(err)
        }
        goodModel.findById(id,function(err,doc){
            if(err){
                return callback(err)
            }
            callback(null,doc);
        })
    })
};