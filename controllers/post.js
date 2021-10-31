const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const connectdb = require('../connectdb.js');
const mysql = require('mysql');
const jwt = require('jsonwebtoken');

const PostModels = require('../Models/PostModels.js');
let postModels = new PostModels();

/* Create a post */
exports.createPost = async (req, res, next) => {

    console.log('req.body -> ' + JSON.stringify(req.body));
    console.log('req.file -> ' + JSON.stringify(req.file));


    let content = req.body.content;
    let author_id = req.body.author_id;
    let imgUrl = req.body.imgUrl;

    
    let sqlInserts = [content, author_id, imgUrl];
    console.log('SQL inserts' + sqlInserts);
    postModels.createPost(sqlInserts)
        .then((response) => {
            res.status(201).json(JSON.stringify(response));                 //should refresh here
        })
        .catch((error) => {
            console.error(error);
            res.status(400).json({ error })
        })
};

    // if (req.file) {
    //     post = {
    //         ...post,
    //         imgURL: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    //     };
    // }

/* Get all posts */

exports.getAllPosts = async (req, res, next) => {
    const posts = await prisma.post.findMany({
        orderBy: {
            created_at: 'desc',
        },
        include: {
            author: true,
            comments: true,
            likes: true,
            _count: {
                select: {
                    comments: true,
                    likes: true
                }
            }
        },
    })
        .then(posts => res.status(200).json(posts))
        .catch(error => res.status(404).json({ message: error.message }));
};