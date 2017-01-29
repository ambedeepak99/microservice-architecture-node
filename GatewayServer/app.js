var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//region microservice-gateway example

//microservice-gateway configuration object
var microServiceConfig = {
    name: "MicroServiceGateway", // gateway name
    // sslKeyPath,sslCertPath,sslBundlePath,verifySSL are use for creating secure proxy server object
    sslKeyPath: "files/localhost.key", // ssl key file path
    sslCertPath: "files/localhost.cert", // ssl certificate file path
    sslBundlePath: [], // ssl bundle certificates file path
    verifySSL: false, // true/false, if you want to verify the SSL Certs
    // following are the list of micro-services
    microServiceList: [
        {
            name: "MicroService-1", // micro-service name
            url: "http://localhost", // micro-service URL
            serverPort: "3001", // micro-service port
            routePath: "ms1", // route path to identify in gateway server to forward request into corresponding micro-service
            excludeRoutePath: true // if true then it exclude routePath from forwarded request
        },
        {
            name: "MicroService-2",
            url: "http://localhost",
            serverPort: "3002",
            routePath: "ms2",
            excludeRoutePath: true
        }
    ]
};
try {
    // Create gateway object [contains micro-services functions]
    var msGateway = require('microservice-gateway').createGateway(microServiceConfig);
    app.all("/ms1/*", msGateway['ms1']); // call micro-service function using corresponding routePath key [no special character allow in routePath]
    app.all("/ms2/*", msGateway['ms2']);
}
catch (e) {
    console.log(e.name, e.message);
}
//endregion

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
