//Strategy that we are using for login
LocalStrategy= require('passport-local').Strategy;

//var uuid = require('node-uuid');
//For Shema
var userModel=require('../app/models/user');
module.exports= function(passport) {
    /************** SIGN UP *******************/
    // passport needs ability to serialize and unserialize users out of session
    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        userModel.findById(id, function(err, user) {
            done(err, user);
        });
    });

    //Using local strategy
    passport.use('local-signup', new LocalStrategy({
        usernameField : 'uname',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    }, function(req, uname, password, done) {
        //userModel will not fire unless data is sent back
        process.nextTick(function() {
            userModel.findOne({ 'local.uname' : uname }, function(err, user) {
                if(err) return done(err);
                if(user) {
                    return done(null, false, req.flash( 'signupMessage', 'You already have an account' ));
                }
                else {
                    var user = userModel();

                    //setup user's local credentials
                    //user.local('_id')=uuid.v4();
                    user.local.fname=req.param('fname');
                    user.local.dob=req.param('dob');
                    user.local.email=req.param('email');
                    user.local.country=req.param('country');
                    user.local.contact.phone=req.param('prno');
                    user.local.contact.alternate=req.param('alno');
                    user.local.address=req.param('adr');
                    user.local.uname=uname;
                    user.local.password=user.generateHash(password);
                    user.local.status=true;
                    /*req.session.data={
                        _id:req.param('_id'),
                        fname: req.param('fname'),
                        dob: req.param('dob'),
                        email: req.param('email'),
                        country: req.param('country'),
                        contact: {
                        phone: req.param('prno'),
                        alternate: req.param('alno')
                        },
                        address: req.param('adr')
                    };*/

                    //save the user
                    user.save(function(err, data) {
                        if(err) throw err;
                        console.log(data);
                        return done(null, data);
                    });
                }
            });
        })
    }));

    /**************************************LOGIN *************************************/
    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'uname',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    }, function(req, uname, password, done) {
        userModel.findOne({'local.uname': uname}, function(err, data) {
            if(err) return done(err);
            if(!data) return done(null, false, req.flash('loginMessage', 'NO USER FOUND!!!'));
            if(!data.validPassword(password)) return done(null, false, req.flash('loginMessage', 'OOPS... Wrong Password:-]'));
            req.session.data=data;
            console.log("primary"+data);
            console.log("secondary"+req.session.data);
            return done(null, data);
        });
    }));
};