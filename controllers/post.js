const { PrismaClient } = require('@prisma/client')
// const jwt = require("jsonwebtoken");

const prisma = new PrismaClient()


// Get all posts //
exports.getPost = async (req, res, next) => {
    const posts = await prisma.post.findMany()
    console.log(posts)
};