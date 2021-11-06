const connectdb = require('../connectdb.js');
const mysql = require('mysql');

class PostModels {

    getAllPosts() {
        let sql = "SELECT p.id, p.author_id, p.content, p.created_at, p.img_url, GROUP_CONCAT(u.id ORDER BY u.id) AS likes, COUNT(l.id) AS _count_likes, u_2.full_name, (SELECT COUNT(c.id) FROM comment c WHERE c.post_id = p.id ) AS _count_comments FROM post p LEFT JOIN `like` l ON l.target_id = p.id LEFT JOIN user u ON l.author_id = u.id INNER JOIN user u_2 ON p.author_id = u_2.id GROUP BY p.id ORDER BY p.created_at DESC";
        return new Promise((resolve) => {
            connectdb.query(sql, function (err, result, fields) {
                if (err) throw err;
                resolve(result)
            });
        })
    }

    createPost(sqlInserts) {
        let sql = 'INSERT INTO post (`content`, `author_id`) VALUES( ?, ?)';
        sql = mysql.format(sql, sqlInserts);
        return new Promise((resolve) => {
            connectdb.query(sql, function (err, result) {
                if (err) throw err;
                resolve({
                    postId: result.insertId,
                    message: 'New post created!'
                });
            })
        })
    }

    updatePost(sqlInserts1, sqlInserts2) {
        let sql1 = 'SELECT * FROM post where id = ?';
        sql1 = mysql.format(sql1, sqlInserts1);
        return new Promise((resolve) => {
            connectdb.query(sql1, function (err, result, fields) {
                if (err) throw err;
                if (sqlInserts2[2] == result[0].author_id) {
                    let sql2 = 'UPDATE post SET img_url = ? WHERE id = ? AND author_id = ?';
                    sql2 = mysql.format(sql2, sqlInserts2);
                    connectdb.query(sql2, function (err, result, fields) {
                        if (err) throw err;
                        resolve({ message: 'Post modified!' });
                    })
                } else {
                    reject({ error: 'Oops! something went wrong!' });
                }
            })
        });
    }

    getImage(sqlInsert) {
        let sql1 = 'SELECT img_url FROM post WHERE id = ?';
        sql1 = mysql.format(sql1, sqlInsert);
        return new Promise((resolve) => {
            connectdb.query(sql1, function (err, result) {
                if (err) throw err;
                resolve(result);
            })
        })
    }

    deletePost(sqlInsert) {
        let sql1 = 'DELETE FROM post WHERE id = ?';
        sql1 = mysql.format(sql1, sqlInsert);
        return new Promise((resolve) => {
            connectdb.query(sql1, function (err, result) {
                if (err) throw err;
                resolve({
                    message: 'Post Deleted!'
                })
            })
        })
    }

    likePost(sqlInserts1) {
        const post_id = sqlInserts1[0];
        const author_id = sqlInserts1[1];

        let sql1 = 'SELECT * FROM `like` where target_id = ? AND author_id = ?';
        sql1 = mysql.format(sql1, [post_id, author_id]);
        return new Promise((resolve) => {
            connectdb.query(sql1, function (err, result, fields) {
                // if (err) throw err;
                if (result == '') {
                    let sql2 = 'INSERT INTO `like`(author_id, target_id) VALUES (?, ?)';
                    sql2 = mysql.format(sql2, [author_id, post_id]);
                    connectdb.query(sql2, function (err, result, fields) {
                        if (err) throw err;
                        resolve({ like: true });
                    })
                }
                else if (sqlInserts1[1] == result[0].author_id) {
                    let sql3 = 'DELETE FROM `like` WHERE author_id = ? AND target_id = ?';
                    sql3 = mysql.format(sql3, [author_id, post_id]);
                    connectdb.query(sql3, function (err, result, fields) {
                        if (err) throw err;
                        resolve({ like: false });
                    })
                }
            })
        });
    }

    getComments(postId) {
        let sql = "SELECT   u.full_name, c.id, c.author_id, c.created_at, c.content FROM comment c INNER JOIN user u ON u.id = c.author_id WHERE c.post_id = ? ORDER BY c.created_at DESC";
        sql = mysql.format(sql, postId);
        return new Promise((resolve) => {
            connectdb.query(sql, function (err, result, fields) {
                // console.log(result)
                if (err) throw err;
                resolve(result);
            })
        })
    }

