const jwt = require('jsonwebtoken');
const Key = require("../config/config");
const mongoose = require('mongoose');
const User = mongoose.model('User');

module.exports = (req,res,next) => {
    const {authorization} = req.headers;
    if (!authorization) {
        res.status(401).json({error:"You must be Logged in"})
    }

    const token = authorization.replace("Bearer ", "");
    jwt.verify(token, Key.JWT_Secret, (err,payload) => {
        if(err) {
           res.status(401).json({error:"You must be Logged in"});
        }
        
        const {_id} = payload;
        User.findById({_id})
        .then((userData) => {
            req.user = userData;
            next();
        })
         
    })

}