//SERVER SIDE

const express = require('express');
const app = express();
const db = require('./config/db');
const bodyParser = require('body-parser');

app.use(express.static('public'));

app.use(bodyParser.urlencoded({extended: false}));

app.get("/images", (req, res) => {
    db.getImages().then((images) => {
        res.json({images: images}); //SENDING RESPONSE BACK TO THE CLIENT --> WHATEVER WE PUT IN RES.JSON GETS CAPTURED IN AXIOS OF THE "THEN" OF OUR GET REQUEST
    });
});

app.listen(8080, () => console.log("Listening"));
