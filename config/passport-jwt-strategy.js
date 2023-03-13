const passport = require('passport')
const JWTStrategy=require('passport-jwt').Strategy;
const ExtractJWT=require('passport-jwt').ExtractJwt;

let opts= {
    jwtFromRequest : ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey:  'student&teacher'
}

Student = require('../models/student');

passport.use(new JWTStrategy(opts, async function(jwtPayload,done){
    await Student.findById(jwtPayload._id).populate({
        path : 'favouriteTeacher',
        populate : {
            path : 'student'
        },
        populate : {
            path : 'teacher'
        }
    }).then( student => {
        if (student) {
            return done(null, student);
        } else {
            return done(null, false);
        }
    }).catch(err => {
        return done(err, false);
    });
}));

module.exports = passport;