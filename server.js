//SERVER SIDE

const express = require('express');
const app = express();
const db = require('./config/db');
const bodyParser = require('body-parser');
const multer = require('multer');
const uidSafe = require('uid-safe');
const path = require('path');
const s3 = require('./config/s3');
// const favicon = require('serve-favicon');

app.use(express.static('./public'));

app.use(bodyParser.urlencoded({extended: false}));

app.use(bodyParser.json()); //sending info over to server as an object so we need this line so req.body won't be empty anymore

var diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + '/uploads');
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

var uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});

app.post('/upload', uploader.single('file'), s3.upload, function(req, res) {
    // If nothing went wrong the file is already in the uploads directory
    if (req.file) {
        db.addImagesToBrowser(req.body.title, req.body.description, req.body.username, req.file.filename).then(results => {
            res.json({images: results[0]});
        });
        //db.query - insert in title, description, username, etc in req.body (EXCEPT FILE!) --> only wanna store file name (req.file.filename). then do some returning (data of the image - ex. id, file name, etc). THEN DO A THEN (res.json back the data of the new image)
    } else {
        res.json({success: false});
    }
});

app.get("/images", (req, res) => {
    db.getImages().then(images => {
        res.json({images}); //SENDING RESPONSE BACK TO THE CLIENT --> WHATEVER WE PUT IN RES.JSON GETS CAPTURED IN AXIOS OF THE "THEN" OF OUR GET REQUEST
    });
});

app.get("/modal/:selectedImageID", (req, res) => { //use req.params because of "/:"
    db.getImageInfo(req.params.selectedImageID).then(results => {
        db.getComment(req.params.selectedImageID).then(data => {
            res.json({results, data});
        });
    });
});

app.post("/comments", (req, res) => {
    db.postComment(req.body.comment, req.body.username, req.body.id).then(results => {
        res.json({results});
    });
});

app.get("/scroll/:lastImageID", (req, res) => {
    db.getMorePics(req.params.lastImageID).then(results => {
        res.json({results});
    });
});

app.listen(process.env.PORT || 8080);
