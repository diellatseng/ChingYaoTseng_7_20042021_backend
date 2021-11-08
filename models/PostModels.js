const connectdb = require('../connectdb.js');
const mysql = require('mysql');

class PostModels {

    getAllPosts() {
        let sql = "SELECT p.id, p.author_id, p.content, p.created_at, p.img_url, GROUP_CONCAT(u.id ORDER BY u.id) AS likes, COUNT(l.id) AS _count_likes, u_2.full_name, (SELECT COUNT(c.id) FROM comment c WHERE c.post_id = p.id ) AS _count_comments FROM post p LEFT JOIN `like` l ON l.target_id = p.id LEFT JOIN user u ON l.author_id = u.id INNER JOIN user u_2 ON p.author_id = u_2.id GROUP BY p.id ORDER BY p.created_at DESC";

        //  ----------- -----------      Formatted      ----------------------  //
        //  SELECT
        //      p.id, p.author_id, p.content, p.created_at, p.img_url, 
        //      GROUP_CONCAT(u.id ORDER BY u.id) AS likes, 
        //      COUNT(l.id) AS _count_likes, u_2.full_name, 
        //      (SELECT COUNT(c.id) FROM comment c WHERE c.post_id = p.id ) AS _count_comments 
        //  FROM post p 
        //  LEFT JOIN `like` l ON l.target_id = p.id 
        //  LEFT JOIN user u ON l.author_id = u.id 
        //  INNER JOIN user u_2 ON p.author_id = u_2.id 
        //  GROUP BY p.id 
        //  ORDER BY p.created_at DESC
        //  ----------- -----------         End         ----------------------  //

        return new Promise((resolve, reject) => {
            connectdb.query(sql, function (err, result, fields) {
                if (err) reject(err);
                resolve(result)
            });
        })
    }

    getPost(sqlInsert) {
        let sql = "SELECT * FROM post WHERE id = ?";
        sql = mysql.format(sql, sqlInsert);
        return new Promise((resolve, reject) => {
            connectdb.query(sql, function (err, result, fields) {
                if (err) reject(err);
                resolve(result)
            });
        })
    }

    createPost(sqlInserts) {
        let sql = 'INSERT INTO post (`content`, `author_id`) VALUES( ?, ?)';
        sql = mysql.format(sql, sqlInserts);
        return new Promise((resolve, reject) => {
            connectdb.query(sql, function (err, result) {
                if (err) reject(err);
                resolve({
                    data: {
                        postId: result.insertId,
                        postContent: sqlInserts[0],
                    },
                    message: 'New post created!'
                });
            })
        })
    }

    updatePost(sqlInserts) {
        const postId = sqlInserts[0];
        const content = sqlInserts[1];
        const author_id = sqlInserts[2];
        const img_url = sqlInserts[3];

        let sql1 = 'SELECT * FROM post where id = ?';
        sql1 = mysql.format(sql1, postId);

        return new Promise((resolve, reject) => {
            // Check if post exist
            connectdb.query(sql1, function (err, result, fields) {
                if (err) reject(err);
                if (author_id == result[0].author_id) {
                    // If original post has an image, save url as old_url
                    // With this old_url, we can delete old image before saving the uploaded image
                    const old_url = result[0].img_url;

                    // update content (text)
                    let sql2 = 'UPDATE post SET content = ? WHERE id = ? AND author_id = ?';
                    sql2 = mysql.format(sql2, [content, postId, author_id]);
                    connectdb.query(sql2, function (err, result, fields) {
                        if (err) console.log(err);

                        // If an image is uploaded while modifying post,
                        // update post with uploaded image.

                        if (img_url != null) {
                            let sql3 = 'UPDATE post SET img_url = ? WHERE id = ? AND author_id = ?';
                            sql3 = mysql.format(sql3, [img_url, postId, author_id]);
                            connectdb.query(sql3, function (err, result, fields) {
                                if (err) console.log(err);

                                // If original post did not have an image, 
                                // resolve request with success message
                                if (old_url == null) {
                                    resolve({ message: 'Post updated.' })
                                }
                                // If original post had an image, resolve request with "old_url"
                                resolve({ old_url: old_url });
                            })

                            // If an image is uploaded while modifying post,
                            // resolve request with success message.
                        } else {
                            resolve({ message: 'Post updated.' })
                        }
                    })
                }
            })
        })
    }

