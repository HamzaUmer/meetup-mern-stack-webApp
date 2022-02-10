const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const JWT = require('jsonwebtoken');
const Secret = require('../config/config');
const requiredLogin = require('../middleware/requiredLogin');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const {SENDGRID_API,EMAIL} = require('../config/config');


const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key:SENDGRID_API
    }
}))


router.post('/signup', (req,res) => {
    const {name, email, password, pic} = req.body;
    if(!email || !name || !password) {
        return res.status(422).json({error: "Please add all Fields!!"});
    }
    User.findOne({email:email})
    .then((savedUser) => {
        if (savedUser) {
            return res.status(403).json({error: "User already exist with email!!"});
        }
        bcrypt.hash(password, 12)
        .then((hashedPassword) => {
            const user = new User({
                email,
                name,
                password : hashedPassword,
                pic
            })
             user.save()
            .then((user) => {
                transporter.sendMail({
                    to: user.email,
                    from: "mirzahamzaumer@gmail.com",
                    subject: "signup success",
                    html: "<h1>Welcome to meetUp</h1>"
                })
                res.json({message:"Signin Successfully!!"})
            })
            .catch((err)=> {
                console.log(err);
            })
        })
    })
    .catch((err)=> {
        console.log(err);
    })
})

router.post('/signin', (req,res) => {
    const {email, password} = req.body;
    if(!email || !password){
        return res.status(422).json({error:"Please add email or password"});
    }
    User.findOne({email:email})
    .then((savedUser) => {
        if (!savedUser) {
            return res.status(422).json({error:"Invalid email or password"});
        }
        bcrypt.compare(password, savedUser.password)
        .then((doMatch) => {
            if (doMatch) {
                //res.json({message:"Successfully Logged in !!"})
                const token = JWT.sign({_id: savedUser._id}, Secret.JWT_Secret);
                const {_id,name,email,followers,following,pic} = savedUser;
                res.json({token, user:{_id,name,email,followers,following,pic}});
            }
            else {
                return res.status(422).json({error:"Invalid email or password"});
            }
        })
        .catch((err) => {
            console.log(err);
        })
    })
})

router.post('/reset-password', (req,res) => {
    crypto.randomBytes(32, (err, buffer) => {
        if(err) {
            console.log(err)
        }
        const token = buffer.toString("hex")
        User.findOne({email:req.body.email})
        .then((user) => {
            if(!user) {
                return res.status(422).json({error:"User does not exists with this email"})
            }
            user.resetToken = token
            user.expireToken = Date.now() + 36000000
            user.save().then((result) => {
                transporter.sendMail({
                    to: user.email,
                    from: "mirzahamzaumer@gmail.com",
                    subject: "password reset",
                    html:`
                    <p>You requested for password reset</p>
                    <h5>click in this <a href="${EMAIL}/reset/${token}">link</a> to reset password</h5>
                    `
                })
                res.json({message:"check your email"})
            })
        })
    })
})

router.post('/new-password', (req,res) => {
    const newPassword = req.body.password
    const sentToken = req.body.token
    User.findOne({resetToken: sentToken, expireToken:{$gt:Date.now()}})
    .then((user)=> {
        if(!user) {
            return res.status(422).json({error:"Try again session expired"})
        }
        bcrypt.hash(newPassword,12).then(hashedpassword => {
            user.password = hashedpassword
            user.resetToken = undefined
            user.expireToken = undefined
            user.save().then((saveduser)=> {
                res.json({message: "password updated successfully"})
            })
        })
    }).catch((err) => {
        console.log(err)
    })
})

module.exports = router;