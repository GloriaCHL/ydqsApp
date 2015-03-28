var mongoose = require('mongoose'),
    settings = require('../settings'),
    Schema = mongoose.Schema;
    mongoose.connect('mongodb://'+settings.host+"/"+settings.db);

/**
 * Admin 表
 * @type {Mongoose.Schema}
 */
var adminSchema = new Schema({
    'name':String,
    'password':String,
    'permission':{type:Number,Default:3}
},{
    collection:"admins"
});
var adminModel = mongoose.model("Admin",adminSchema);

/**
 * Essay 表
 * @type {mongoose.Schema}
 */
var essaySchema = new Schema({
    'title':String,
    'category':String,
    'content':String,
    'author':String,
    'time':{
        date : String,
        year : String,
        month : String,
        day : String,
        minute : String
    }
},{
    collection:'essays'
});
var essayModel = mongoose.model('Essay',essaySchema);

/**
 * Good 表
 * @type {mongoose.Schema}
 */
var goodSchema = new Schema({
    'name':String,
    'ad':String,
    'category':[String],
    'spec':[Schema.Types.Mixed],
    'events':[String],
    'images':[String],
    'rating':{type:Number,default:0},
    'favor':{type:Number,default:0},
    'date':Date,
    'description':String,
    'price':Number,
    'detail':String
},{
    collection:'goods'
});
var goodModel = mongoose.model('Good',goodSchema);

/**
 * 商品模型表 good schema
 * @type {Mongoose.Schema}
 */
var gmSchema = new Schema({
    name:String,
    spec:[String],
    description:String
},{
    collection:'goodModels'
});
var gmModel = mongoose.model('GM',gmSchema);

/**
 * 商品类别表 good category
 * @type {Schema}
 */
var gcSchema = new Schema({
    name:String,
    level:{type:Number,default:0},
    parent:String
},{
    collection:'goodCategorys'
});
var gcModel = mongoose.model('GC',gcSchema);

var specCPSchema = new Schema({
    target:String,
    specCP:[Schema.Types.Mixed]
},{
    collection:'specCP'
});
var scpModel = mongoose.model('SCP',specCPSchema);

module.exports = {
    'Admin':adminModel,
    'Essay':essayModel,
    'Good':goodModel,
    'GM':gmModel,
    'GC':gcModel,
    'SCP':scpModel
};