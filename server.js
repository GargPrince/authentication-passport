//Packages
var express=require('express');// For API and tempelating
var app=express();
var port=process.env.PORT || 3000;
var mongoose=require('mongoose'); //For DB
var passport=require('passport'); //For authentication
var flash=require('connect-flash'); 
var morgan=require('morgan'); //For ddetails of whats going on on server
var cookieParser=require('cookie-parser'); // For cookies
var bodyParser=require('body-parser'); // Parse json present in http request
var session=require('express-session'); //For sessions

var configDb=require('./config/database'); //DB URL

//Mongoose connection
mongoose.connect(configDb.url);

require('./config/passport')(passport); // pass passport for configuration

//setup our express application
app.use(morgan('dev')); //log every request to the console
app.use(cookieParser()); //read cookies(required for auth)
app.use(bodyParser()); //get/parses the information from http body

//set the engine to use as tempelate
app.set('engine', 'ejs');

//request for passport
app.use(session({secret: 'asecret'}));
app.use(passport.initialize());
app.use(passport.session()); //login session
app.use(flash()); // use connect-flash for flash messages stored in session

//routes
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

app.listen(port);