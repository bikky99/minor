const postsCollection = require('../db').db().collection('posts');
const ObjectId = require('mongodb').ObjectID;
const User = require('./User');
let Post = function (data, userid){
    this.data = data;
    this.errors = [];
    this.userid = userid;
}

Post.prototype.cleanUp = function () {
    if (typeof this.data.title != 'string') {this.data.title = ''}
    if (typeof this.data.body != 'string') {this.data.body = ''}
    // get rid of any bogus properties

    this.data = {
        title: this.data.title.trim(),
        body: this.data.body.trim(),
        // tags: this.data.tags,
        author: ObjectId(this.userid),
        createdDate: new Date(),
        // updated: this.data.updated,
    }
}

Post.prototype.validate = function () {
    if (this.data.title == '') {this.errors.push('You must provide a title.')}
    if (this.data.body == '') {this.errors.push('You must provide post content.')}
}

Post.prototype.create = function () {
    return new Promise((resolve, reject) => {
        this.cleanUp();
        this.validate();
        if (!this.errors.length) {
            // save post into database
            postsCollection.insertOne(this.data).then(() => {
                resolve();
            }).catch(() => {
                this.errors.push('Please try again later.');
                reject(this.errors);
            })
        } else {
            reject(this.errors);
        }
    })

}

Post.findSingleById = function (id) {
    return new Promise (async function (resolve, reject) {
        if (typeof(id) != 'string' || !ObjectId.isValid(id)) {
            reject();
            return;
        }
        let posts = await postsCollection.aggregate([
            {$match: {_id: new ObjectId(id)}},
            {$lookup: {
                from: 'users',
                localField: 'author',
                foreignField: '_id',
                as: 'authorDocument'
            }},
            {
                $project: {
                    title: 1,
                    body: 1,
                    createdDate: 1,
                    author: {
                        $arrayElemAt: [
                            '$authorDocument',0]
                    }
                }
            }
        ]).toArray()
        //clean up author property in each post object

        posts = posts.map(function (post) {
            post.author = {
                username: post.author.username,
                avatar: new User(post.author, true).avatar
            }
            return post;
        })
     
            if (posts.length) {
                console.log(posts[0]);
                // post = new Post(post, post.author);
                // post.data.id = post.data._id;
                resolve(posts[0]);
            } else {
                reject();
            }
    })

}

module.exports = Post;
