const Teacher = require('../models/teacher');

module.exports.list = async function(req, res) {
    teacher = await Teacher.find({}).exec();

    function sortByKey(array, key) {
        return array.sort(function(a, b) {
          var x = a[key];
          var y = b[key];
          return ((x < y) ? 1 : ((x > y) ? -1 : 0));
        });
    }

    teacher = sortByKey(teacher, "studentsLike");

    return res.status(200).send({
        success : true,
        message : "List of teacher with decreasing student likes",
        teacher : teacher
    });
}

module.exports.register = async function(req, res) {
    teacher = await Teacher.findOne({email : req.body.email}).exec();

    if(teacher) {
        return res.status(200).send({
            success : false,
            message : "Teacher already exist",
            teacher : teacher
        });
    }

    const new_teacher = new Teacher({
        email : req.body.email,
        name : req.body.name,
        subject : req.body.subject,
        studentsLike : 0
    });

    new_teacher.save().then(teacher => {
        return res.status(200).send({
            success : true,
            message : "Teacher created successfully",
            teacher : teacher
        });
    }).catch(err => {
        return res.status(500).send({
            success : false,
            message : "Something went wrong",
            error : err
        });
    });
}