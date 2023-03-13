const express = require("express");
const jwt = require('jsonwebtoken');

const db= require('./config/mongoose');
const { urlencoded } = require("express");

const session=require('express-session');
const passport = require('passport');
const passportJWT=require('./config/passport-jwt-strategy');

const app= express();

app.use(express.json());
app.use(express.urlencoded({extended : true}));

const port = 8000;

app.use('/',require("./routes/app"));

app.use(passport.initialize());

app.listen(port,function(err){
    if(err){
        console.log(`Error in running the server : ${err}`);
    }

    console.log(`Server is running on port ${port}`);
});