    createComment(sqlInserts) {
        let sql = 'INSERT INTO comment (content, author_id, post_id) VALUES(?, ?, ?)';
        sql = mysql.format(sql, sqlInserts);
        return new Promise((resolve) => {
            connectdb.query(sql, function (err, result, fields) {
                if (err) throw err;
                resolve({ message: 'Commented!' })
            })
        })
    }

    deleteComment(sqlInsert) {
        let sql1 = 'DELETE FROM comment WHERE post_id = ? AND id = ?';
        sql1 = mysql.format(sql1, sqlInsert);
        return new Promise((resolve) => {
            connectdb.query(sql1, function (err, result) {
                if (err) throw err;
                resolve({
                    message: 'Comment Deleted!'
                })
            })
        })
    }

    //     updateComment(sqlInserts1, sqlInserts2) {
    //         let sql1 = 'SELECT * FROM comments where id = ?';
    //         sql1 = mysql.format(sql1, sqlInserts1);
    //         return new Promise((resolve) => {
    //             connectdb.query(sql1, function (err, result, fields) {
    //                 if (err) throw err;
    //                 if (sqlInserts2[2] == result[0].userId) {
    //                     let sql2 = 'UPDATE comments SET comContent = ? WHERE id = ? AND userId = ?';
    //                     sql2 = mysql.format(sql2, sqlInserts2);
    //                     connectdb.query(sql2, function (err, result, fields) {
    //                         if (err) throw err;
    //                         resolve({ message: 'Commentaire modifié !' });
    //                     })
    //                 } else {
    //                     reject({ error: 'fonction indisponible' });
    //                 }
    //             })
    //         });
    //     }
    //     deleteComment(sqlInserts1, sqlInserts2) {
    //         let sql1 = 'SELECT * FROM comments where id = ?';
    //         sql1 = mysql.format(sql1, sqlInserts1);
    //         return new Promise((resolve, reject) => {
    //             connectdb.query(sql1, function (err, result, fields) {
    //                 if (err) throw err;
    //                 if (sqlInserts2[1] == result[0].userId) {
    //                     let sql2 = 'DELETE FROM comments WHERE id = ? AND userId = ?';
    //                     sql2 = mysql.format(sql2, sqlInserts2);
    //                     connectdb.query(sql2, function (err, result, fields) {
    //                         if (err) throw err;
    //                         resolve({ message: 'Commentaire supprimé !' });
    //                     })
    //                 } else {
    //                     reject({ error: 'fonction indisponible' });
    //                 }

    //             });
    //         })
    //     }


    //     getAllLikes() {
    //         let sql = 'SELECT * FROM likes';
    //         return new Promise((resolve) => {
    //             connectdb.query(sql, function (err, result, fields) {
    //                 if (err) throw err;
    //                 resolve(result)
    //             });
    //         })
    //     }
    //     postLike(sqlInserts1, sqlInserts2, liked) {
    //         let sql1 = 'INSERT INTO likes VALUES (NULL, ?, ?)';
    //         sql1 = mysql.format(sql1, sqlInserts1);
    //         let sql2 = 'UPDATE posts SET likes = ? WHERE id = ?';
    //         sql2 = mysql.format(sql2, sqlInserts2);
    //         let sql3 = 'DELETE FROM likes WHERE postId = ? AND userId = ?';
    //         sql3 = mysql.format(sql3, sqlInserts1);
    //         return new Promise((resolve) => {
    //             connectdb.query(sql2, function (err, result, fields) {
    //                 if (err) throw err;

    //             });
    //             if (liked === false) {
    //                 connectdb.query(sql1, function (err, result, fields) {
    //                     if (err) throw err;
    //                     resolve({ message: 'Like !' })
    //                 })
    //             }
    //             if (liked === true) {
    //                 connectdb.query(sql3, function (err, result, fields) {
    //                     if (err) throw err;
    //                     resolve({ message: 'Like annulé!' })
    //                 })
    //             }
    //         })

    //     }
};

module.exports = PostModels;