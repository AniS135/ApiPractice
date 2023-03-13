const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    favouriteTeacher: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Studentlike'
        }
    ]
}, {
    timestamps : true
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;