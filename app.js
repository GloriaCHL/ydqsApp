var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multer = require('multer');

var flash = require("connect-flash");
var session = require('express-session');
var settings = require('./settings');
var MongoStore = require('connect-mongo')(session);

var routes = require('./routes/index'),
    serverRoutes = require("./routes/serverRoutes");

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'public/views/'));
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//www.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret:settings.cookieSecret,
    key : settings.db,
    cookie:{/*maxAge:1000*60*60*10*/}, // 10 hour
    store : new MongoStore({
        db:settings.db,
        host:settings.host,
        port:settings.port
    })
}));

// 根据 js 顺序执行的特性，flash 在 routes 控件中需要使用，故需要比 routes 更早的执行初始化
app.use(flash());

app.use(multer({dest:"./public/cacheImg/",limits:{fileSize:100000000}}));

app.use('/admin',serverRoutes, function(req,res){
    //res.sendFile(path.join(__dirname,'public/views/server/Layout.html'));
    res.sendfile('public/server/views/Layout.html');
});
app.use('/',routes, function(req,res){
    res.sendFile(path.join(__dirname,'public/www/views/index.html'))
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.listen(3000,function(){
    console.log("App listen to Part 3000");
});

module.exports = app;
