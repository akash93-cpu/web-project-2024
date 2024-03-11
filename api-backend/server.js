const express = require('express');
const app = express();
const { connectToDatabase, insertOneIntoDatabase } = require('./db.js');

app.use(express.static('public'));

(async function () {
    try {
        await connectToDatabase();
        // insertOneIntoDatabase();
        app.listen(3000, function() {
            console.log('App started on port 3000')
        });
    } catch (err) {
        console.log('ERROR!', err);
    }

}());