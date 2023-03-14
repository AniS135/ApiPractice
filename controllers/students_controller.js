const Student = require('../models/student');
const Studentlike = require('../models/studentlike');
const Teacher = require('../models/teacher');
const mongoose = require('../config/mongoose');
const secretKey = process.env.SECRET_KEY;
const { hashSync } = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports.signUp = async function(req, res){
    if (req.body.password != req.body.confirm_password) {
        return res.json({
            message : 'Password and Confirm Password should be same'
        });
    }

    const user = await Student.findOne({email : req.body.email}).exec();

    if(!user) {
        const new_user = new Student({
            email : req.body.email,
            password : req.body.password,
            name : req.body.name,
            favouriteTeacher : []
        });

        new_user.save().then(user => {
            return res.status(201).send({
                success : true,
                message : "Student created successfully",
                user : {
                    id : user._id,
                    email : user.email,
                    name : user.name
                }
            })
        }).catch(err => {
            return res.status(500).send({
                success : false,
                message : "Something went wrong",
                error : err
            });
        });
    }
    else{
        return res.status(200).send({
            success : true,
            message : "Student already existing.",
            user : {
                id : user._id,
                email : user.email,
                name : user.name
            }
        });
    }
}

module.exports.login = async function(req, res){
    if(!req.body.email && !req.body.password) return res.send("Email and Password is required.");

    user = await Student.findOne({email : req.body.email}).then(user => {
        // No User Found
        if(!user){
            return res.status(400).send({
                success : false,
                message : "Could not find the user"
            });
        }

        if(user.password !== req.body.password){
            return res.status(400).send({
                success : false,
                message : "Incorrect email or password"
            });
        }

        const payload = {
            name : user.name,
            email : user.email,
            _id : user._id
        }

        jwt.sign(payload, secretKey, {expiresIn : '10000s'}, (err, token) => {
            if(err){
                return res.json({message : "Error in creating token. Try Again"});
            }

            return res.status(200).send({
                success : true,
                message : "Student Succesfully logged in",
                token : "Bearer " + token
            });
        });
    });
}


module.exports.profile = function(req, res){
    return res.status(200).send({
        success : true,
        user :{
            id : req.user._id,
            name : req.user.name,
            email : req.user.email,
            favouriteTeacher : req.user.favouriteTeacher
        }
    })
}

module.exports.favouriteTeacher = function(req, res){
    return res.status(200).send({
        success : true,
        list : req.user.favouriteTeacher
    });
}

module.exports.addTeacher = async function(req, res){
    const teacherExist = await Studentlike.findOne({
        student : req.user._id,
        teacher : req.body.id
    }).exec();

    if(teacherExist)
    {
        return res.status(200).send({
            success : false,
            message : 'Teacher already added in your favouirte list'
        });
    }

    try{
        favourate = await new Studentlike({
            student : req.user._id,
            teacher : req.body.id
        });

        await Student.findByIdAndUpdate(req.user._id,{$push: {favouriteTeacher : favourate}});
        await Teacher.findByIdAndUpdate(req.body.id,{$inc : {studentsLike : 1}});
        await favourate.save();

        return res.status(200).send({
            success : true,
            mmessage : "Successfully added teacher to favourite list"
        });
    }
    catch(err){
        return res.status(500).send({
            success : false,
            message : "Something went wrong",
            error : err
        });
    }
}

module.exports.removeTeacher = async function(req, res){
    const favourate = await Studentlike.findOne({
        student : req.user._id,
        teacher : req.body.id
    }).exec();

    if(!favourate) {
        return res.status(400).send({
            success : false,
            message : "Teacher is not present in favourite list"
        });
    }

    try{

        await Student.findByIdAndUpdate(req.user._id,{$pull: {favouriteTeacher : {_id : favourate._id}}});
        await Teacher.findByIdAndUpdate(req.body.id,{$inc : {studentsLike : -1}});
        await favourate.deleteOne();

        return res.status(200).send({
            success : true,
            mmessage : "Successfully removed teacher from favourite list"
        });
    }
    catch(err){
        return res.status(500).send({
            success : false,
            message : "Something went wrong",
            error : err
        });
    }
}
