const { PrismaClient } = require('@prisma/client')
// const jwt = require("jsonwebtoken");

const prisma = new PrismaClient()


// Get all posts //
exports.getAllPosts = async (req, res, next) => {
    const posts = await prisma.post.findMany({
        orderBy: [
            {
                createdAt: 'desc',
            },
        ],
    })
    .then(posts => res.status(200).json(posts))
    .catch(error => res.status(404).json({ message: error.message }));
};