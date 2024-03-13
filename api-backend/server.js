const express = require('express');
const app = express();
const { connectToDatabase, insertOneIntoDatabase } = require('./db.js');
const { startServer } = require('./api_handles.js');

app.use(express.static('public'));

startServer(app);

const port = 3000;

(async function () {
    try {
        await connectToDatabase();
        // insertOneIntoDatabase(); // not used as for now
        app.listen(port, function() {
            console.log(`App started on port ${ port }`)
        });
    } catch (err) {
        console.log('ERROR!', err);
    }

}());