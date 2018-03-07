//SERVER SIDE

const spicedPg = require('spiced-pg');
const {dbUser, dbPass} = require('./secrets.json');
const db = spicedPg(`postgres:${dbUser}:${dbPass}@localhost:5432/imageboard`);
const {s3Url} = require("./config.json");

function getImages() {
    return new Promise((resolve, reject) => {
        const q = `SELECT * FROM images`;
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

module.exports = {
    getImages,
    addImagesToBrowser,
    getImageInfo
};