    getImage(sqlInsert) {
        let sql1 = 'SELECT img_url FROM post WHERE id = ?';
        sql1 = mysql.format(sql1, sqlInsert);
        return new Promise((resolve, reject) => {
            connectdb.query(sql1, function (err, result) {
                if (err) reject(err);
                resolve(result);
            })
        })
    }

    deletePost(sqlInsert) {
        const post_id = sqlInsert;

        let sql1 = 'SELECT * FROM post WHERE id = ?';
        sql1 = mysql.format(sql1, post_id);
        return new Promise((resolve, reject) => {
            connectdb.query(sql1, function (err, result) {
                if (err) console.log(err);
                if (result[0].img_url === null) {
                    let sql2 = 'DELETE FROM post WHERE id = ?';
                    sql2 = mysql.format(sql2, post_id);
                    connectdb.query(sql2, function (err, result, fields) {
                        if (err) reject(err);
                        resolve({ img_url: '' });
                    })
                }
                else {
                    let img_url = result[0].img_url;
                    let sql2 = 'DELETE FROM post WHERE id = ?';
                    sql2 = mysql.format(sql2, post_id);
                    connectdb.query(sql2, function (err, result, fields) {
                        if (err) console.log(err);
                        resolve({ img_url: img_url });
                    })
                }
            })
        })
    }

    likePost(sqlInserts1) {
        const post_id = sqlInserts1[0];
        const author_id = sqlInserts1[1];

        let sql1 = 'SELECT * FROM `like` where target_id = ? AND author_id = ?';
        sql1 = mysql.format(sql1, [post_id, author_id]);
        return new Promise((resolve, reject) => {
            connectdb.query(sql1, function (err, result, fields) {
                if (err) reject(err);
                if (result == '') {
                    let sql2 = 'INSERT INTO `like`(author_id, target_id) VALUES (?, ?)';
                    sql2 = mysql.format(sql2, [author_id, post_id]);
                    connectdb.query(sql2, function (err, result, fields) {
                        if (err) reject(err);
                        resolve({ like: true });
                    })
                }
                else if (sqlInserts1[1] == result[0].author_id) {
                    let sql3 = 'DELETE FROM `like` WHERE author_id = ? AND target_id = ?';
                    sql3 = mysql.format(sql3, [author_id, post_id]);
                    connectdb.query(sql3, function (err, result, fields) {
                        if (err) reject(err);
                        resolve({ like: false });
                    })
                }
            })
        });
    }

    getComments(postId) {
        let sql = "SELECT u.full_name, c.id, c.author_id, c.created_at, c.content, c.post_id FROM comment c INNER JOIN user u ON u.id = c.author_id WHERE c.post_id = ? ORDER BY c.created_at DESC";
        sql = mysql.format(sql, postId);
        return new Promise((resolve) => {
            connectdb.query(sql, function (err, result, fields) {
                // console.log(result)
                if (err) console.log(err);
                resolve(result);
            })
        })
    }

    createComment(sqlInserts) {
        let sql = 'INSERT INTO comment (content, author_id, post_id) VALUES(?, ?, ?)';
        sql = mysql.format(sql, sqlInserts);
        return new Promise((resolve, reject) => {
            connectdb.query(sql, function (err, result, fields) {
                if (err) reject(err);
                resolve({ message: 'Commented!' })
            })
        })
    }

    deleteComment(sqlInsert) {
        let sql1 = 'DELETE FROM comment WHERE post_id = ? AND id = ?';
        sql1 = mysql.format(sql1, sqlInsert);
        return new Promise((resolve, reject) => {
            connectdb.query(sql1, function (err, result) {
                if (err) reject(err);
                resolve({
                    message: 'Comment Deleted!'
                })
            })
        })
    }
};

module.exports = PostModels;