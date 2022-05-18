const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { type } = require('express/lib/response');
const subject = require('./subject');
const Schema = mongoose.Schema;

const subjectSchema = new Schema({
    subjectName: {type:String},
    subjectGrade :{type:String}
});

const userSchema = new Schema({
    username: {type: String},
    password: {type: String},
    usertype: {type: String},
    teaches:  {type: mongoose.Types.ObjectId, ref:subject},
    learning: [subjectSchema],
    email:    {type: String},
    phone:    {type: Number},
    degree:   {type: String},
    image :   {type:String}
});

userSchema.pre('save',function(next){
    const user = this;

    bcrypt.hash(user.password,10,(err,hash)=>{
        user.password = hash;
        next();
    });
});
const user = mongoose.model('user',userSchema);

module.exports = user;