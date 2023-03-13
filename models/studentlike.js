const mongoose = require('mongoose');

const studentlikeSchema = new mongoose.Schema({
    student : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Student'
    },
    teacher : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Teacher'
    }
},{
    timestamps : true
});

const Studentlike = mongoose.model('Studentlike', studentlikeSchema);

module.exports = Studentlike;