const mongoose = require('mongoose');

const teacherSchema = mongoose.Schema({
    email : {
        type : String, 
        required : true, 
        unique : true
    },
    name : {
        type : String,
        required : true
    },
    subject : {
        type : String,
        required : true
    },
    studentsLike : {
        type : Number,
        required : true
    }
});

const Teacher = mongoose.model('Teacher', teacherSchema);

module.exports = Teacher;

