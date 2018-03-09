//SERVER SIDE

const spicedPg = require('spiced-pg');
const {dbUser, dbPass} = require('./secrets.json');
const db = spicedPg(`postgres:${dbUser}:${dbPass}@localhost:5432/imageboard`);
const {s3Url} = require("./config.json");

function getImages() {
    return new Promise((resolve, reject) => {
        const q = `SELECT * FROM images ORDER BY created_at DESC LIMIT 4`;
        db.query(q).then(results => {
            // console.log("results from our query:", results.rows);
            let images = results.rows;
            images.forEach(item => {
                let url = s3Url + item.image; //***important line
                item.image = url;
            });
            resolve(images);
        }).catch(err => {
            reject(err);
        });
    });
}

function addImagesToBrowser(title, description, username, image) {
    return new Promise(function(resolve, reject) {
        const q = `INSERT into images (title, description, username, image) VALUES ($1, $2, $3, $4) RETURNING *`;
        const params = [title, description, username, image];
        db.query(q, params).then(results => {
            let images = results.rows;
            images.forEach(item => {
                let url = s3Url + item.image;
                item.image = url;
            });
            resolve(images);
        }).catch(err => {
            reject(err);
        });
    });
}

function getImageInfo(selectedImageID) {
    return new Promise(function(resolve, reject) {
        const q = `SELECT * FROM images WHERE id = $1`;
        const params = [selectedImageID];
        db.query(q, params).then(results => {
            let images = results.rows;
            images.forEach(item => {
                let url = s3Url + item.image;
                item.image = url;
            });
            resolve(images);
        }).catch(err => {
            reject(err);
        });
    });
}

function postComment(comment, username, selectedImageID) {
    return new Promise(function(resolve, reject) {
        const q = `INSERT INTO comments (comment, username, image_id) VALUES ($1, $2, $3) RETURNING *`;
        const params = [comment, username, selectedImageID];
        db.query(q, params).then(results => {
            resolve(results.rows[0]); //ALWAYS RESULTS.ROWS IN DB QUERIES
        }).catch(err => {
            reject(err);
        });
    });
}

function getComment(selectedImageID) {
    return new Promise(function(resolve, reject) {
        const q = `SELECT * FROM comments WHERE image_id = $1`;
        const params = [selectedImageID];
        db.query(q, params).then(results => {
            resolve(results.rows); //if you're only trying to get 1 row back, you can do results.rows[0] --> here we're trying to get a lot of comments back so it's results.rows instead
        }).catch(err => {
            reject(err);
        });
    });
}

function getMorePics(lastImageID) {
    return new Promise(function(resolve, reject) {
        const q = `SELECT * FROM images WHERE id < $1 ORDER BY created_at DESC LIMIT 4`;
        const params = [lastImageID];
        db.query(q, params).then(results => {
            let images = results.rows;
            images.forEach(item => {
                let url = s3Url + item.image;
                item.image = url;
            });
            resolve(results.rows);
        }).catch(err => {
            reject(err);
        });
    });
}

module.exports = {
    getImages,
    addImagesToBrowser,
    getImageInfo,
    postComment,
    getComment,
    getMorePics
};
