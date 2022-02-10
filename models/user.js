const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types;

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    resetToken:String,
    expireToken: String,
    pic : {
      type: String,
      default: "https://res.cloudinary.com/hmn/image/upload/v1635752808/download_qyvd7u.jpg"
    },
    followers: [{
        type: ObjectId,
        ref: "User"
    }],
    following: [{
        type: ObjectId,
        ref: "User"
    }]
});

mongoose.model("User", userSchema);