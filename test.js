var uuid = require('node-uuid');
var bcrypt= require('bcrypt-nodejs');

var id=uuid.v4();
console.log(id);

function hash(password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
    }

    // checking if password is valid
function comp(password, hashpassword) {
        return bcrypt.compareSync(password, hashpassword);
    }

var hashpassword=hash("pg");
    console.log("this is "+comp("pg", hashpassword));