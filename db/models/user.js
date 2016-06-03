var mongoose = require('mongoose');

module.exports = mongoose.model("Users", {
    loginName: String,
    password: String,
    name: String,
    phoneNo: String,
    email: String,
    data:{}
});