const { PrismaClient } = require('@prisma/client')
// const jwt = require("jsonwebtoken");

const prisma = new PrismaClient()


/* Create a post */
exports.createPost = async (req, res, next) => {
    let post = {
        author_id: Number(req.body.author_id),
    }

    if (req.body.message !== undefined && req.body.message !== "") {
        post = {
            ...post,
            message: req.body.message
        };
    }

    // if (req.file) {
    //     post = {
    //         ...post,
    //         imgURL: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    //     };
    // }

    console.log(post);
    const createdPost = await prisma.post.create({
        data: post,
    })
    .then(() => res.status(201).json({message: 'The post has been created'}))
    .catch(error => res.status(400).json({message: error.message, data: post}));
}

// Get all posts //
exports.getAllPosts = async (req, res, next) => {
    const posts = await prisma.post.findMany({
        orderBy: {
            created_at: 'desc',
        },
        include:{
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