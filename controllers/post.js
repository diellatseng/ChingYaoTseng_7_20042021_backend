const connectdb = require('../connectdb.js');
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const fs = require('fs');

const PostModels = require('../Models/PostModels.js');
let postModels = new PostModels();

/* Create post */
exports.createPost = async (req, res, next) => {
    let content = req.body.content;
    let author_id = req.body.author_id;
    let sqlInserts = [content, author_id];
    await postModels.createPost(sqlInserts)
        .then((response) => {
            res.status(201).json(JSON.stringify(response));
        })
        .catch((error) => {
            console.error(error);
            res.status(400).json({ error })
        })
};

/* Get all posts */
exports.getAllPosts = async (req, res, next) => {
    await postModels.getAllPosts()
        .then((response) => {
            // console.log(response);
            res.status(200).json(response);
        });
}

/* Modify post */
exports.updatePost = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.TOKEN);
    const author_id = decodedToken.userId;
    // let content = req.body.content;
    let postId = req.params.id;
    if (req.file) {
        console.log('Controller updatePost: req.file -> ' + req.file)
    }
    let img_url = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    let sqlInserts1 = [postId];
    let sqlInserts2 = [img_url, postId, author_id];
    postModels.updatePost(sqlInserts1, sqlInserts2)
        .then((response) => {
            res.status(201).json(JSON.stringify(response));
        })
        .catch((error) => {
            console.log(error);
            res.status(400).json(JSON.stringify(error));
        })
}

/* Delete post */
exports.deletePost = async (req, res, next) => {
    let postId = req.params.id;
    let sqlInsert = [postId];
    let file = "";

    // Check if the post has an image
    await postModels.getImage(sqlInsert)
        .then((response) => {
            console.log('controller, getImage resonse: ' + JSON.stringify(response[0].img_url));

            if (response[0] !== null) {
                const filename = response[0].img_url.split(/images/)[1];
                file = filename;
                console.log('filename: ' + file)
            } else {
                return file = "";
            }
        })
        .catch((error) => {
            console.log(error);
            res.status(400).json(JSON.stringify(error));
        })

    
    // If an image is found in post, delete it from server
    if (file !== '') {
        fs.unlink(`images${file}`, (err) => {
            if (err) throw err;
        })
    }
    // And then delete the post(data row) from database
    await postModels.deletePost(sqlInsert)
        .then(() => res.status(200).json({ message: 'Image deleted!' }))
        .catch(error => res.status(400).json({ message: error.message }));

}

//////// COMMENTS ////////
/* Get all comments */
exports.getComments = async (req, res, next) => {
    let postId = req.params.id;
    await postModels.getComments(postId)
        .then((response) => {
            console.log(response);
            res.status(200).json(response);
        });
}

/* Create comment */
exports.createComment = async (req, res, next) => {
    let content = req.body.content;
    let author_id = req.body.author_id;
    let post_id = req.params.id;

    let sqlInserts = [content, author_id, post_id];
    await postModels.createComment(sqlInserts)
        .then((response) => {
            res.status(201).json(JSON.stringify(response));
        })
        .catch((error) => {
            console.error(error);
            res.status(400).json({ error })
        })
};

/* Delete comment */
exports.deleteComment = async (req, res, next) => {
    let postId = req.params.postId;
    let commentId = req.params.commentId;
    let sqlInsert = [postId, commentId];

    postModels.deleteComment(sqlInsert)
        .then((response) => res.status(200).json({ message: response.message }))
        .catch(error => res.status(400).json({ message: error.message }));

}

//////// LIKES ////////
/* Like a post */
exports.likePost = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.TOKEN);
    const author_id = decodedToken.userId;
    const postId = req.params.id;

    const sqlInserts1 = [postId, author_id];
    postModels.likePost(sqlInserts1)
        .then((response) => {
            res.status(201).json(response);
        })
        .catch((error) => {
            console.log(error);
            res.status(400).json(JSON.stringify(error));
        })

    // const post_id = req.body
    console.log("author_id: " + author_id);
    console.log("postId: " + postId);
    console.log(JSON.stringify(req.body));
}