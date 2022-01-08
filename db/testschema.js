
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
        maxlength : [20,"name can not be ùore than 20 carecter"]
    } ,
    time: {
        type : Number , 
        required : [true, "must have name"]
    },
    submission:{ 
        type:String,
        required : [true, "must have name"],
    },
    note:{
        type : String,
        default: 'not marked yet'
    }

})

const testSchema = mongoose.Schema({
    testid:{ 
        type:String,
        required : [true, "must have name"],
        trim : true,
        
    } ,
    time: {
        type : Number , 
        
    },
    startTime: {
        type : Date , 
        default: Date.now 
    }
    , 
    testStudents:{
        type : [student] ,
        default :[]

    }
    ,
    testPassword:{ 
        type:Number,
        required : [true, "must have name"],
        trim : true,
    }
    
})
Test = mongoose.model('Test',testSchema);
module.exports = {Test}; 