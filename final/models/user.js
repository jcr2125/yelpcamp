var mongoose = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
     username: {
       type: String,
       unique: true,
       required: true
     },
     password: String,
     firstName: String,
     lastName: String,
     email: {
       type: String,
       unique: true,
       required: true
     },
     resetPasswordToken: String,
     resetPasswordExpires: Date,
     avatar: {
          type: String,
          default: "https://image.flaticon.com/icons/svg/149/149448.svg"
     },
     isAdmin:  {
          type: Boolean,
          default: false
     }
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);