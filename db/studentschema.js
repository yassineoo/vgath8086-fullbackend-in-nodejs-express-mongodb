
const mongoose= require('mongoose');
const student = mongoose.Schema({
    firstName:{ 
        type:String,
        required : [true, "must have name"],
        trim : true,
        maxlength : [20,"name can not be ùore than 20 carecter"]
    } ,
    familyName:{ 
        type:String,
        required : [true, "must have name"],
        trim : true,
        maxlength : [20,"name can not be ùore than 20 carecter"]
    } ,
    group:{ 
        type:Number,
        required : [true, "must have a group"],
        trim : true,
        maxlength : [2,"group can not be more than 2 carecter"]
    } 
})

Std  = mongoose.model('Std',student);
module.exports = {Std}; 