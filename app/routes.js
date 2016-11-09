var userModel= require('./models/user');
var bcrypt= require('bcrypt-nodejs');
module.exports= function(app, passport) {

    //Home
    app.get('/', function(req, res) {
        res.render('index.ejs');
    });

    app.get('/login', function(req, res) {
        // render the page and pass in any flash data if it exists
        res.render('login.ejs', {message: req.flash('Login Message!!!')});
    });

    //Sign-up form
    app.get('/signup', function(req, res) {
        res.render('signup.ejs', {message: req.flash('Signup Message!!!')});
    });

    //User prfile page
    app.get('/profile', isLoggedIn, function(req, res) {
        req.session.data=req.user;
        res.render('profile.ejs', {user: req.user});
    });

    //logout successfully
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    //Edit Profile
    app.get('/profile/edit', isLoggedIn, function(req, res) {
        res.render('edit.ejs', {user: req.session.data});
    });

    //Password Reset page
    app.get('/profile/resetPassword', isLoggedIn, function(req, res) {
        res.render('resetPassword.ejs', {user: req.session.data.local.uname, message: ""});
    });

    //Signup page
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    //Login page
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    //Profile update
    app.post('/profile/update', function(req, res) {
        userModel.findOneAndUpdate({"local.uname" : req.body.uname}, { "$set": {
                "local.fname": req.body.fname,
                "local.dob": req.body.dob,
                "local.email": req.body.email,
                "local.country": req.body.country,
                "local.contact.phone": req.body.prno,
                "local.contact.alternate": req.body.alno,
                "local.address": req.body.adr
            }
        }, {new : true}, function(err, data) {
            if(err) console.log(err.toString());
            if(!data) {
                res.render('profile.ejs', {user: req.user});
            }
            req.session.data=data;
            res.render('profile.ejs', {user: data});
        });
    });

//POST-Update password
app.post('/profile/upPass', function(req, res) {
    if(req.body.npass === req.body.cpass) {
        userModel.findOne({"local.uname" : req.body.uname}, function(err, data) {
            if(err) console.log(err.toString());
            else if(data) {
                if(bcrypt.compareSync(req.body.opass, data.local.password)) {
                data.local.password=bcrypt.hashSync(req.body.npass, bcrypt.genSaltSync(8), null);
                data.save(function(err, data) {
                    if(err) console.log(err.toString());
                    req.session.data=data;
                    res.render('profile.ejs', {user: data});
                });                
                }
                else {
                    res.render('resetPassword.ejs', {user: req.body.uname, message : "Wrong Password please try again!!!"});
                }
            }
            else {
                res.render('resetPassword.ejs', {user: req.body.uname, message : "Something went wrong please try again!!!"});
            }
        });
    }
    else {
        res.render('resetPassword.ejs', {user: req.body.uname, message : "Paaword and comfirm Password not matched please try again!!!"});
    }
});

//Function to check if the user is still logged in
    function isLoggedIn(req, res, next) {
        //if user is authenticate then carry on
        if(req.isAuthenticated()) return next();
        res.redirect('/');
    }
};