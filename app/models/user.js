var mongoose=require('mongoose');
var bcrypt= require('bcrypt-nodejs');
var schema=mongoose.Schema;

//Make schema
var userSchema= new schema({
    local : {
        fname: String,
        dob: String,
        email: String,
        country: String,
        contact: {
         phone: String,
         alternate: String
        },
        address: String,
        uname: String,
        password: String,
        status: Boolean
    },
    facebook         : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    },
    twitter          : {
        id           : String,
        token        : String,
        displayName  : String,
        username     : String
    },
    google           : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    }
});
    //generate a hash
    userSchema.methods.generateHash= function(password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
    };

    // checking if password is valid
    userSchema.methods.validPassword = function(password) {
        return bcrypt.compareSync(password, this.local.password);
    };

    // create the model for users and expose it to our app
    module.exports = mongoose.model('works', userSchema);