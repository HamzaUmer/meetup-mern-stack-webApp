const express = require('express');
const app = express();
const Port = process.env.PORT || 5000;
const mongoose = require('mongoose');
const key = require('./config/config');

mongoose.connect(key.MongoURI);

mongoose.connection.on('connected', () => {
    console.log("Connected to Mongo Successfully!!");
})

mongoose.connection.on('error', (err) => {
    console.log("Error Found!!", err);
})

require('./models/user');
require('./models/post');

app.use(express.json());
app.use(require('./routes/auth'));
app.use(require('./routes/postRouter'));
app.use(require('./routes/userRouter'));

if(process.env.NODE_ENV=="production"){
    app.use(express.static('client-side/build'))
    const path = require('path')
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,'client-side','build','index.html'))
    })
}
app.listen(Port, () => {
    console.log("Server is running on ", Port);
})