const connectdb = require('../connectdb.js');
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const fs = require('fs');

const PostModels = require('../Models/PostModels.js');
let postModels = new PostModels();

const { PrismaClient } = require('@prisma/client');
const { findSync } = require('@prisma/client/runtime');
const prisma = new PrismaClient()

// Functions using traditional way to query database

/* Create a post */
exports.createPost = async (req, res, next) => {
    let content = req.body.content;
    let author_id = req.body.author_id;
    let sqlInserts = [content, author_id];
    postModels.createPost(sqlInserts)
        .then((response) => {
            res.status(201).json(JSON.stringify(response));                 //should refresh here
        })
        .catch((error) => {
            console.error(error);
            res.status(400).json({ error })
        })
};

/* Get all posts */
exports.getAllPosts = async (req, res, next) => {
    const posts = await prisma.post.findMany({
        orderBy: {
            created_at: 'desc',
        },
        include: {
            author: true,
            comments: {
                include: {
                    author: true
                }
            },
            likes: true,
            _count: {
                select: {
                    comments: true,
                    likes: true
                }
            }
        },
    })
        .then(posts => {
            return res.status(200).json(posts)
        })
        .catch(error => res.status(404).json({ message: error.message }));
};

/* Modify a post */
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

/* Delete a post */
exports.deletePost = async (req, res, next) => {
    let postId = req.params.id;
    let sqlInsert = [postId];
    
    let file = "";
    
    await postModels.getImage(sqlInsert)
        .then((response) => {
            const filename = response[0].img_url.split(/images/)[1];
            console.log('1 : ' + filename);
            file = filename;
        })
        .catch((error) => {
            console.log(error);
            res.status(400).json(JSON.stringify(error));
        })
        
    if (file !== '') {
        fs.unlink(`images${file}`, (err) => {
            if (err) throw err;
            console.log('2: Image unlinked.')
        })
    }

    await postModels.deletePost(sqlInsert)
        .then(() => res.status(200).json({ message: 'Image deleted!' }))
        .catch(error => res.status(400).json({ message: error.message }));
        
}
