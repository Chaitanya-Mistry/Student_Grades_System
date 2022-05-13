const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subjectSchema = new Schema({
    title:{type:String},
    credit:{type:Number},
    isAssigned : {type:Boolean}
});

const subject = mongoose.model('subject',subjectSchema);

module.exports = subject;