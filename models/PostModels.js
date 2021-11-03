const connectdb = require('../connectdb.js');
const mysql = require('mysql');

class PostModels {

    getAllPosts() {
        // let sql = "SELECT post.id AS`P.ID`, post.content AS`P.content`, post.author_id AS`P.authorID`, user.id AS`U.ID`, user.full_name AS`U.name`, `like`.target_id AS`L.target`, `like`.author_id AS`L.authorID`, `like`.id AS`L.ID`, user_1.full_name AS`L.name`, comment.content AS`C.content`, comment.id AS`C.ID`, comment.author_id AS`C.authorID`, comment.post_id AS`C.targetID`, user_2.full_name AS`C.name`, post.created_at, post.img_url, comment.created_at FROM post LEFT OUTER JOIN user ON post.author_id = user.id LEFT OUTER JOIN`like` ON `like`.target_id = post.id LEFT OUTER JOIN user user_1 ON`like`.author_id = user_1.id LEFT OUTER JOIN comment ON comment.post_id = post.id LEFT OUTER JOIN user user_2 ON comment.author_id = user_2.id GROUP BY post.id ORDER BY post.created_at DESC";
        let sql = "SELECT p.id, p.content, p.created_at, p.img_url, GROUP_CONCAT(u.id ORDER BY u.id) AS likes, COUNT(l.id) AS _count_likes, u_2.full_name, (SELECT COUNT(c.id) FROM comment c WHERE c.post_id = p.id ) AS _count_comments FROM post p LEFT JOIN `like` l ON l.target_id = p.id LEFT JOIN user u ON l.author_id = u.id INNER JOIN user u_2 ON p.author_id = u_2.id GROUP BY p.id ORDER BY p.created_at DESC";
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


    //     getComments(sqlInserts) {
    //         let sql = "SELECT comments.comContent, DATE_FORMAT(comments.date, '%d/%m/%Y à %H:%i:%s') AS date, comments.id, comments.userId, users.firstName, users.lastName FROM comments JOIN users on comments.userId = users.id WHERE postId = ? ORDER BY date";
    //         sql = mysql.format(sql, sqlInserts);
    //         return new Promise((resolve) => {
    //             connectdb.query(sql, function (err, result, fields) {
    //                 if (err) throw err;
    //                 resolve(result);
    //             })

    //         })
    //     }
    //     createComment(sqlInserts) {
    //         let sql = 'INSERT INTO comments VALUES(NULL, ?, ?, NOW(), ?)';
    //         sql = mysql.format(sql, sqlInserts);
    //         return new Promise((resolve) => {
    //             connectdb.query(sql, function (err, result, fields) {
    //                 if (err) throw err;
    //                 resolve({ message: 'Nouveau commentaire !' })
    //             })
    //         })
    //     }
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