const Post = require('../models/Post');

exports.viewCreateScreen = function(req, res) {
    res.render('create-post');
}

exports.create = function(req, res) {
    let post = new Post(req.body, req.session.user._id);
    post.create().then(function() {
        res.send('New post created');
    }).catch(function (err) {
        console.log(err);
        res.send('Error creating post');
    })
}

exports.viewSingle = async function(req, res) {
    try {
        let post = await Post.findSingleById(req.params.id);
        res.render('single-post-screen', {post: post});
    } catch (err) {
        res.render('404');
    }
}