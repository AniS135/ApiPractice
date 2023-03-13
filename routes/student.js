const express=require('express');
const router=express.Router();
const passport=require('passport');


studentController = require('../controllers/students_controller');

router.post('/sign-up', studentController.signUp);
router.post('/login', studentController.login);

router.get('/profile', passport.authenticate('jwt', {session : false}), studentController.profile);
router.get('/favourite-teacher', passport.authenticate('jwt', {session : false}), studentController.favouriteTeacher);

router.patch('/add-teacher', passport.authenticate('jwt', {session : false}), studentController.addTeacher);

module.exports = router;