var essayModel = require('./dbModels').Essay,
    markdown = require('markdown').markdown;

function Essay(essay){
    this.title = essay.title;
    this.category = essay.category;
    this.content = essay.content;
    this.author = essay.author;
}

module.exports = Essay;

Essay.prototype.save = function(callback){
    var date = new Date();
    var time = {
        date:date,
        year:date.getFullYear(),
        month:date.getFullYear()+'-'+(date.getMonth()+1),
        day:date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate(),
        minute:date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()+' '+(date.getHours()>10?date.getHours():'0'+date.getHours())+':'+(date.getMinutes()>10?date.getMinutes():'0'+date.getMinutes())
    };
    var essay = {
        title : this.title,
        category: this.category,
        content : this.content,
        author : this.author,
        time : time
    };
    var newEssay = new essayModel(essay);
    newEssay.save(function(err,essay){
        if(err){
            return callback(err)
        }
        callback(null,essay);
    })
};

Essay.remove = function(id,callback){
    essayModel.remove({_id:id},function(err){
        if(err){
            return callback(err);
        }
        callback(null);
    })
};

Essay.update = function(_id,essay,callback){
    var date = new Date();
    var time = {
        date:date,
        year:date.getFullYear(),
        month:date.getFullYear()+'-'+(date.getMonth()+1),
        day:date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate(),
        minute:date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()+' '+(date.getHours()>10?date.getHours():'0'+date.getHours())+':'+(date.getMinutes()>10?date.getMinutes():'0'+date.getMinutes())
    };
    essayModel.update({'_id':_id},{
        $set: {
            'author':essay.author,
            'title':essay.title,
            'content':essay.content,
            'category':essay.category,
            'time':time
        }
    },function(err){
        if(err){
            return callback(err);
        }
        callback(null);
    })
};

Essay.getOne = function(_id,action,callback){
    essayModel.findById(_id,function(err,essay){
        if(err){
            return callback(err);
        }
        if(action == 'get'){
            essay.content = markdown.toHTML(essay.content);
            return callback(null,essay)
        }else if(action == 'edit'){
            return callback(null,essay)
        }
    })
};

Essay.getMany = function(exp,page,limit,callback){
    var sql = {},
        options = {};
    if(!!exp){
        sql.title = /exp/i;
    }
    if(limit != -1){
        options.skip = (page-1)*10;
        options.limit = limit;
    }
    essayModel.count({},function(err,total){
        if(err){
            return callback(err);
        }
        essayModel.find(sql,null,options,function(err,essays){
            if(err){
                return callback(err);
            }
            essays.forEach(function(essay){
                essay.content = markdown.toHTML(essay.content);
            });
            callback(null,essays,total);
        })
    });
};