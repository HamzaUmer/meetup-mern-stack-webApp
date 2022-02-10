const express = require('express');
const postrouter = express.Router();
const mongoose = require('mongoose');
const requiredLogin = require('../middleware/requiredLogin');
const Post = mongoose.model("Post");

postrouter.get('/allPost',requiredLogin, (req,res) => {
    Post.find({})
    .populate("postedBy", "_id name pic")
    .populate("comments.postedBy", "_id name pic")
    .sort('-createdAt')
    .then((post)=> {
        res.json({post});
    })
    .catch((err)=> {
        console.log(err);
    })
})

postrouter.get('/followingPost',requiredLogin, (req,res) => {
    Post.find({postedBy:{$in: req.user.following}})
    .populate("postedBy", "_id name pic")
    .populate("comments.postedBy", "_id name pic")
    .sort('-createdAt')
    .then((post)=> {
        res.json({post});
    })
    .catch((err)=> {
        console.log(err);
    })
})

postrouter.post('/createPost',requiredLogin, (req, res) => {
    const {title, body, pic} = req.body;
    if(!title || !body ||!pic) {
        res.status(422).json({error:"Please add all the fields"});
    }
    req.user.password = undefined;
    const post = new Post({
        title,
        body,
        image:pic,
        postedBy: req.user
   })
   post.save()
   .then((result) => {
       res.json({post:result});
   })
   .catch((err) => {
       console.log(err);
   })
})

postrouter.get('/myPost', requiredLogin, (req, res) => {
    Post.find({postedBy:req.user._id})
    .populate('postedBy', "_id name")
    .then((mypost) => {
        res.json({mypost});
    })
    .catch((err) => {
        console.log(err);
    })
})

postrouter.put('/like', requiredLogin, (req,res) => {
    Post.findByIdAndUpdate(req.body.postId, {
        $push : {likes:req.user._id}
    }, {
        new:true
    }).exec((err,result) => {
        if (err) {

            return res.status(422).json({error:err})
        }
        else {
            res.json(result)
        }
    })
})

postrouter.put('/unlike', requiredLogin, (req,res) => {
    Post.findByIdAndUpdate(req.body.postId, {
        $pull : {likes:req.user._id}
    }, {
        new:true
    }).exec((err,result) => {
        if (err) {

            return res.status(422).json({error:err})
        }
        else {
            res.json(result)
        }
    })
})

postrouter.put('/comment', requiredLogin, (req,res) => {
    const comment = {
        text : req.body.text,
        postedBy: req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId, {
        $push : {comments:comment}
    }, {
        new:true
    })
    .populate("comments.postedBy", "_id name")
    .populate("postedBy", "_id name")
    .exec((err,result) => {
        if (err) {

            return res.status(422).json({error:err})
        }
        else {
            res.json(result)
        }
    })
})

postrouter.delete('/deletepost/:postId', requiredLogin, (req,res) => {
    Post.findOne({_id:req.params.postId})
    .populate("postedBy", "_id")
    .exec((err, post) => {
        if(err || !post) {
            return res.status(422).json({error:err})
        }
        if(post.postedBy._id.toString() === req.user._id.toString()){
            post.remove()
            .then((result)=> {
                res.json(result)
            }).catch((err) => {
                console.log(err)
            })
        }
    })
})
postrouter.delete('/deletecomment/:id/:comment_id', requiredLogin, (req,res) => {
    const comment = {_id:req.params.comment_id}
    Post.findByIdAndUpdate(req.params.id, 
    {
        $pull: {comments:comment}
    },
    {
        new:true
    }
    )
    .populate("comments.postedBy", "_id name")
    .populate("postedBy", "_id name")
    .exec((err, postcomment) => {
        if(err || !postcomment) {
            return res.status(422).json({error:err})
        }
        else {

            const result = postcomment
            res.json(result)
        }
            })
})

module.exports = postrouter;