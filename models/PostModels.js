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

    getPost(sqlInsert) {
        let sql = "SELECT * FROM post WHERE id = ?";
        sql = mysql.format(sql, sqlInsert);
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
 
        console.log('post models, img_url: ' + img_url)
        
        let sql1 = 'SELECT * FROM post where id = ?';
        sql1 = mysql.format(sql1, postId);

        console.log('post models, sql1: ' + sql1)
        
        return new Promise((resolve) => {
            // update content
            connectdb.query(sql1, function (err, result, fields) {
                if (err) throw err;
                if (author_id == result[0].author_id) {
                    const old_url = result[0].img_url;
                    console.log(old_url);

                    let sql2 = 'UPDATE post SET content = ? WHERE id = ? AND author_id = ?';
                    sql2 = mysql.format(sql2, [content, postId, author_id]);
                    console.log('post models, sql2 (update content): ' + sql2)
                    
                    connectdb.query(sql2, function (err, result, fields){
                        if (err) throw err;
                        if (img_url != null){
                            let sql3 = 'UPDATE post SET img_url = ? WHERE id = ? AND author_id = ?';
                            sql3 = mysql.format(sql3, [img_url, postId, author_id]);
                            console.log('post models, sql3 (update image): ' + sql3)

                            connectdb.query(sql3, function (err, result, fields){
                                if (err) throw err;
                                if (old_url == null) {
                                    resolve({ message: 'Post updated.' })
                                }
                                resolve({ old_url: old_url }); //Send to controller, delete old file
                            })
                        } else {
                            resolve({ message: 'Post updated.'})
                        }
                    })
                }
            })
        })
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
        const post_id = sqlInsert;

        let sql1 = 'SELECT * FROM post WHERE id = ?';
        sql1 = mysql.format(sql1, post_id);
        return new Promise((resolve) => {
            connectdb.query(sql1, function (err, result) {
                if (err) throw err;
                if (result[0].img_url === null) {
                    let sql2 = 'DELETE FROM post WHERE id = ?';
                    sql2 = mysql.format(sql2, post_id);
                    connectdb.query(sql2, function (err, result, fields) {
                        if (err) throw err;
                        resolve({ img_url: '' });
                    })
                }
                else {
                    let img_url = result[0].img_url;
                    let sql2 = 'DELETE FROM post WHERE id = ?';
                    sql2 = mysql.format(sql2, post_id);
                    connectdb.query(sql2, function (err, result, fields) {
                        if (err) throw err;
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
};

module.exports = PostModels;